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
import LinkButton from "../../../components/form/LinkButton";
import BlackButton from "../../../components/form/BlackButton";

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
    if(forcedBackStage) {
      dispatch(updateBuildStage(forcedBackStage));
    }
  };

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
        <div className="flex justify-between items-center mt-6">
          {forcedBackStage && (
            <LinkButton label="← Go Back" onClick={handleBack} />
          )}

          <div className="w-40">
            <BlackButton
              label="Continue"
              onClick={confirmCategoryIdToStore}
              disabled={selectedNames.length < 3 || selectedLevel3Id === null}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categorize;
