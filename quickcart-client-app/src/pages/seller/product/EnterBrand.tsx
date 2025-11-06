import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  setBrandToProductRequest,
  updateBuildStage,
} from "../../../features/product/productBuilderSlice";
import { selectBrandInProductReq, selectForcedBackStage } from "../../../features/product/productBuilderSelectors";
import Input from "../../../components/form/Input";
import LinkButton from "../../../components/form/LinkButton";
import BlackButton from "../../../components/form/BlackButton";
import BrandFilter from "../../public/product/BrandFilter";

const EnterBrand: React.FC = () => {
  const dispatch = useDispatch();
  const savedBrand = useSelector(selectBrandInProductReq);
  const forcedBackStage = useSelector(selectForcedBackStage);
  const [brand, setBrand] = useState<string>(savedBrand ?? "");

  // Hydrate local state from Redux when savedBrand becomes available or changes
  useEffect(() => {
    if (typeof savedBrand === "string") {
      setBrand(savedBrand);
    }
  }, [savedBrand]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrand(e.target.value);
  };

  const handleBack = () => {
    dispatch(updateBuildStage(forcedBackStage ? forcedBackStage : "stage2")); // go back to title entry
  };

  const handleNext = () => {
    const trimmed = brand.trim();
    if (!trimmed) return;
    dispatch(setBrandToProductRequest(trimmed));
    dispatch(updateBuildStage(forcedBackStage ? forcedBackStage : "next"));
  };

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-6 p-6">
      <div className="w-full">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Enter Brand Name
        </h2>

        <BrandFilter
          onSelect={(b) => setBrand(b)}
          selectedBrand={savedBrand}
        />

        <div className="flex justify-between items-center mt-6">
          <LinkButton label="← Go Back" onClick={handleBack} />

          <div className="w-40">
            <BlackButton
              label="Continue"
              onClick={handleNext}
              disabled={!brand.trim()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterBrand;
