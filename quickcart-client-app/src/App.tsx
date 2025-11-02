import { Routes, Route, useLocation } from "react-router-dom";
import RequireAuth from "./routes/RequireAuth";
import CustomerDashboard from "./pages/customer/CustomerDashboad";
import SellerDashboard from "./pages/seller/SellerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import HomePage from "./pages/public/home/Homepage";
import LoginPage from "./pages/auth/LoginPage";

export default function App() {
  const location = useLocation();

  // 👇 Save the previous location when navigating to /sign
  const state = location.state as { backgroundLocation?: Location };

  return (
    <>
      {/* Main route layer — background page stays visible */}
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/sign" element={<LoginPage />} />

        <Route
          path="/customer/*"
          element={
            <RequireAuth allowedRoles={["customer", "admin"]}>
              <CustomerDashboard />
            </RequireAuth>
          }
        />

        <Route
          path="/seller/*"
          element={
            <RequireAuth allowedRoles={["seller", "admin"]}>
              <SellerDashboard />
            </RequireAuth>
          }
        />

        <Route
          path="/admin/*"
          element={
            <RequireAuth allowedRoles={["admin"]}>
              <AdminDashboard />
            </RequireAuth>
          }
        />
      </Routes>

      {/* Modal route layer — rendered *over* the background page */}
      {state?.backgroundLocation && (
        <Routes>
          <Route path="/sign" element={<LoginPage modal />} />
        </Routes>
      )}
    </>
  );
}
