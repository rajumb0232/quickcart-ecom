import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  setTitleToProductRequest,
  updateBuildStage,
} from "../../../features/product/productBuilderSlice";
import { selectForcedBackStage, selectTitleInProductReq } from "../../../features/product/productBuilderSelectors";
import Input from "../../../components/form/Input";
import LinkButton from "../../../components/form/LinkButton";
import BlackButton from "../../../components/form/BlackButton";

const EnterTitle: React.FC = () => {
  const dispatch = useDispatch();
  const savedTitle = useSelector(selectTitleInProductReq);
  const forcedBackStage = useSelector(selectForcedBackStage);
  const [title, setTitle] = useState(savedTitle ?? "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  // 👇 Use the correct key name the slice expects
  const handleBack = () => {
    dispatch(updateBuildStage(forcedBackStage ? forcedBackStage : "stage1")); // goes back to "select_category"
  };

  const handleNext = () => {
    if (!title.trim()) return;
    dispatch(setTitleToProductRequest(title.trim()));
    dispatch(updateBuildStage(forcedBackStage ? forcedBackStage : "next")); // advances to stage3 ("enter_brand")
  };

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-6 p-6">
      <div className="w-full">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Enter Product Title
        </h2>

        <Input
          label="Product Title"
          type="text"
          name="productTitle"
          placeholder="Enter product title"
          value={title}
          onChange={handleChange}
          required
        />

        <div className="flex justify-between items-center mt-6">
          <LinkButton label="← Go Back" onClick={handleBack} />

          <div className="w-40">
            <BlackButton
              label="Continue"
              onClick={handleNext}
              disabled={!title.trim()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterTitle;
