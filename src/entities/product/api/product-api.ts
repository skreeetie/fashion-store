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
};

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, GetProductsArgs>({
      query: ({ page, perPage }) => `/products?page=${page}&perPage=${perPage}`,
      providesTags: ["Products"],
    }),
  }),
});

export const { useGetProductsQuery } = productApi;
