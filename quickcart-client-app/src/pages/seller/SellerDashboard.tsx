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

// Define the allowed view params strictly as a union type
type ViewParam = 
  | "dashboard" 
  | "store" 
  | "manageProducts"
  | "reports"
  | "profile"
  | "settings";

const SellerDashboard: React.FC = () => {
  // Explicitly tell TypeScript this param will be one of the ViewParam or undefined
  const { view } = useParams<{ view?: ViewParam }>();

  const navHeight = useSelector(selectNavHeight);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setShowCategories(false));
  }, [dispatch]);

  const renderView = () => {
    console.log(view);
    switch (view) {
      case "dashboard":
        return <Dashboard />;
      case "store":
        return <div>Store View (Replace with actual component)</div>;
      case "manageProducts":
        return <ManageProducts />;
      case "reports":
        return <Reports />;
      case "profile":
        return <UserProfilePage modal={true} />;
      case "settings":
        return <Settings />;
      default:
        return <Dashboard />; // default fallback view
    }
  };

  return (
    <div style={{ marginTop: `${navHeight - 36}px` }} className="flex">
      <DashboardSideBar />
      <main className="w-full">
        {renderView()}
      </main>
    </div>
  );
};

export default SellerDashboard;
