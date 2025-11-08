import React, { useEffect, useState, type JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  selectNavHeight,
  selectScreenHeight,
} from "../../../features/util/screenSelector";
import Categorize from "./Categorize";
import EnterBrand from "./EnterBrand";
import EnterTitle from "./EnterTitle";
import WriteDescription from "./WriteDescription";
import {
  selectProductReq,
  selectProductReqBuildStage,
} from "../../../features/product/productBuilderSelectors";
import PreviewProduct from "./Preview";
import { setShowCategories } from "../../../features/util/screenSlice";
import {
  X,
  Package,
  CheckCircle,
  Layers,
  Tag,
  FileText,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { selectViewStore } from "../../../features/product/sellerStoreSelectors";
import { toast } from "react-toastify";
import { clearProductBuilderData } from "../../../features/product/productBuilderSlice";

const stageComponents: Record<string, JSX.Element> = {
  select_category: <Categorize />,
  enter_title: <EnterTitle />,
  enter_brand: <EnterBrand />,
  write_description: <WriteDescription />,
  preview_product: <PreviewProduct />,
};

const stageInfo: Record<
  string,
  { title: string; icon: JSX.Element; step: number }
> = {
  select_category: {
    title: "Select Category",
    icon: <Layers size={20} />,
    step: 1,
  },
  enter_title: { title: "Enter Title", icon: <Tag size={20} />, step: 2 },
  enter_brand: { title: "Enter Brand", icon: <Package size={20} />, step: 3 },
  write_description: {
    title: "Write Description",
    icon: <FileText size={20} />,
    step: 4,
  },
  preview_product: {
    title: "Preview Product",
    icon: <Eye size={20} />,
    step: 5,
  },
};

/**
 * Maps various possible stored stage formats -> canonical component keys.
 */
const canonicalStageFor = (raw: unknown): string => {
  if (typeof raw !== "string") return String(raw);

  const r = raw.trim();

  const map: Record<string, string> = {
    select_category: "select_category",
    enter_title: "enter_title",
    enter_brand: "enter_brand",
    write_description: "write_description",
    preview_product: "preview_product",
    stage1: "select_category",
    stage2: "enter_title",
    stage3: "enter_brand",
    stage4: "write_description",
    stage5: "preview_product",
    "1": "select_category",
    "2": "enter_title",
    "3": "enter_brand",
    "4": "write_description",
    "5": "preview_product",
  };

  return map[r] ?? r;
};

const ListProduct: React.FC = () => {
  const navHeight = useSelector(selectNavHeight) ?? 0;
  const screenHeight = useSelector(selectScreenHeight);
  const currentStageRaw = useSelector(selectProductReqBuildStage);
  const productReq = useSelector(selectProductReq);
  const currentStore = useSelector(selectViewStore);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(setShowCategories(false));
  }, []);

  let notified = false;
  useEffect(() => {
    if (currentStore && !notified) {
      toast.info("Listing product to " + currentStore?.name);
      notified = true;
    }
  }, [currentStore]);

  useEffect(() => {
    console.log("🧩 Product Request Updated:", productReq);
  }, [productReq]);

  const currentStage = canonicalStageFor(currentStageRaw);
  const currentStageInfo = stageInfo[currentStage] || {
    title: "Unknown Stage",
    icon: <Package size={20} />,
    step: 0,
  };

  const [viewHeight, setViewHeight] = useState<number>(600);

  useEffect(() => {
    const base =
      typeof screenHeight === "number"
        ? screenHeight
        : window?.innerHeight ?? 800;
    setViewHeight(Math.max(600, base - (navHeight || 0)));
  }, [screenHeight, navHeight]);

  const RESERVED_VERTICAL = 120;
  const imageContainerHeight = Math.max(420, viewHeight - RESERVED_VERTICAL);

  const RenderComponent = stageComponents[currentStage] ?? (
    <div className="text-center text-gray-500 py-10">
      <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
        <X size={32} className="text-red-600" />
      </div>
      <p className="font-semibold">Invalid stage: {String(currentStageRaw)}</p>
    </div>
  );

  const totalSteps = 5;
  const progressPercentage = (currentStageInfo.step / totalSteps) * 100;

  return (
    <div
      className="w-full bg-linear-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4 py-6"
      style={{
        marginTop: `${navHeight - 36}px`,
        minHeight: `${imageContainerHeight + 90}px`,
      }}
    >
      <div className="w-full max-w-6xl">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="bg-white rounded-2xl shadow-lg border-2 border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-linear-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg">
                  <Package size={24} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {currentStageInfo.step === 5
                      ? "Product Preview"
                      : "Create Product"}
                  </h1>
                  <p className="text-sm text-gray-600">
                    Step {currentStageInfo.step} of {totalSteps} -{" "}
                    {currentStageInfo.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  navigate("/seller/dashboard");
                  dispatch(clearProductBuilderData());
                }}
                className="p-2 hover:bg-red-50 rounded-xl transition-colors group"
                title="Close"
              >
                <X
                  size={24}
                  className="text-gray-400 group-hover:text-red-600 transition-colors"
                />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="relative">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-amber-400 to-orange-500 transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <div className="flex justify-between mt-4">
                {Object.entries(stageInfo).map(([key, info]) => {
                  const isCompleted = info.step < currentStageInfo.step;
                  const isCurrent = info.step === currentStageInfo.step;

                  return (
                    <div
                      key={key}
                      className="flex flex-col items-center"
                      style={{ width: `${100 / totalSteps}%` }}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all ${
                          isCompleted
                            ? "bg-linear-to-br from-green-400 to-emerald-500 text-white shadow-lg"
                            : isCurrent
                            ? "bg-linear-to-br from-amber-400 to-orange-500 text-white shadow-lg scale-110"
                            : "bg-gray-200 text-gray-400"
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle size={20} />
                        ) : (
                          <span className="text-sm font-bold">{info.step}</span>
                        )}
                      </div>
                      <span
                        className={`text-xs font-medium text-center hidden sm:block ${
                          isCurrent
                            ? "text-gray-900"
                            : isCompleted
                            ? "text-green-600"
                            : "text-gray-400"
                        }`}
                      >
                        {info.title}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Store Info */}
          {currentStore && (
            <div className="mt-4 bg-linear-to-r from-teal-50 to-cyan-50 rounded-xl border-2 border-teal-200 p-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                  <Package size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium">
                    Listing to Store:
                  </p>
                  <p className="text-sm font-bold text-gray-900">
                    {currentStore.name}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Card */}
        <div className="bg-white rounded-2xl shadow-xl border-2 border-gray-200 overflow-hidden">
          <div className="p-8 md:p-12">{RenderComponent}</div>
        </div>
      </div>
    </div>
  );
};

export default ListProduct;
