import type React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectSelectStores } from "../../../features/product/sellerStoreSelectors";
import { setViewStore } from "../../../features/product/sellerStoreSlice";
import {
  Store as StoreIcon,
  MapPin,
  Phone,
  Mail,
  Calendar,
  Clock,
  Edit3,
  Eye,
  TrendingUp,
  Package,
} from "lucide-react";

const Store: React.FC = () => {
  const sellerStores = useSelector(selectSelectStores);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSetAsCurrentView = (storeId: string) => {
    const selectedStore = sellerStores.find((s) => s.store_id === storeId);
    if (selectedStore) dispatch(setViewStore(selectedStore));
  };

  const handleEditStore = (storeId: string) => {
    navigate(`/store/${storeId}`);
  };

  // Generate random stats for demonstration
  const getRandomStats = () => ({
    products: Math.floor(Math.random() * 200) + 50,
    sales: Math.floor(Math.random() * 1000) + 100,
    revenue: Math.floor(Math.random() * 50000) + 10000,
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 px-3 flex items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Stores</h1>
            <p className="text-gray-600">
              Manage and monitor your store locations
            </p>
          </div>
          <button className="ml-auto px-6 py-2 my-1 border-[1.5px] rounded-lg hover:bg-gray-900 hover:text-gray-100 transform transition duration-75 cursor-pointer"
          onClick={() => navigate("/store")}
          >
            Create Store
          </button>
        </div>

        {/* Stores Grid */}
        {sellerStores && sellerStores.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {sellerStores.map((store) => {
              const stats = getRandomStats();
              return (
                <div
                  key={store.store_id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-300"
                >
                  {/* Header Section with Gradient */}
                  <div className="bg-teal-600 p-6 text-white">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                          <StoreIcon size={24} className="text-white" />
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold">{store.name}</h2>
                          <div className="flex items-center gap-2 mt-1 text-white/95">
                            <MapPin size={14} />
                            <span className="text-sm">{store.location}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-3 gap-3 mt-4">
                      <div className="bg-white/15 backdrop-blur-sm rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <Package size={16} />
                          <span className="text-xs font-medium">Products</span>
                        </div>
                        <p className="text-xl font-bold">{stats.products}</p>
                      </div>
                      <div className="bg-white/15 backdrop-blur-sm rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp size={16} />
                          <span className="text-xs font-medium">Sales</span>
                        </div>
                        <p className="text-xl font-bold">{stats.sales}</p>
                      </div>
                      <div className="bg-white/15 backdrop-blur-sm rounded-lg p-3">
                        <div className="flex items-center gap-2 mb-1">
                          <TrendingUp size={16} />
                          <span className="text-xs font-medium">Revenue</span>
                        </div>
                        <p className="text-lg font-bold">
                          ${(stats.revenue / 1000).toFixed(1)}k
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Content Section */}
                  <div className="p-6">
                    {/* Contact Information */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center">
                          <Phone size={16} className="text-orange-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">
                            Contact Number
                          </p>
                          <p className="text-sm font-medium">
                            {store.contact_number}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 text-gray-700">
                        <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                          <Mail size={16} className="text-amber-600" />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Email Address</p>
                          <p className="text-sm font-medium">{store.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* About Section */}
                    <div className="mb-4">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                        About
                      </h3>
                      <p className="text-sm text-gray-600 line-clamp-3">
                        {store.about}
                      </p>
                    </div>

                    {/* Timeline */}
                    <div className="flex items-center gap-4 mb-6 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>
                          Created:{" "}
                          {new Date(store.created_date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={14} />
                        <span>
                          Updated:{" "}
                          {new Date(
                            store.last_modified_date
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <button
                        type="button"
                        className="flex-1 bg-amber-400 text-white px-4 py-3 rounded-xl hover:bg-amber-500 focus:outline-none font-medium transition-all flex items-center justify-center gap-2 shadow-sm"
                        onClick={() => handleSetAsCurrentView(store.store_id)}
                      >
                        <Eye size={18} />
                        <span>Set as Current View</span>
                      </button>
                      <button
                        type="button"
                        className="px-4 py-3 bg-gray-100 rounded-xl border border-gray-200 hover:bg-gray-200 text-gray-700 transition-all flex items-center justify-center gap-2"
                        onClick={() => handleEditStore(store.store_id)}
                        aria-label="Edit Store"
                      >
                        <Edit3 size={18} />
                        <span className="font-medium">Edit</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <StoreIcon size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Stores Found
            </h3>
            <p className="text-gray-500 text-center max-w-md">
              You haven't created any stores yet. Create your first store to
              start selling your products.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Store;
