import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  setBrandToProductRequest,
  updateBuildStage,
} from "../../../features/product/productBuilderSlice";
import {
  selectBrandInProductReq,
  selectForcedBackStage,
} from "../../../features/product/productBuilderSelectors";
import BrandFilter from "../../public/product/BrandFilter";
import {
  CheckCircle,
  AlertCircle,
  Sparkles,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";

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

  const handleBack = () => {
    dispatch(updateBuildStage(forcedBackStage ? forcedBackStage : "stage2")); // go back to title entry
  };

  const handleNext = () => {
    const trimmed = brand.trim();
    if (!trimmed) return;
    dispatch(setBrandToProductRequest(trimmed));
    dispatch(updateBuildStage(forcedBackStage ? forcedBackStage : "next"));
  };

  const isValid = brand.trim().length > 0;

  return (
    <div
      className="w-full min-h-[360px] flex items-start justify-center"
      aria-labelledby="enter-brand-title"
    >
      <div className="w-full max-w-4xl">
        {/* Card */}
        <div className="bg-white overflow-hidden">
          <div className="p-8">
            {/* Brand Filter */}
            <p className="block text-sm font-semibold text-gray-700 mb-3 px-1">
              Brand <span className="text-red-500">*</span>
            </p>
            <div className="mb-6">
              <BrandFilter
                onSelect={(b) => setBrand(b)}
                selectedBrand={savedBrand}
              />
            </div>

            {/* Selected / Validation area */}
            <div className="mb-6">
              {isValid ? (
                <div className="bg-linear-to-r from-teal-50 to-cyan-50 rounded-xl border-2 border-teal-200 p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-teal-500 rounded-lg flex items-center justify-center">
                    <CheckCircle size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">
                      Selected Brand
                    </p>
                    <p className="text-sm text-gray-900 font-medium mt-1">
                      {brand}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 flex items-start gap-3">
                  <AlertCircle size={18} className="text-amber-700 mt-0.5" />
                  <div>
                    <p className="text-sm font-semibold text-amber-900">
                      Brand not selected
                    </p>
                    <p className="text-xs text-amber-700 mt-1">
                      Choose an existing brand or type a new one. A brand helps
                      shoppers discover your product.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Tips & Examples */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-linear-to-r from-amber-50 to-orange-50 rounded-xl border-2 border-amber-200 p-4">
                <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                  <Sparkles size={14} className="text-amber-600" />
                  Tips for Brand
                </h4>
                <ul className="mt-3 text-xs text-gray-700 space-y-2">
                  <li>
                    Use the official brand name to improve search relevance.
                  </li>
                  <li>If private-label, use a clear, memorable brand name.</li>
                  <li>Keep brand short and consistent across your store.</li>
                </ul>
              </div>

              <div className="rounded-xl border-2 border-gray-100 p-4 bg-white">
                <h4 className="text-sm font-semibold text-gray-700 mb-2">
                  Example Brands
                </h4>
                <div className="flex flex-wrap gap-2">
                  {["Acme Co", "Northfield", "PureLeaf", "UrbanBasics"].map(
                    (ex) => (
                      <button
                        key={ex}
                        type="button"
                        onClick={() => setBrand(ex)}
                        className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-gray-700 hover:bg-amber-50 hover:border-amber-200 transition"
                        aria-label={`Use example brand ${ex}`}
                      >
                        {ex}
                      </button>
                    )
                  )}
                </div>
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
                onClick={handleNext}
                disabled={!brand.trim()}
                className={`px-8 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 shadow-lg ${brand.trim()
                  ? "bg-linear-to-r from-teal-500 to-cyan-600 text-white hover:from-teal-600 hover:to-cyan-700 shadow-teal-200 cursor-pointer"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed shadow-none"
                }`}
              >
                <span>Continue</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
      </div>
    </div>
  );
};

export default EnterBrand;
