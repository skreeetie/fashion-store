import { baseApi } from "@/shared/api/base-api";
import { Product } from "../model/types";

type ProductsResponse = {
  products: Product[];
  meta: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
};

type GetProductsArgs = {
  page: number;
  perPage: number;
  category: "all" | "clothes" | "shoes" | "accessories";
  sortBy: "none" | "price" | "name";
  sortOrder: "asc" | "desc";
};

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, GetProductsArgs>({
      query: ({ page, perPage, category, sortBy, sortOrder }) =>
        `/products?page=${page}&perPage=${perPage}&category=${category}&sortBy=${sortBy}&sortOrder=${sortOrder}`,
      providesTags: ["Products"],
    }),
  }),
});

export const { useGetProductsQuery } = productApi;
