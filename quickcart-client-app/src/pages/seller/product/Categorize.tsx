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
} from "../../../features/product/productBuilderSelectors";

const Categorize: React.FC = () => {
  const dispatch = useDispatch();
  const categoriesIfSelected = useSelector(selectCategoryPathInProductReq);
  const categoryIdIfSelected = useSelector(selectCategoryIdInProductReq);

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
      dispatch(updateBuildStage("next"));
      console.log("Confirmed Level 3 Category ID:", selectedLevel3Id);
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (categoryIdIfSelected) {
      if (categoriesIfSelected && categoriesIfSelected.length > 0) handleConfirmNames(categoriesIfSelected);

      handleSetChildMostId(categoryIdIfSelected);
    }
  }, []);

  return (
    <div className="w-full flex flex-col justify-center items-center">
      <div className="w-full">
        {/* Category Selector */}
        <h1 className="text-xl mb-6">Select the product category</h1>
        <div>
          <CategoryFilter
            isOpen={isOpen}
            onToggle={handleToggle}
            onConfirm={handleConfirmNames}
            setChildMostId={handleSetChildMostId}
            priorSelCat={categoriesIfSelected}
          />
        </div>

        {/* Confirm Button aligned to right below the selector */}
        <div className="flex justify-end mt-3">
          <button
            type="button"
            onClick={confirmCategoryIdToStore}
            disabled={
              selectedNames.length < 3 || selectedLevel3Id === null
            }
            className="bg-black text-white px-4 py-2 rounded disabled:opacity-50"
          >
            Confirm Selection
          </button>
        </div>
      </div>
    </div>
  );
};

export default Categorize;
