import { baseApi } from "@/shared/api/base-api";
import { Product } from "../model/types";

type ProductsResponse = {
  products: Product[];
};

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<Product[], void>({
      query: () => "/products",
      transformResponse: (response: ProductsResponse) => response.products,
      providesTags: ["Products"],
    }),
  }),
});

export const { useGetProductsQuery } = productApi;
