import React, { useEffect } from "react";
import DashboardSideBar from "./DashboardSideBar";
import { useDispatch, useSelector } from "react-redux";
import { selectNavHeight } from "../../features/util/screenSelector";
import { setShowCategories } from "../../features/util/screenSlice";
import Dashboard from "./views/Dashboard";
import ManageProducts from "./views/ManageProduct";
import Reports from "./views/Reports";
import UserProfilePage from "../auth/UserProfilePage";
import Settings from "./views/Settings";
import { useParams } from "react-router-dom";
import { selectSelectStores } from "../../features/product/sellerStoreSelectors";
import { useGetSellerStores } from "../../hooks/useStore";
import { isApiResponse } from "../../types/apiResponseType";
import {
  setSellerStores,
  setViewStore,
} from "../../features/product/sellerStoreSlice";
import Store from "./views/Store";

// Define the allowed view params strictly as a union type
type ViewParam =
  | "dashboard"
  | "store"
  | "manageProducts"
  | "reports"
  | "profile"
  | "settings";

const SellerDashboard: React.FC = () => {
  const { view } = useParams<{ view?: ViewParam }>();

  const navHeight = useSelector(selectNavHeight);
  const dispatch = useDispatch();
  const sellerStores = useSelector(selectSelectStores);

  // ✅ Call the hook outside of useEffect
  const { data } = useGetSellerStores();

  useEffect(() => {
    // only update state if not already loaded
    if (data && isApiResponse(data)) {
      const storeDetails = data.data || [];
      dispatch(setSellerStores(storeDetails));
      if (storeDetails.length > 0) {
        dispatch(setViewStore(storeDetails[0]));
      }
    }
  }, [sellerStores.length, data, dispatch]);

  useEffect(() => {
    dispatch(setShowCategories(false));
  }, [dispatch]);

  const renderView = () => {
    switch (view) {
      case "dashboard":
        return <Dashboard />;
      case "store":
        return <Store />;
      case "manageProducts":
        return <ManageProducts />;
      case "reports":
        return <Reports />;
      case "profile":
        return <UserProfilePage modal={true} />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div style={{ marginTop: `${navHeight - 36}px` }} className="flex">
      <DashboardSideBar />
      <main className="w-full">{renderView()}</main>
    </div>
  );
};

export default SellerDashboard;
