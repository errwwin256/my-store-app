import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import AppRouter from "./router";
import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";
import { SalesProvider } from "./context/SalesContext";
import { CreditProvider } from "./context/CreditContext"; // ✅ Add this
import "./styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <ProductProvider>
          <SalesProvider>
            <CreditProvider>
              {" "}
              {/* ✅ Wrap it here */}
              <AppRouter />
            </CreditProvider>
          </SalesProvider>
        </ProductProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
