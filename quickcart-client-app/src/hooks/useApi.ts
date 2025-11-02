import type { AxiosRequestConfig } from "axios";
import { api } from "../api/apiClient";
import type { ApiAck, ApiResponse, ApiResult } from "../types/apiResponseType";

async function unwrapResponse<T>(
  promise: Promise<{ data: ApiResponse<T> | ApiResult<T> | ApiAck }>
): Promise<ApiResponse<T> | ApiResult<T> | ApiAck> {
  const response = await promise;
  return response.data;
}

export const useAPI = () => {
  
  const resolveConfig = (
    data: object | FormData | URLSearchParams | undefined
  ): AxiosRequestConfig => {
    if (data === undefined) {
      return {};
    }
    if (data instanceof FormData || data instanceof URLSearchParams) {
      return {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      };
    } else {
      return { headers: { "Content-Type": "application/json" } };
    }
  };

  const post = <T>(
    url: string,
    data?: object | FormData | URLSearchParams,
    config?: AxiosRequestConfig
  ) => {
    return unwrapResponse(
      api.post<ApiResult<T>>(url, data, {
        ...resolveConfig(data),
        ...config,
      })
    );
  };

  const put = <T>(url: string, data?: object, config?: AxiosRequestConfig) => {
    return unwrapResponse(
      api.put<ApiResult<T>>(url, data, {
        ...resolveConfig(data),
        ...config,
      })
    );
  };

  const get = <T>(url: string, params?: object, config?: AxiosRequestConfig) =>
    unwrapResponse(api.get<ApiResult<T>>(url, { params, ...config }));

  const del = <T>(url: string, config?: AxiosRequestConfig) =>
    unwrapResponse(api.delete<ApiResult<T>>(url, config));

  return { get, post, put, del };
};
