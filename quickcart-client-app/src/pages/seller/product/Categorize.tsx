import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CategoryFilter from "../../public/product/CategoryFilter";
import {
  setCategoryIdToProductRequest,
  setCategoryPathOfProductRequest,
  updateBuildStage,
} from "../../../features/product/productBuilderSlice";
import {
  selectCategoryIdInProductReq,
  selectCategoryPathInProductReq,
  selectForcedBackStage,
} from "../../../features/product/productBuilderSelectors";
import {
  Layers,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const Categorize: React.FC = () => {
  const dispatch = useDispatch();
  const categoriesIfSelected = useSelector(selectCategoryPathInProductReq);
  const categoryIdIfSelected = useSelector(selectCategoryIdInProductReq);
  const forcedBackStage = useSelector(selectForcedBackStage);

  const [isOpen, setIsOpen] = useState(false);
  const [selectedNames, setSelectedNames] = useState<string[]>([]);
  const [selectedLevel3Id, setSelectedLevel3Id] = useState<string | null>(null);

  const handleToggle = () => setIsOpen((prev) => !prev);
  const handleConfirmNames = (names: string[]) => setSelectedNames(names);
  const handleSetChildMostId = (categoryId: string | null) =>
    setSelectedLevel3Id(categoryId);

  const confirmCategoryIdToStore = () => {
    if (selectedLevel3Id !== null) {
      dispatch(setCategoryIdToProductRequest(selectedLevel3Id));
      dispatch(setCategoryPathOfProductRequest(selectedNames));
      dispatch(updateBuildStage(forcedBackStage ? forcedBackStage : "next"));
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (categoryIdIfSelected) {
      if (categoriesIfSelected && categoriesIfSelected.length > 0)
        handleConfirmNames(categoriesIfSelected);
      handleSetChildMostId(categoryIdIfSelected);
    }
  }, []);

  const handleBack = () => {
    if (forcedBackStage) {
      dispatch(updateBuildStage(forcedBackStage));
    }
  };

  const isComplete = selectedNames.length >= 3 && selectedLevel3Id !== null;

  return (
    <div className="w-full max-w-4xl mx-auto px-6">

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl overflow-hidden">

        <div className="p-8">

          {/* Category Selection */}
          <div className="mb-6">
            <CategoryFilter
              isOpen={isOpen}
              onToggle={handleToggle}
              onConfirm={handleConfirmNames}
              setChildMostId={handleSetChildMostId}
              priorSelCat={categoriesIfSelected}
            />
          </div>

          {/* Selected Category Display */}
          {selectedNames.length > 0 && (
            <div className="bg-linear-to-r from-teal-50 to-cyan-50 rounded-xl border-2 border-teal-200 p-6 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center shrink-0 mt-1">
                  <CheckCircle size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-gray-700 mb-2">
                    Selected Category Path:
                  </h3>
                  <div className="flex items-center gap-2 flex-wrap">
                    {selectedNames.map((name, index) => (
                      <React.Fragment key={index}>
                        <span className="px-3 py-1.5 bg-white border border-teal-300 rounded-lg text-sm font-medium text-gray-900 shadow-sm">
                          {name}
                        </span>
                        {index < selectedNames.length - 1 && (
                          <ArrowRight size={16} className="text-teal-600" />
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Warning Message */}
          {!isComplete && (
            <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertCircle
                  size={20}
                  className="text-amber-600 shrink-0 mt-0.5"
                />
                <div>
                  <h4 className="text-sm font-semibold text-amber-900 mb-1">
                    Complete Category Selection
                  </h4>
                  <p className="text-xs text-amber-700">
                    Please select all 3 levels of categories to continue.
                    Navigate through the category tree to reach the most
                    specific category for your product.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4 pt-4 border-t-2 border-gray-200">
            {forcedBackStage ? (
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center gap-2"
              >
                <ArrowLeft size={18} />
                Go Back
              </button>
            ) : (
              <div /> // Empty div to maintain layout
            )}

            <button
              onClick={confirmCategoryIdToStore}
              disabled={!isComplete}
              className={`px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg ${
                isComplete
                  ? "bg-linear-to-r from-teal-500 to-cyan-600 text-white hover:from-teal-600 hover:to-cyan-700 shadow-teal-200"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
              }`}
            >
              <span>Continue</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Help Text */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          💡 Tip: Selecting the right category helps customers find your product
          easily
        </p>
      </div>
    </div>
  );
};

export default Categorize;
