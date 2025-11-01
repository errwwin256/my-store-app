import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase"; // adjust path if needed

export const addSale = async (saleData) => {
  try {
    const cleanData = {
      productId: saleData.productId || "",
      productName: saleData.productName || "Unnamed Product",
      quantity: Number(saleData.quantity) || 0,
      amount: Number(saleData.total) || 0, // ✅ match what SalesRecording sends
      customer: saleData.customer || "Walk-in",
      date: serverTimestamp(), // Firestore server time
    };

    await addDoc(collection(db, "sales"), cleanData);
    console.log("✅ Sale added successfully!");
  } catch (error) {
    console.error("❌ Error adding sale:", error);
  }
};
