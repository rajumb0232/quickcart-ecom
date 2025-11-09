import axios from "axios";
import type { useAPI } from "../hooks/useApi";
import { type PresignedUpload } from "../types/image.types";
import type { ApiAck } from "../types/apiResponseType";

export function groupFilesByContentType(files: File[]): Record<string, File[]> {
  return files.reduce<Record<string, File[]>>((groups, file) => {
    const contentType = file.type || "unknown";
    if (!groups[contentType]) {
      groups[contentType] = [];
    }
    groups[contentType].push(file);
    return groups;
  }, {});
}

export const imageService = {
  presignURLs: (
    api: ReturnType<typeof useAPI>,
    variantId: string,
    contentType: string,
    uploadCount: number
  ) => {
    const body = {
      content_type: contentType,
    };
    return api.post<PresignedUpload[]>(
      `/products/variants/${variantId}/images/presign?upload_count=${uploadCount}`,
      body
    );
  },

  uploadImage: (file: File, url: string) => {
    return axios.put(url, file, {
      headers: {
        "Content-Type": file.type,
      },
    });
  },

  confirmUploaded: (
    api: ReturnType<typeof useAPI>,
    variantId: string,
    objectKeys: string[]
  ) => {
    return api.post<ApiAck>(
      `/products/variants/${variantId}/images/confirm-upload?objectKeys=${objectKeys}`
    );
  },
};
