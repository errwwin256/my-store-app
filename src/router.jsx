import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// 📦 Pages
import AdminLogin from "./pages/Auth/AdminLogin";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import ProductList from "./pages/Products/ProductList";
import AddProduct from "./pages/Products/AddProduct";
import EditProduct from "./pages/Products/EditProduct";
import CreditPage from "./pages/Credit/CreditPage";
import SalesRecording from "./pages/Sales/SalesRecording";
import ReportsPage from "./pages/Sales/Reports";
import Profile from "./pages/Settings/Profile";

// 🧩 Layout
import MainLayout from "./components/Layout/MainLayout";

// 🔐 Protected Route Wrapper
function ProtectedRoute({ children }) {
  const { user } = useAuth(); // ✅ FIXED: changed from currentUser → user
  if (!user) return <Navigate to="/" replace />;
  return children;
}

export default function AppRouter() {
  return (
    <Routes>
      {/* Public Route */}
      <Route path="/" element={<AdminLogin />} />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <DashboardPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/products"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ProductList />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/add-product"
        element={
          <ProtectedRoute>
            <MainLayout>
              <AddProduct />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/edit-product/:id"
        element={
          <ProtectedRoute>
            <MainLayout>
              <EditProduct />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/credits"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CreditPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/sales"
        element={
          <ProtectedRoute>
            <MainLayout>
              <SalesRecording />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ReportsPage />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      <Route
        path="/settings/profile"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Profile />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* 404 Page */}
      <Route
        path="*"
        element={
          <h1 className="text-center mt-10 text-2xl">404 - Page Not Found</h1>
        }
      />
    </Routes>
  );
}
