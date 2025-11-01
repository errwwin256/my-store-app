import { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase/firebaseConfig";
import {
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

const SalesContext = createContext();

export function SalesProvider({ children }) {
  const [sales, setSales] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSales = async () => {
    try {
      // ✅ Use consistent field name (createdAt)
      const q = query(collection(db, "sales"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);

      const data = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setSales(data);
    } catch (error) {
      console.error("❌ Error fetching sales:", error);
    } finally {
      setLoading(false);
    }
  };

  const recordSale = async (sale) => {
    try {
      // ✅ Always store both 'createdAt' and 'date' for compatibility
      await addDoc(collection(db, "sales"), {
        ...sale,
        createdAt: serverTimestamp(),
        date: serverTimestamp(),
      });

      await fetchSales();
      console.log("✅ Sale recorded successfully!");
    } catch (error) {
      console.error("❌ Error recording sale:", error);
    }
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <SalesContext.Provider value={{ sales, recordSale, loading }}>
      {children}
    </SalesContext.Provider>
  );
}

export const useSales = () => useContext(SalesContext);
