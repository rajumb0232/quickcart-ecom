import { useQuery } from "@tanstack/react-query";
import { useAPI } from "../hooks/useApi";
import { categoryService } from "../services/categoryService";
import type { Category } from "../types/productTypes";
import type { ApiResult } from "../types/apiResponseType"; // adjust if you have a standard ApiResult wrapper

export const useCategories = () => {
  const api = useAPI();

  return useQuery<ApiResult<Category[]>, Error>({
    queryKey: ["categories"],
    queryFn: () => categoryService.getCategories(api),
    staleTime: 24 * 60 * 60 * 1000, // 1 Day
    retry: 1,
  });
};
