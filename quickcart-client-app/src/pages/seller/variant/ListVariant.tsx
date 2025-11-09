import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Package,
  CheckCircle,
  FileText,
  Layers,
  ImageIcon,
} from "lucide-react";

import { selectNavHeight } from "../../../features/util/screenSelector";
import {
  selectVariantBuilderStage,
  selectVariantIdAtBuilder,
  selectVariantRequestAtBuilder,
} from "../../../features/variant/variantBuilderSelector";

import EnterVariantInfo from "./EnterVariantInfo";
import DescribeVariant from "./DescribeVariant";
import AddVariantAttributes from "./AddVariantAttributes";
import UploadVariantImages from "./UploadVariantImages";
import {
  hydrateVariantBuilder,
  moveToNextStage,
} from "../../../features/variant/variantBuilderSlice";
import { setShowCategories } from "../../../features/util/screenSlice";
import { useNavigate, useParams } from "react-router-dom";
import { useGetVariant, useUpdateVariant } from "../../../hooks/useProducts";
import { isApiResponse } from "../../../types/apiResponseType";
import { toast } from "react-toastify";

const TOTAL_STEPS = 4;

const stepInfo: Record<
  number,
  { key: string; title: string; icon: React.ReactNode; step: number }
> = {
  1: {
    key: "enter_info",
    title: "Variant Info",
    icon: <Layers size={18} />,
    step: 1,
  },
  2: {
    key: "describe",
    title: "Describe",
    icon: <FileText size={18} />,
    step: 2,
  },
  3: {
    key: "attributes",
    title: "Attributes",
    icon: <Package size={18} />,
    step: 3,
  },
  4: { key: "images", title: "Images", icon: <ImageIcon size={18} />, step: 4 },
};

const canonicalStage = (n: number) => stepInfo[n] ?? stepInfo[1];

const ListVariant: React.FC = () => {
  const params = useParams<{ id: string }>();
  const { id: idInParam } = params;

  const dispatch = useDispatch();
  const navHeight = useSelector(selectNavHeight) ?? 0;
  const variantId = useSelector(selectVariantIdAtBuilder);
  const request = useSelector(selectVariantRequestAtBuilder);
  const currentStage = useSelector(selectVariantBuilderStage);
  const navigate = useNavigate();

  const currentStepInfo = canonicalStage(currentStage);
  const progressPercentage = (currentStepInfo.step / TOTAL_STEPS) * 100;

  // Always call the hook, even if not using every time
  const { data, isError, isLoading } = useGetVariant(idInParam ?? "");
  const updateVariantMutation = useUpdateVariant();

  const [doUpdate, setDoUpdate] = useState<boolean>(false);

  useEffect(() => {
    console.log("object");
    if (idInParam && data && isApiResponse(data) && !isLoading && !isError) {
      console.log("variant loaded, hydrating variant builder.");
      dispatch(hydrateVariantBuilder(data.data));
    }
  }, [idInParam, data, isLoading, isError, dispatch]);

  useEffect(() => {
    dispatch(setShowCategories(false));
  }, []);

  useEffect(() => {
    if (doUpdate) {
      console.log("updating... data: ", request);
      handleUpdate();
    }
    setDoUpdate(false);
  }, [doUpdate]);

  const handleUpdate = async () => {
    console.log("Making API PUT Request, data: ", request);
    try {
      if (variantId) {
        const response = await updateVariantMutation.mutateAsync({
          variantId: variantId,
          body: request,
        });
        if (isApiResponse(response)) {
          dispatch(hydrateVariantBuilder(response.data));
        }
        dispatch(moveToNextStage());
      } else console.log("Invalid variant ID.");
    } catch (error) {
      toast.error("There was an error updating variant.");
      console.error("Failed to update variant, ", error);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleImageUploads = (files: File[]) => {
    // files are handed to parent; real upload flow is handled elsewhere (thunk)
    // For now, move to next stage after parent handles upload in the child.
    // Child should call the thunk and then call onSubmit callback when done.
    console.log("Files received for upload:", files);
    dispatch(moveToNextStage());
  };

  const renderStage = () => {
    switch (currentStage) {
      case 1:
        return <EnterVariantInfo onSubmit={() => setDoUpdate(true)} />;
      case 2:
        return <DescribeVariant onSubmit={() => setDoUpdate(true)} />;
      case 3:
        return <AddVariantAttributes onSubmit={() => setDoUpdate(true)} />;
      case 4:
        return <UploadVariantImages onSubmit={handleImageUploads} />;
      default:
        return <EnterVariantInfo onSubmit={() => setDoUpdate(true)} />;
    }
  };

  return (
    <div
      className="w-full bg-linear-to-br from-gray-50 via-white to-gray-50 flex items-start justify-center px-4 py-6"
      style={{ marginTop: `${navHeight - 36}px` }}
    >
      <div className="w-full max-w-5xl">
        {/* Header card */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-linear-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow">
                <Package size={24} className="text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Create Variant
                </h2>
                <p className="text-sm text-gray-600">
                  Step {currentStepInfo.step} of {TOTAL_STEPS} —{" "}
                  {currentStepInfo.title}
                </p>
                {variantId && (
                  <div className="mt-2 text-xs text-gray-500">
                    Draft Variant: {variantId}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCancel}
                className="px-3 py-2 rounded-xl bg-white border-2 border-gray-200 hover:bg-gray-50 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-6">
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={TOTAL_STEPS}
              aria-valuenow={currentStepInfo.step}
              className="relative"
            >
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-amber-400 to-orange-500 transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>

              <div className="flex justify-between mt-4">
                {Object.values(stepInfo).map((info) => {
                  const isCompleted = info.step < currentStepInfo.step;
                  const isCurrent = info.step === currentStepInfo.step;

                  return (
                    <div
                      key={info.key}
                      className="flex flex-col items-center"
                      style={{ width: `${100 / TOTAL_STEPS}%` }}
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
                          <CheckCircle size={18} />
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
        </div>

        {/* Stage Card */}
        <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
          <div className="p-8 md:p-12">{renderStage()}</div>

          {/* Footer actions — Back / Continue (children should also provide their own primary actions) */}
        </div>

        {/* small footer hint */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Tip: You can save draft at each step — data will be preserved.
          </p>
        </div>
      </div>
    </div>
  );
};

/**
 * NOTE: we referenced a couple of action names that may not exist in your slice (moveToPrevStage, resetToInitialStateFallback).
 * - moveToPrevStage: if you don't have it, either create it in the slice, or replace the call with a custom dispatch that sets the stage.
 * - resetToInitialStateFallback: optional action to reset builder — implement in slice if desired.
 *
 * Adjust imports if action names differ.
 */

export default ListVariant;
