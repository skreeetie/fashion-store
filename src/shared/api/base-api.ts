import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiOrigin = process.env.NEXT_PUBLIC_API_ORIGIN?.replace(/\/$/, "");
const apiBaseUrl = apiOrigin ? `${apiOrigin}/api` : "/api";

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: fetchBaseQuery({ baseUrl: apiBaseUrl }),
  tagTypes: ["Products"],
  endpoints: () => ({}),
});
