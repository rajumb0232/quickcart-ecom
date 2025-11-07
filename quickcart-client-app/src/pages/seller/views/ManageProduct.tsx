import type React from "react";
import { useGetProductsByStore } from "../../../hooks/useProducts";
import { useSelector } from "react-redux";
import { selectViewStore } from "../../../features/product/sellerStoreSelectors";
import { useState } from "react";
import { isPageResponse } from "../../../types/apiResponseType";

const ManageProducts: React.FC = () => {
  const viewingStore = useSelector(selectViewStore);

  const [page, setPage] = useState<number>(0);
  const {data, isLoading, isError} = useGetProductsByStore(viewingStore?.store_id, {
    page: page,
    size: 15,
  });

  const pagedProducts = data && isPageResponse(data) ? data.page : undefined; 

  return <div>Hello</div>;
};

export default ManageProducts;
