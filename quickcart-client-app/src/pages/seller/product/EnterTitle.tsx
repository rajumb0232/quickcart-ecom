import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setTitleToProductRequest,
  updateBuildStage,
} from "../../../features/product/productBuilderSlice";
import { 
  selectForcedBackStage, 
  selectTitleInProductReq 
} from "../../../features/product/productBuilderSelectors";
import {
  Tag,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Sparkles,
} from "lucide-react";

const EnterTitle: React.FC = () => {
  const dispatch = useDispatch();
  const savedTitle = useSelector(selectTitleInProductReq);
  const forcedBackStage = useSelector(selectForcedBackStage);
  const [title, setTitle] = useState(savedTitle ?? "");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  const handleBack = () => {
    dispatch(updateBuildStage(forcedBackStage ? forcedBackStage : "stage1"));
  };

  const handleNext = () => {
    if (!title.trim()) return;
    dispatch(setTitleToProductRequest(title.trim()));
    dispatch(updateBuildStage(forcedBackStage ? forcedBackStage : "next"));
  };

  const isValid = title.trim().length > 0;
  const charCount = title.length;
  const minChars = 3;
  const maxChars = 100;
  const isMinReached = charCount >= minChars;
  const isWithinLimit = charCount <= maxChars;

  return (
    <div className="w-full max-w-4xl mx-auto">

      {/* Main Content Card */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="p-8">
          {/* Input Section */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Product Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Tag size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                name="productTitle"
                placeholder="e.g., Premium Cotton T-Shirt - Slim Fit"
                value={title}
                onChange={handleChange}
                maxLength={maxChars}
                className="w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-xl focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all outline-none"
              />
              {isValid && (
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                  <CheckCircle size={24} className="text-green-500" />
                </div>
              )}
            </div>
            
            {/* Helper Text */}
            <div className="mt-3 space-y-2">
              {!isMinReached && charCount > 0 && (
                <p className="text-xs text-amber-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  Title should be at least {minChars} characters long
                </p>
              )}
              {!isWithinLimit && (
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <AlertCircle size={14} />
                  Title exceeds maximum length of {maxChars} characters
                </p>
              )}
              {isValid && isWithinLimit && (
                <p className="text-xs text-gray-500 flex items-center gap-1">
                  <Sparkles size={14} className="text-amber-500" />
                  Great! Your title looks good
                </p>
              )}
            </div>
          </div>

          {/* Tips Card */}
          <div className="bg-linear-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 p-6 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <Sparkles size={16} className="text-amber-600" />
              Tips for a Great Title
            </h3>
            <ul className="space-y-2 text-xs text-gray-700">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>Include key details like brand, material, and product type</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>Use descriptive words that customers might search for</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>Keep it clear and concise - avoid excessive punctuation</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>Highlight unique features or selling points</span>
              </li>
            </ul>
          </div>

          {/* Example Titles */}
          <div className="mb-6">
            <h4 className="text-xs font-semibold text-gray-600 uppercase mb-3">
              Example Titles
            </h4>
            <div className="space-y-2">
              {[
                "Men's Classic Denim Jacket - Premium Blue Wash",
                "Organic Cotton Yoga Mat - Non-Slip Eco-Friendly",
                "Wireless Bluetooth Earbuds - Noise Cancelling",
              ].map((example, idx) => (
                <button
                  key={idx}
                  onClick={() => setTitle(example)}
                  className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-amber-50 border border-gray-200 hover:border-amber-300 rounded-lg text-sm text-gray-700 hover:text-gray-900 transition-all"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-4 pt-6 border-t-2 border-gray-200">
            <button
              onClick={handleBack}
              className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center gap-2"
            >
              <ArrowLeft size={18} />
              Go Back
            </button>

            <button
              onClick={handleNext}
              disabled={!isValid || !isWithinLimit}
              className={`px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg ${
                isValid && isWithinLimit
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

      {/* Bottom Help Text */}
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-500">
          💡 A well-written title helps customers find your product easily
        </p>
      </div>
    </div>
  );
};

export default EnterTitle;