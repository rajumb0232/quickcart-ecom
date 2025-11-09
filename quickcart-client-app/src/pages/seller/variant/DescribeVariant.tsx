import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  moveToNextStage,
  moveToPrevStage,
  setVariantDesc,
} from "../../../features/variant/variantBuilderSlice";
import { selectVariantRequestAtBuilder } from "../../../features/variant/variantBuilderSelector";
import type { VariantRequest } from "../../../types/productTypes";
import { ArrowLeft, ArrowRight, FileText, CheckCircle } from "lucide-react";

export interface DescribeVariantProps {
  onSubmit: () => void;
}

const MAX_LENGTH = 800;

const DescribeVariant: React.FC<DescribeVariantProps> = ({ onSubmit }) => {
  const dispatch = useDispatch();
  const variantReq: VariantRequest = useSelector(selectVariantRequestAtBuilder);
  const [desc, setDesc] = useState<string>(variantReq.description ?? "");

  useEffect(() => {
    if (variantReq.description) setDesc(variantReq.description);
  }, [variantReq.description]);

  const handleSubmit = () => {
    if (desc.trim() !== "") {
      if (variantReq.description !== desc.trim()) {
        dispatch(setVariantDesc(desc.trim()));
        onSubmit();
      } else {
        dispatch(moveToNextStage());
      }
    }
  };

  const handleBack = () => {
    dispatch(moveToPrevStage());
  };

  const charCount = desc.length;
  const isValid = charCount > 10 && charCount <= MAX_LENGTH;

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-6">
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-linear-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center">
            <FileText size={20} className="text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Describe Your Variant
            </h2>
            <p className="text-sm text-gray-500">
              Add a detailed description highlighting key features and qualities.
            </p>
          </div>
        </div>

        {/* Textarea */}
        <div className="mb-4">
          <label
            htmlFor="variantDescription"
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Description <span className="text-red-500">*</span>
          </label>

          <div className="relative">
            <textarea
              id="variantDescription"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Write about the variant’s material, design, usage, or any unique qualities..."
              rows={8}
              className={`w-full resize-none rounded-xl px-4 py-3 text-base leading-relaxed outline-none border-2 transition-all ${
                isValid
                  ? "border-gray-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                  : "border-amber-200 bg-amber-50"
              }`}
            />

            {isValid && (
              <div className="absolute right-3 bottom-3 text-green-500">
                <CheckCircle size={18} />
              </div>
            )}
          </div>

          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>
              {charCount < 30
                ? "Try to add more details for clarity."
                : "Looks descriptive!"}
            </span>
            <span className={charCount > MAX_LENGTH ? "text-red-600" : ""}>
              {charCount}/{MAX_LENGTH}
            </span>
          </div>
        </div>

        {/* Helpful tips */}
        <div className="bg-amber-50 rounded-xl p-4 mb-6 text-sm text-gray-700 leading-relaxed">
          <p className="font-semibold mb-2">💡 Writing tips:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Keep it concise and clear — around 2–3 sentences is ideal.</li>
            <li>Mention material, fit, or usage where relevant.</li>
            <li>Avoid repeating details already in the title.</li>
          </ul>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 flex items-center justify-between">
          <button
            onClick={handleBack}
            className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center gap-2"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className={`px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
              isValid
                ? "bg-linear-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
          >
            Continue
            <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DescribeVariant;
