import React, { useEffect, useState } from "react";
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
import { useGetSellerStores } from "../../hooks/useStore";
import { isApiResponse } from "../../types/apiResponseType";
import { rehydrateViewStore } from "../../features/product/sellerStoreSlice";
import Store from "./views/Store";
import { RotateCcw, StoreIcon } from "lucide-react";

// Strict view param type
type ViewParam =
  | "dashboard"
  | "store"
  | "manage-products"
  | "reports"
  | "profile"
  | "settings";

const SellerDashboard: React.FC = () => {
  const { view } = useParams<{ view?: ViewParam }>();
  const navHeight = useSelector(selectNavHeight);
  const dispatch = useDispatch();
  const [storeLoaded, setStoreLoaded] = useState(false);

  // ✅ Fetch seller stores
  const { data, isSuccess } = useGetSellerStores();

  // ✅ Rehydrate view store once stores are loaded
  useEffect(() => {
    if (isSuccess) {
      if (data && isApiResponse(data)) {
        const stores = data.data;
        dispatch(rehydrateViewStore(stores));
        setStoreLoaded(true);
      }
    }
  }, [isSuccess, data, dispatch]);

  useEffect(() => {
    dispatch(setShowCategories(false));
  }, [dispatch]);

  const renderView = () => {
    switch (view) {
      case "dashboard":
        return <Dashboard />;
      case "store":
        return <Store />;
      case "manage-products":
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
  }; // Render loader until store info is loaded

  if (!storeLoaded) {
    return (
      <div
        style={{ marginTop: `${navHeight - 40}px` }}
        className="flex flex-col items-center justify-center py-16 min-h-screen"
      >
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <StoreIcon size={40} className="text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          No Stores Found
        </h3>
        <p className="text-gray-500 text-center max-w-md">
          You haven't created any stores yet. Create your first store to start
          selling your products.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-2 flex bg-gray-700 text-white rounded-lg hover:bg-gray-900 transition-colors"
        >
          <RotateCcw />
          <span className="ml-2">Reload</span>
        </button>
      </div>
    );
  } // Once loaded, show dashboard

  return (
    <div style={{ marginTop: `${navHeight - 40}px` }} className="flex">
      <DashboardSideBar />{" "}
      <main className="w-full overflow-y-scroll ">{renderView()}</main>{" "}
    </div>
  );
};

export default SellerDashboard;
