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

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const productsRef = collection(db, "products");

  // 🔹 Fetch all products from Firestore
  const fetchProducts = async () => {
    setLoading(true);
    const snapshot = await getDocs(productsRef);
    const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setProducts(data);
    setLoading(false);
  };

  // 🔹 Add new product
  const addProduct = async (productData) => {
    await addDoc(productsRef, productData);
    fetchProducts();
  };

  // 🔹 Update product
  const updateProduct = async (id, updatedData) => {
    const productDoc = doc(db, "products", id);
    await updateDoc(productDoc, updatedData);
    fetchProducts();
  };

  // 🔹 Delete product
  const deleteProduct = async (id) => {
    const productDoc = doc(db, "products", id);
    await deleteDoc(productDoc);
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        fetchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);
