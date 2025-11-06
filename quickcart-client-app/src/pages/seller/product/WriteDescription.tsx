import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  setDescriptionToProductRequest,
  updateBuildStage,
} from "../../../features/product/productBuilderSlice";
import { selectDescriptionInProductReq } from "../../../features/product/productBuilderSelectors";
import LinkButton from "../../../components/form/LinkButton";
import BlackButton from "../../../components/form/BlackButton";

const WriteDescription: React.FC = () => {
  const dispatch = useDispatch();
  const savedDescription = useSelector(selectDescriptionInProductReq);
  const [description, setDescription] = useState(savedDescription ?? "");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleBack = () => {
    dispatch(updateBuildStage("stage3")); // go back to brand entry
  };

  const handleSubmit = () => {
    if (!description.trim()) return;
    dispatch(setDescriptionToProductRequest(description.trim()));
    dispatch(updateBuildStage("next")); // move to next step (if any) or finish
    console.log("✅ Product Description Saved:", description.trim());
  };

  return (
    <div className="w-full flex flex-col items-center justify-center space-y-6 p-6">
      <div className="w-full">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Write Product Description
        </h2>

        <div>
          <label
            htmlFor="productDescription"
            className="block text-gray-700 mb-1"
          >
            Product Description
          </label>
          <textarea
            id="productDescription"
            name="productDescription"
            placeholder="Enter a detailed product description"
            value={description}
            onChange={handleChange}
            required
            rows={6}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-black resize-none"
          />
        </div>

        <div className="flex justify-between items-center mt-6">
          <LinkButton label="← Go Back" onClick={handleBack} />

          <div className="w-40">
            <BlackButton
              label="Finish"
              onClick={handleSubmit}
              disabled={!description.trim()}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteDescription;
