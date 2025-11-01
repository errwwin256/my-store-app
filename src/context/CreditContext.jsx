import { createContext, useContext, useEffect, useState } from "react";
import {
  collection,
  addDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const CreditContext = createContext();

export const CreditProvider = ({ children }) => {
  const [credits, setCredits] = useState([]);
  const [loading, setLoading] = useState(true);

  const creditsRef = collection(db, "credits");

  // 🔹 Fetch all credits
  const fetchCredits = async () => {
    setLoading(true);
    const snapshot = await getDocs(creditsRef);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setCredits(data);
    setLoading(false);
  };

  // 🔹 Add new credit (utang)
  const addCredit = async (creditData) => {
    await addDoc(creditsRef, {
      ...creditData,
      remaining: Number(creditData.amount) || 0, // ✅ Initialize remaining balance
      status: "Unpaid",
      createdAt: new Date(),
    });
    fetchCredits();
  };

  // 🔹 Update existing credit (e.g. mark as Paid or partial payment)
  const updateCredit = async (id, updatedData) => {
    const creditDoc = doc(db, "credits", id);
    await updateDoc(creditDoc, updatedData);
    fetchCredits();
  };

  // 🔹 Delete a credit record
  const deleteCredit = async (id) => {
    const creditDoc = doc(db, "credits", id);
    await deleteDoc(creditDoc);
    fetchCredits();
  };

  // ✅ Firestore Migration (Auto-Fix Missing Fields)
  useEffect(() => {
    const fixCredits = async () => {
      const snapshot = await getDocs(collection(db, "credits"));
      snapshot.docs.forEach(async (docSnap) => {
        const data = docSnap.data();

        // Add missing fields automatically
        if (data.remaining === undefined || data.status === undefined) {
          const remaining = data.remaining ?? data.amount ?? 0;
          const status = remaining <= 0 ? "Paid" : "Unpaid";

          await updateDoc(doc(db, "credits", docSnap.id), {
            remaining,
            status,
          });

          console.log(`✅ Fixed missing fields in credit: ${docSnap.id}`);
        }
      });
    };

    // Run both migration and data fetch
    fixCredits();
    fetchCredits();
  }, []);

  return (
    <CreditContext.Provider
      value={{
        credits,
        loading,
        addCredit,
        updateCredit,
        deleteCredit,
        fetchCredits,
      }}
    >
      {children}
    </CreditContext.Provider>
  );
};

export const useCredits = () => useContext(CreditContext);
