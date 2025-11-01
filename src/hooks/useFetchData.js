import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

/**
 * Custom hook to fetch data from any Firestore collection.
 * @param {string} collectionName - Firestore collection name
 */
export default function useFetchData(collectionName) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const querySnapshot = await getDocs(collection(db, collectionName));
      const fetchedData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(fetchedData);
    } catch (err) {
      console.error(`Error fetching ${collectionName}:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionName]);

  return { data, loading, error, refresh: fetchData };
}
