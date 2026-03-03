import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@/shared/api/base-api";
import { cartReducer } from "@/entities/cart/model/cart-slice";

export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    cart: cartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
