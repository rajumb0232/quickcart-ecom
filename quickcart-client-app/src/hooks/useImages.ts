import { useMutation } from "@tanstack/react-query";
import { useAPI } from "./useApi";
import { type ApiAck, type ApiResult } from "../types/apiResponseType";
import type { PresignedUpload } from "../types/image.types";
import { imageService } from "../services/imageService";
import type { AxiosError } from "axios";

export const useGetPresignedURLs = () => {
  interface Input {
    variantId: string;
    contentType: string;
    uploadCount: number;
  }

  const api = useAPI();

  return useMutation<ApiResult<PresignedUpload[]>, Error, Input>({
    mutationFn: async (i: Input) => {
        console.log("API call made...");
        const data = imageService.presignURLs(api, i.variantId, i.contentType, i.uploadCount)
        return data;
    },
  });
};

export const useUploadImage = () => {
  return useMutation<void, Error, { file: File; url: string }>({
    mutationFn: async ({ file, url }) => {
      await imageService.uploadImage(file, url);
    },
    retry: (failureCount, error) => {
      // Max 3 retries
      if (failureCount >= 3) return false;

      if (error && (error as AxiosError).isAxiosError) {
        const axiosError = error as AxiosError;
        const status = axiosError.response?.status;
        if (status === 401 || status === 403) {
          return false;
        }
      }

      return true;
    },
  });
};

export const useConfirmImageUploads = () => {
  const api = useAPI();

  return useMutation<ApiAck, Error, { variantId: string; objectKeys: string[] }>({
    mutationFn: async ({ variantId, objectKeys }) =>
      imageService.confirmUploaded(api, variantId, objectKeys),

    retry: (failureCount, error) => {
      // Limit retries to max 3 attempts
      if (failureCount >= 3) return false;

      // Stop retry if error is 401 or 403
      if (error && (error as AxiosError).isAxiosError) {
        const axiosError = error as AxiosError;
        const status = axiosError.response?.status;
        if (status === 401 || status === 403) {
          return false;
        }
      }
      return true; // Retry otherwise
    },
  });
};
