import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
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
import "./api/interceptors";
import { Footer } from "./pages/public/home/DummySubscribeFooter";
import LogoutConfirmModal from "./pages/auth/LogoutConfirmModal";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserProfilePage from "./pages/auth/UserProfilePage";
import ListProduct from "./pages/seller/product/ListProduct";
import StoreForm from "./pages/seller/store/StoreForm";
import { rehydrateViewStore } from "./features/product/sellerStoreSlice";
import { useGetSellerStores } from "./hooks/useStore";

export default function App() {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // ✅ Dynamically set screen height
  useEffect(() => {
    function handleResize() {
      dispatch(setScreenHeight(window.innerHeight));
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [dispatch]);

  // ✅ Fetch seller stores
  const { data: sellerStores, isSuccess } = useGetSellerStores();

  // ✅ Rehydrate view store once stores are loaded
  useEffect(() => {
    if (isSuccess && Array.isArray(sellerStores)) {
      console.log("🔄 Rehydrating viewStore with:", sellerStores);
      dispatch(rehydrateViewStore(sellerStores));
    }
  }, [isSuccess, sellerStores, dispatch]);

  // 👇 Save background location for modal routing
  const state = location.state as { backgroundLocation?: Location };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <Navbar />

      {/* Main route layer */}
      <Routes location={state?.backgroundLocation || location}>
        <Route path="/" element={<HomePage />} />
        <Route path="/search" element={<ProductSearchResultPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route
          path="/profile"
          element={
            <RequireAuth allowedRoles={["customer", "admin", "seller"]}>
              <UserProfilePage modal={false} />
            </RequireAuth>
          }
        />
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
          path="/seller/:view"
          element={
            <RequireAuth allowedRoles={["seller", "admin"]}>
              <SellerDashboard />
            </RequireAuth>
          }
        />
        <Route
          path="/list-product"
          element={
            <RequireAuth allowedRoles={["seller"]}>
              <ListProduct />
            </RequireAuth>
          }
        />
        <Route
          path="/store/:storeId?"
          element={
            <RequireAuth allowedRoles={["seller"]}>
              <StoreForm />
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

      {/* Modal routes */}
      {state?.backgroundLocation && (
        <Routes>
          <Route path="/sign" element={<LoginPage modal />} />
        </Routes>
      )}

      {/* Logout confirmation modal */}
      {state?.backgroundLocation && (
        <LogoutConfirmModal
          open={location.pathname === "/logout"}
          onClose={() => navigate(-1)}
          onConfirm={() => navigate(-1)}
        />
      )}

      <Footer />
    </>
  );
}
