import type { AxiosRequestConfig } from "axios";
import { api } from "../api/apiClient";
import type { ApiAck, ApiResponse, ApiResult, PageResponse } from "../types/apiResponseType";
import axios from "axios";

async function unwrapResponse<T>(
  promise: Promise<{ data: ApiResponse<T> | ApiResult<T> | ApiAck | PageResponse<T>}>
): Promise<ApiResponse<T> | ApiResult<T> | ApiAck | PageResponse<T>> {
  try {
    const response = await promise;
    return response.data;
  } catch (error) {
    // If it's an axios error with a response, return the error data
    if (axios.isAxiosError(error) && error.response) {
      return error.response.data;
    }
    // Otherwise, re-throw for network errors
    throw error;
  }
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
    console.log("Requested made...");
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

  const get = <T>(url: string, params?: object, config?: AxiosRequestConfig) => {
    return unwrapResponse(api.get<ApiResult< T>>(url, { params, ...config }));
  }

  const del = <T>(url: string, config?: AxiosRequestConfig) =>
    unwrapResponse(api.delete<ApiResult<T>>(url, config));

  return { get, post, put, del };
};
