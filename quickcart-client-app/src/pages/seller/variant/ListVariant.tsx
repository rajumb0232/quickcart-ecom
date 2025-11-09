import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Package,
  CheckCircle,
  FileText,
  Layers,
  ImageIcon,
  AlertCircle,
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
import { groupFilesByContentType } from "../../../services/imageService";
import {
  useConfirmImageUploads,
  useGetPresignedURLs,
  useUploadImage,
} from "../../../hooks/useImages";

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

  const { data, isError, isLoading } = useGetVariant(idInParam ?? "");
  const updateVariantMutation = useUpdateVariant();
  const presignURLsMutation = useGetPresignedURLs();
  const uploadImageMutation = useUploadImage();
  const confirmImageUploadsMutation = useConfirmImageUploads();

  const [doUpdate, setDoUpdate] = useState<boolean>(false);
  const [notFound, setNotFound] = useState<boolean>(false);

  useEffect(() => {
    if (idInParam && !isLoading) {
      if (isError || (data && !isApiResponse(data))) {
        setNotFound(true);
      } else if (data && isApiResponse(data)) {
        setNotFound(false);
        dispatch(hydrateVariantBuilder(data.data));
      }
    }
  }, [idInParam, data, isLoading, isError, dispatch]);

  useEffect(() => {
    dispatch(setShowCategories(false));
  }, [dispatch]);

  useEffect(() => {
    if (doUpdate) {
      handleUpdate();
    }
    setDoUpdate(false);
  }, [doUpdate]);

  const handleUpdate = async () => {
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
      }
    } catch (error) {
      toast.error("There was an error updating variant.");
      console.error("Failed to update variant, ", error);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  const handleImageUploads = async (files: File[]) => {
    console.log("attempting file uploads for ", files.length, " files.");
    if (!variantId) {
      console.error("variantId is required");
      return;
    }

    const groupedFiles = groupFilesByContentType(files);
    const uploadedKeys: string[] = [];

    try {
      console.log(groupedFiles);
      console.log("inside try block.");
      for (const [contentType, filesOfType] of Object.entries(groupedFiles)) {
        console.log("Making API call to presign...");
        const data = await presignURLsMutation.mutateAsync({
          variantId: variantId,
          contentType: contentType,
          uploadCount: filesOfType.length,
        });

        console.log("API Call Completed.");

        if (isApiResponse(data)) {
          console.log("obtained presigned urls");
          const presignedData = data.data;
          await Promise.all(
            filesOfType.map(async (file, index) => {
              const presigned = presignedData[index];
              try {
                await uploadImageMutation.mutateAsync({
                  file,
                  url: presigned.url,
                });
                uploadedKeys.push(presigned.object_key);
              } catch (error) {
                throw new Error(
                  `Failed to upload image, key: ${presigned.object_key}`
                );
              }
            })
          );
        } else {
          throw new Error("Invalid presigned URL response from backend");
        }
      }

      await confirmImageUploadsMutation.mutateAsync({
        variantId,
        objectKeys: uploadedKeys,
      });

      navigate(`/seller/manage-products`);
    } catch (error) {
      console.error("Image upload flow failed:", error);
      toast.error("Image upload failed. Please try again.");
    }
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

  // Loading state
  if (isLoading) {
    return (
      <div
        className="w-full bg-linear-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4 py-6"
        style={{ marginTop: `${navHeight - 36}px`, minHeight: "400px" }}
      >
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading variant...</p>
        </div>
      </div>
    );
  }

  // Error state - Product not found
  if (notFound) {
    return (
      <div
        className="w-full bg-linear-to-br from-gray-50 via-white to-gray-50 flex items-center justify-center px-4 py-6"
        style={{ marginTop: `${navHeight - 36}px`, minHeight: "400px" }}
      >
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl border-2 border-red-200 p-8 md:p-12 text-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle size={40} className="text-red-500" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Variant Not Found
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              The variant with ID <span className="font-mono font-semibold text-gray-900">{idInParam}</span> could not be found.
              It may have been deleted or the link may be incorrect.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => navigate("/seller/manage-products")}
                className="px-6 py-3 rounded-xl bg-linear-to-br from-amber-400 to-orange-500 text-white font-semibold hover:shadow-lg transition-all"
              >
                Go to Products
              </button>
              <button
                onClick={handleCancel}
                className="px-6 py-3 rounded-xl bg-white border-2 border-gray-200 hover:bg-gray-50 font-semibold transition-all"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Normal render
  return (
    <div
      className="w-full bg-linear-to-br from-gray-50 via-white to-gray-50 flex items-start justify-center px-4 py-6"
      style={{ marginTop: `${navHeight - 36}px` }}
    >
      <div className="w-full max-w-5xl">
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

        <div className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden">
          <div className="p-8 md:p-12">{renderStage()}</div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Tip: You can save draft at each step — data will be preserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ListVariant;