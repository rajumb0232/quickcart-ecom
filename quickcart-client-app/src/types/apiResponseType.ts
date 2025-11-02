export interface ApiResponse<T> {
  success: true;
  message: string;
  data: T;
}

export interface ApiAck {
  success: boolean;
  message: string;
}

export interface ApiInputError {
  success: false;
  message: string;
  errors?: Array<{
    rejected_field: string;
    rejected_value: string | number | null;
    message: string;
  }>;
}

export function isApiResponse<T>(response: ApiResult<T>): response is ApiResponse<T> {
  return response.success === true;
}

export function isApiAck(response: ApiResult<unknown>): response is ApiAck {
  return typeof response.success === "boolean" && !("data" in response);
}

export function isApiInputError<T>(response: ApiResult<T>): response is ApiInputError {
  return response.success === false && "errors" in response;
}

export type ApiResult<T> = ApiResponse<T> | ApiInputError | ApiAck;
