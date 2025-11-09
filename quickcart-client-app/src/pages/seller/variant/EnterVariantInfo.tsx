import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Sparkles,
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  Tag,
} from "lucide-react";

import {
  moveToNextStage,
  moveToPrevStage,
  setVariantPrice,
  setVariantQuantity,
  setVariantTitle,
} from "../../../features/variant/variantBuilderSlice";
import { selectVariantRequestAtBuilder } from "../../../features/variant/variantBuilderSelector";
import type { VariantRequest } from "../../../types/productTypes";

interface EnterVariantInfoProps {
  onSubmit: () => void;
}

const MIN_TITLE = 3;
const MAX_TITLE = 100;

const EnterVariantInfo: React.FC<EnterVariantInfoProps> = ({ onSubmit }) => {
  const dispatch = useDispatch();
  const variantReq: VariantRequest = useSelector(selectVariantRequestAtBuilder);

  const [title, setTitleLocal] = useState<string>(variantReq.title ?? "");
  const [price, setPriceLocal] = useState<number>(variantReq.price ?? 0);
  const [quantity, setQuantityLocal] = useState<number>(
    variantReq.quantity ?? 0
  );

  useEffect(() => {
    // keep local in sync if external state changes (rare)
    setTitleLocal(variantReq.title ?? "");
    setPriceLocal(variantReq.price ?? 0);
    setQuantityLocal(variantReq.quantity ?? 0);
  }, [variantReq.title, variantReq.price, variantReq.quantity]);

  const charCount = title.length;
  const isTitleMin = charCount >= MIN_TITLE;
  const isTitleWithin = charCount <= MAX_TITLE;
  const isPriceValid = !isNaN(price) && price > 0;
  const isQuantityValid = Number.isInteger(quantity) && quantity >= 0;

  const isFormValid =
    isTitleMin && isTitleWithin && isPriceValid && isQuantityValid;

  const isUpdated = () =>
    isFormValid &&
    (title !== (variantReq.title ?? "") ||
      price !== (variantReq.price ?? 0) ||
      quantity !== (variantReq.quantity ?? 0));

  const handleBack = () => {
    dispatch(moveToPrevStage());
  };

  const handleSubmit = () => {
    if (!isFormValid) return;

    const changed =
      title.trim() !== (variantReq.title ?? "") ||
      price !== (variantReq.price ?? 0) ||
      quantity !== (variantReq.quantity ?? 0);

    if (changed) {
      console.log("updating price to: ", price);
      dispatch(setVariantTitle(title.trim()));
      dispatch(setVariantPrice(price));
      dispatch(setVariantQuantity(quantity));
      // parent will handle API update & then should call moveToNextStage via onSubmit
      onSubmit();
    } else {
      // nothing changed — just advance
      dispatch(moveToNextStage());
    }
  };

  function isValidPrice(v: string) {
    return /^\d*\.?\d+$/.test(v);
  }

  function isValidQuantity(v: string) {
    return /^\d+$/.test(v);
  }

  // small helpers for number inputs
  const handlePriceChange = (v: string) => {
    if (isValidPrice(v)) setPriceLocal(Number(v));
  };
  const handleQuantityChange = (v: string) => {
    if (isValidQuantity(v)) setQuantityLocal(Number(v));
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-6 py-6">
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="p-8">
          <div className="flex flex-col items-start justify-between gap-6">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">
                Enter Variant Info
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Provide a clear title, price and stock for this variant.
              </p>

              {/* Title */}
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Variant Title <span className="text-red-500">*</span>
              </label>
              <div className="relative mb-4">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Tag size={18} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitleLocal(e.target.value)}
                  maxLength={MAX_TITLE}
                  placeholder="e.g., Organic Cotton T-Shirt — Navy / M"
                  className={`w-full pl-12 pr-4 py-4 text-lg border-2 rounded-xl outline-none transition ${
                    isTitleMin && isTitleWithin
                      ? "border-gray-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                      : "border-amber-200 bg-amber-50"
                  }`}
                />
                {isTitleMin && isTitleWithin && (
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    <CheckCircle size={20} className="text-green-500" />
                  </div>
                )}
              </div>

              {/* Title helper */}
              <div className="flex items-center justify-between text-xs mb-4">
                <div
                  className={`flex items-center gap-2 ${
                    isTitleMin ? "text-gray-500" : "text-amber-700"
                  }`}
                >
                  {!isTitleMin && charCount > 0 ? (
                    <>
                      <AlertCircle size={14} />
                      <span>
                        Title should be at least {MIN_TITLE} characters
                      </span>
                    </>
                  ) : (
                    <span className="text-gray-500">
                      Make it descriptive and searchable.
                    </span>
                  )}
                </div>
                <div
                  className={`font-medium ${
                    isTitleWithin ? "text-gray-500" : "text-red-600"
                  }`}
                >
                  {charCount}/{MAX_TITLE}
                </div>
              </div>

              {/* Price & Quantity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Price (INR) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    min={0}
                    step="0.01"
                    value={price}
                    onChange={(e) => handlePriceChange(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition focus:outline-none ${
                      isPriceValid
                        ? "border-gray-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                        : "border-amber-200 bg-amber-50"
                    }`}
                    placeholder="e.g., 799"
                  />
                  {!isPriceValid && (
                    <p className="text-xs text-amber-700 mt-2">
                      Price must be greater than 0
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Quantity in stock
                  </label>
                  <input
                    type="text"
                    min={0}
                    step={1}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                    className={`w-full px-4 py-3 rounded-xl border-2 transition focus:outline-none ${
                      isQuantityValid
                        ? "border-gray-200 focus:border-amber-400 focus:ring-4 focus:ring-amber-100"
                        : "border-amber-200 bg-amber-50"
                    }`}
                    placeholder="e.g., 20"
                  />
                  {!isQuantityValid && (
                    <p className="text-xs text-amber-700 mt-2">
                      Quantity must be a non-negative integer
                    </p>
                  )}
                </div>
              </div>

              {/* Example titles */}
              <div className="mb-6">
                <h4 className="text-xs font-semibold text-gray-600 uppercase mb-3">
                  Example Titles
                </h4>
                <div className="space-y-2">
                  {[
                    "Men's Classic Denim Jacket - Premium Blue Wash",
                    "Slim Fit Organic Cotton Tee - Navy / M",
                    "Lightweight Running Shorts - Unisex",
                  ].map((ex, idx) => (
                    <button
                      key={idx}
                      onClick={() => setTitleLocal(ex)}
                      type="button"
                      className="w-full text-left px-4 py-3 bg-gray-50 hover:bg-amber-50 border border-gray-200 hover:border-amber-300 rounded-lg text-sm text-gray-700 hover:text-gray-900 transition-all"
                    >
                      {ex}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column: tips card */}
            <aside className="w-80 hidden lg:block">
              <div className="bg-linear-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 p-4 mb-4">
                <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Sparkles size={16} className="text-amber-600" />
                  Tips for Variant Info
                </h4>
                <ul className="mt-3 text-xs text-gray-700 space-y-2">
                  <li>Keep title short & include size/color if applicable.</li>
                  <li>
                    Price should be final customer price (inclusive of minor
                    taxes if you want).
                  </li>
                  <li>Quantity is available stock — update accurately.</li>
                </ul>
              </div>

              <div className="bg-white rounded-lg border border-gray-100 p-3 text-xs text-gray-600">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle size={16} className="text-green-500" />
                  <span className="font-medium text-gray-800">
                    Quick validation
                  </span>
                </div>
                <p className="text-xs text-gray-500">
                  Fields marked with * are required. You can update them later
                  in the variant editor.
                </p>
              </div>
            </aside>
          </div>

          {/* Footer actions */}
          <div className="mt-6 pt-4 flex items-center justify-between gap-4">
            <div>
              <button
                onClick={handleBack}
                className="px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center gap-2"
              >
                <ArrowLeft size={16} />
                Back
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-sm text-gray-500">
                Changes: {isUpdated() ? "Unsaved" : "None"}
              </div>
              <button
                onClick={handleSubmit}
                disabled={!isFormValid}
                className={`px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg ${
                  isFormValid
                    ? "bg-linear-to-r from-amber-400 to-orange-500 text-white hover:from-amber-500 hover:to-orange-600 shadow-amber-200"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                }`}
              >
                <span>Continue</span>
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnterVariantInfo;
