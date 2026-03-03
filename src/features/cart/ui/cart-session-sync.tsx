"use client";

import { useEffect, useRef } from "react";
import { selectCartItems, setCartItems } from "@/entities/cart/model/cart-slice";
import { loadCartFromSessionStorage, saveCartToSessionStorage } from "../model/cart-storage";
import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks/redux";

export function CartSessionSync() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const hydratedRef = useRef(false);

  useEffect(() => {
    const persistedItems = loadCartFromSessionStorage();
    if (persistedItems.length > 0) {
      dispatch(setCartItems(persistedItems));
    }
    hydratedRef.current = true;
  }, [dispatch]);

  useEffect(() => {
    if (!hydratedRef.current) {
      return;
    }

    saveCartToSessionStorage(items);
  }, [items]);

  return null;
}
