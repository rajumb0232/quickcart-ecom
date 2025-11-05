import type React from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectSelectStores } from "../../../features/product/sellerStoreSelectors";
import { setViewStore } from "../../../features/product/sellerStoreSlice";

const Store: React.FC = () => {
  const sellerStores = useSelector(selectSelectStores);
  const dispatch = useDispatch();

  const handleSetAsCurrentView = (storeId: string) => {
    const selectedStore = sellerStores.find((s) => s.store_id === storeId);
    if (selectedStore) dispatch(setViewStore(selectedStore));
  };

  return (
    <div className="max-w-10/12 w-full mx-auto py-8 px-2">
      <h2 className="text-3xl font-bold mb-8 text-center">All Stores</h2>
      <div className="flex flex-col gap-6 w-full">
        {sellerStores && sellerStores.length > 0 ? (
          sellerStores.map((store) => (
            <div
              key={store.store_id}
              className="w-full bg-white rounded-xl p-6 flex flex-col border border-gray-200 hover:bg-gray-100"
              style={{ minHeight: 320 }}
            >
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{store.name}</h3>
                <p className="text-base text-gray-600 mb-3">{store.location}</p>
              </div>
              <div className="mb-2">
                <div className="text-xs text-gray-700 mb-1">
                  <span className="font-medium">Contact:</span> {store.contact_number}
                </div>
                <div className="text-xs text-gray-700 mb-1">
                  <span className="font-medium">Email:</span> {store.email}
                </div>
              </div>
              <p 
                className="
                  text-sm text-gray-600 mb-4 
                  line-clamp-3
                "
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {store.about}
              </p>
              <div className="flex justify-between items-end mt-auto pt-2">
                <div>
                  <div className="text-xs text-gray-400">
                    <span className="font-medium">Created:</span> {new Date(store.created_date).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-gray-400">
                    <span className="font-medium">Last Modified:</span> {new Date(store.last_modified_date).toLocaleDateString()}
                  </div>
                </div>
                <button
                  type="button"
                  className="
                    bg-black text-white px-5 py-2 rounded-lg 
                    hover:bg-gray-900 focus:outline-none text-sm 
                    transition-all font-medium
                  "
                  onClick={() => handleSetAsCurrentView(store.store_id)}
                  style={{ maxWidth: "max-content" }}
                >
                  Set as Current View
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-500">No stores found.</p>
        )}
      </div>
    </div>
  );
};

export default Store;
