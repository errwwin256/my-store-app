import React from "react";
import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import { CreditProvider } from "./context/CreditContext";
import AppRouter from "./AppRouter"; // ✅ make sure filename matches (AppRouter.jsx)

// ✅ App entry with global providers
export default function App() {
  return (
    <AuthProvider>
      <ProductProvider>
        <CreditProvider>
          <AppRouter />
        </CreditProvider>
      </ProductProvider>
    </AuthProvider>
  );
}
