"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import {
  removeItemFromCart,
  selectCartItems,
  selectCartTotalCount,
  selectCartTotalPrice,
} from "@/entities/cart/model/cart-slice";
import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks/redux";
import { formatPrice } from "@/shared/lib/format-price";

export function CartModal() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const items = useAppSelector(selectCartItems);
  const totalCount = useAppSelector(selectCartTotalCount);
  const totalPrice = useAppSelector(selectCartTotalPrice);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onEscape);

    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onEscape);
    };
  }, [isOpen]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        className="hover-jolt relative rounded-sm border border-transparent p-1.5 text-muted"
        type="button"
        aria-label="Открыть корзину"
        onClick={() => setIsOpen((current) => !current)}
      >
        <ShoppingBag size={22} />
        {totalCount > 0 ? (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] leading-none text-bg">
            {totalCount}
          </span>
        ) : null}
      </button>

      {isOpen ? (
        <div
          className="absolute right-0 top-full z-[60] mt-3 w-[min(92vw,560px)] rounded-md border border-line bg-bg p-5 shadow-xl"
          role="dialog"
          aria-label="Корзина"
        >
          <div className="flex items-center justify-between border-b border-line pb-3">
            <h2 className="text-xl font-medium text-text">Корзина</h2>
            <button
              type="button"
              className="hover-jolt hover-outline-scan rounded-sm border border-line px-3 py-1 text-sm text-muted"
              onClick={() => setIsOpen(false)}
            >
              Закрыть
            </button>
          </div>

          {items.length === 0 ? (
            <p className="py-8 text-center text-muted">Корзина сейчас пуста</p>
          ) : (
            <ul className="cart-scroll max-h-[350px] space-y-3 overflow-y-auto py-4 pr-1">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-3 rounded-sm border border-line p-2.5">
                  <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-sm bg-card-bg">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="56px" />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-[#f2ede6] to-[#dfd7cb] dark:from-[#404048] dark:to-[#2a2a30]" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-text">{item.name}</p>
                    <p className="text-xs uppercase tracking-[0.06em] text-muted">Размер: {item.size}</p>
                    <p className="text-sm text-muted">{formatPrice(item.price)}</p>
                  </div>

                  <button
                    type="button"
                    aria-label={`Удалить ${item.name} из корзины`}
                    className="hover-jolt hover-outline-scan rounded-sm border border-line p-2 text-muted"
                    onClick={() => dispatch(removeItemFromCart(item.id))}
                  >
                    <ShoppingBag size={16} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {items.length > 0 ? (
            <div className="mt-2 border-t border-line pt-3 text-sm text-muted">
              <p>Итоговое количество товаров: {totalCount}</p>
              <p className="mt-1">Итоговая сумма: {formatPrice(totalPrice)}</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
