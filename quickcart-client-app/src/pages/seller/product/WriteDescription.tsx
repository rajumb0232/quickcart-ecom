import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  setDescriptionToProductRequest,
  updateBuildStage,
} from "../../../features/product/productBuilderSlice";
import {
  selectDescriptionInProductReq,
  selectForcedBackStage,
} from "../../../features/product/productBuilderSelectors";
import {
  AlertCircle,
  Sparkles,
  CheckCircle,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

const MIN_CHARS = 10;
const MAX_CHARS = 2000;

const WriteDescription: React.FC = () => {
  const dispatch = useDispatch();
  const savedDescription = useSelector(selectDescriptionInProductReq);
  const forcedBackStage = useSelector(selectForcedBackStage);
  const [description, setDescription] = useState(savedDescription ?? "");

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };

  const handleBack = () => {
    dispatch(updateBuildStage(forcedBackStage ? forcedBackStage : "stage3")); // go back to brand entry
  };

  const handleSubmit = () => {
    if (!description.trim()) return;
    dispatch(setDescriptionToProductRequest(description.trim()));
    dispatch(updateBuildStage(forcedBackStage ? forcedBackStage : "next")); // move to next step (if any) or finish
  };

  const charCount = description.length;
  const isValid =
    description.trim().length >= MIN_CHARS && charCount <= MAX_CHARS;
  const isTooShort =
    description.trim().length > 0 && description.trim().length < MIN_CHARS;
  const isTooLong = charCount > MAX_CHARS;

  return (
    <div
      className="w-full min-h-[420px] flex items-start justify-center"
      aria-labelledby="write-description-title"
    >
      <div className="w-full max-w-4xl">
        <div className="bg-white overflow-hidden">
          <div className="p-8">
            {/* Header */}

            {/* Textarea + Helper */}
            <div className="mb-6">
              <label
                htmlFor="productDescription"
                className="block text-sm font-semibold text-gray-700 mb-3"
              >
                Product Description <span className="text-red-500">*</span>
              </label>

              <textarea
                id="productDescription"
                name="productDescription"
                placeholder="Enter a detailed product description — include key features, materials, and sizing."
                value={description}
                onChange={handleChange}
                rows={8}
                className="w-full resize-none rounded-xl border-2 border-gray-200 p-4 text-sm leading-relaxed focus:outline-none focus:ring-4 focus:ring-amber-100 focus:border-amber-400 transition-all placeholder-gray-400"
                aria-invalid={isTooShort || isTooLong}
                aria-describedby="desc-help desc-count"
              />

              <div className="mt-3 flex items-start justify-between gap-4">
                <div className="space-y-2">
                  {isTooShort && (
                    <p
                      id="desc-help"
                      className="text-xs text-amber-700 flex items-center gap-2"
                    >
                      <AlertCircle size={14} />
                      Description should be at least {MIN_CHARS} characters.
                    </p>
                  )}
                  {isTooLong && (
                    <p
                      id="desc-help"
                      className="text-xs text-red-600 flex items-center gap-2"
                    >
                      <AlertCircle size={14} />
                      Description exceeds maximum length of {MAX_CHARS}{" "}
                      characters.
                    </p>
                  )}
                  {!isTooShort &&
                    !isTooLong &&
                    description.trim().length > 0 && (
                      <p className="text-xs text-gray-500 flex items-center gap-2">
                        <CheckCircle size={14} className="text-green-500" />
                        Looks good — informative descriptions help sales.
                      </p>
                    )}
                  {description.trim().length === 0 && (
                    <p className="text-xs text-gray-500 flex items-center gap-2">
                      <Sparkles size={14} className="text-amber-500" />
                      Tip: start with the main benefit, then add specifics.
                    </p>
                  )}
                </div>

                <div
                  id="desc-count"
                  className={`text-xs font-medium ${
                    isTooLong
                      ? "text-red-600"
                      : isTooShort
                      ? "text-amber-700"
                      : "text-gray-500"
                  }`}
                >
                  {charCount}/{MAX_CHARS}
                </div>
              </div>
            </div>

            {/* Examples and microtips */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-linear-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 p-4">
                <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Sparkles size={14} className="text-amber-600" />
                  Quick Writing Tips
                </h4>
                <ul className="mt-3 text-xs text-gray-700 space-y-2">
                  <li>Lead with a one-line benefit.</li>
                  <li>List 3–5 key features in bullet form when possible.</li>
                  <li>Mention material, size/fit and care instructions.</li>
                </ul>
              </div>

              <div className="rounded-xl border-2 border-gray-100 p-4 bg-white">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Example Description
                </h4>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Lightweight cotton tee with a slim fit. Breathable fabric,
                  reinforced seams, and machine-washable. Perfect for everyday
                  wear — true to size.
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-4 pt-4 border-t-2 border-gray-200">
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center gap-2"
              >
                <ArrowLeft size={18} />
                Go Back
              </button>

              <button
                onClick={handleSubmit}
                disabled={!isValid || isTooLong}
                className={`px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg ${
                  isValid && !isTooLong
                    ? "bg-linear-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600 shadow-amber-200"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                }`}
              >
                <span>Continue</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom help text */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            💡 Write clearly — better descriptions reduce returns and increase
            conversions.
          </p>
        </div>
      </div>
    </div>
  );
};

export default WriteDescription;
