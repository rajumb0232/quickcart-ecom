import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  setBrandToProductRequest,
  updateBuildStage,
} from "../../../features/product/productBuilderSlice";
import { selectBrandInProductReq } from "../../../features/product/productBuilderSelectors";
import Input from "../../../components/form/Input";
import LinkButton from "../../../components/form/LinkButton";
import BlackButton from "../../../components/form/BlackButton";

const EnterBrand: React.FC = () => {
  const dispatch = useDispatch();
  const savedBrand = useSelector(selectBrandInProductReq);
  const [brand, setBrand] = useState(savedBrand ?? "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBrand(e.target.value);
  };

  const handleBack = () => {
    dispatch(updateBuildStage("stage2")); // go back to title entry
  };

  const handleNext = () => {
    if (!brand.trim()) return;
    dispatch(setBrandToProductRequest(brand.trim()));
    dispatch(updateBuildStage("next")); // proceed to stage4 (write_description)
  };

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-6 p-6">
      <div className="w-full">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Enter Brand Name
        </h2>

        <Input
          label="Brand Name"
          type="text"
          name="brandName"
          placeholder="Enter or create a new brand name"
          value={brand}
          onChange={handleChange}
          required
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
