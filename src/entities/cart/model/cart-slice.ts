import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "./types";
import type { RootState } from "@/app/store/store";

type CartState = {
  items: CartItem[];
};

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart(state, action: PayloadAction<CartItem>) {
      const exists = state.items.some((item) => item.id === action.payload.id);
      if (!exists) {
        state.items.push(action.payload);
      }
    },
    removeItemFromCart(state, action: PayloadAction<number>) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    toggleItemInCart(state, action: PayloadAction<CartItem>) {
      const exists = state.items.some((item) => item.id === action.payload.id);

      if (exists) {
        state.items = state.items.filter((item) => item.id !== action.payload.id);
        return;
      }

      state.items.push(action.payload);
    },
  },
});

export const { addItemToCart, removeItemFromCart, toggleItemInCart } = cartSlice.actions;
export const cartReducer = cartSlice.reducer;

export const selectCartItems = (state: RootState) => state.cart.items;
export const selectCartTotalCount = (state: RootState) => state.cart.items.length;
export const selectCartTotalPrice = (state: RootState) =>
  state.cart.items.reduce((sum, item) => sum + item.price, 0);
export const selectIsProductInCart = (productId: number) => (state: RootState) =>
  state.cart.items.some((item) => item.id === productId);
