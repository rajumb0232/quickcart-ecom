import { Routes, Route, useLocation } from "react-router-dom";
import RequireAuth from "./routes/RequireAuth";
import CustomerDashboard from "./pages/customer/CustomerDashboad";
import SellerDashboard from "./pages/seller/SellerDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import HomePage from "./pages/public/home/Homepage";
import LoginPage from "./pages/auth/LoginPage";
import RequireUnAuth from "./routes/RequiresUnAuth";
import ProductSearchResultPage from "./pages/public/product/ProductSearchResultPage";
import Navbar from "./pages/public/Navbar";
import { ProductDetail } from "./pages/public/product/ProductDetail";
import { useDispatch } from "react-redux";
import { setScreenHeight } from "./features/util/screenSlice";
import { useEffect } from "react";

export default function App() {
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    function handleResize() {
      dispatch(setScreenHeight(window.innerHeight));
    }
    // Set initial height
    handleResize();
    // Add resize event listener
    window.addEventListener("resize", handleResize);

    // Cleanup on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [dispatch]);

  // 👇 Save the previous location when navigating to /sign
  const state = location.state as { backgroundLocation?: Location };

  return (
    <>
      <Navbar />
      {/* Main route layer — background page stays visible */}
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<ProductSearchResultPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />

        <Route
          path="/sign"
          element={
            <RequireUnAuth>
              <LoginPage />
            </RequireUnAuth>
          }
        />

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
