"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ShoppingBag, Trash2, X } from "lucide-react";
import {
  clearCart,
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
          className="absolute right-0 top-full z-[60] mt-3 w-[min(96vw,560px)] rounded-md border border-line bg-bg p-3 shadow-xl sm:w-[min(92vw,560px)] sm:p-5"
          role="dialog"
          aria-label="Корзина"
        >
          <div className="flex items-center justify-between border-b border-line pb-3">
            <h2 className="text-lg font-medium text-text sm:text-xl">Корзина</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={items.length === 0}
                aria-label="Очистить корзину"
                className="hover-jolt hover-outline-scan rounded-sm border border-line p-1.5 text-muted disabled:cursor-not-allowed disabled:opacity-45"
                onClick={() => dispatch(clearCart())}
              >
                <Trash2 size={15} />
              </button>
              <button
                type="button"
                aria-label="Закрыть корзину"
                className="hover-jolt hover-outline-scan rounded-sm border border-line p-1.5 text-muted"
                onClick={() => setIsOpen(false)}
              >
                <X size={15} />
              </button>
            </div>
          </div>

          {items.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted sm:py-8 sm:text-base">Корзина сейчас пуста</p>
          ) : (
            <ul className="cart-scroll max-h-[320px] space-y-2.5 overflow-y-auto py-3 pr-1 sm:max-h-[350px] sm:space-y-3 sm:py-4">
              {items.map((item) => (
                <li key={item.id} className="flex items-center gap-2.5 rounded-sm border border-line p-2 sm:gap-3 sm:p-2.5">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-sm bg-card-bg sm:h-14 sm:w-14">
                    {item.imageUrl ? (
                      <Image src={item.imageUrl} alt={item.name} fill className="object-cover" sizes="(max-width: 639px) 48px, 56px" />
                    ) : (
                      <div className="h-full w-full bg-gradient-to-br from-[#f2ede6] to-[#dfd7cb] dark:from-[#404048] dark:to-[#2a2a30]" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-medium text-text sm:text-sm">{item.name}</p>
                    <p className="text-[11px] uppercase tracking-[0.06em] text-muted sm:text-xs">Размер: {item.size}</p>
                    <p className="text-xs text-muted sm:text-sm">{formatPrice(item.price)}</p>
                  </div>

                  <button
                    type="button"
                    aria-label={`Удалить ${item.name} из корзины`}
                    className="hover-jolt hover-outline-scan rounded-sm border border-line p-1.5 text-muted sm:p-2"
                    onClick={() => dispatch(removeItemFromCart(item.id))}
                  >
                    <ShoppingBag size={14} className="sm:h-4 sm:w-4" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {items.length > 0 ? (
            <div className="mt-2 border-t border-line pt-3 text-xs text-muted sm:text-sm">
              <p>Итоговое количество товаров: {totalCount}</p>
              <p className="mt-1">Итоговая сумма: {formatPrice(totalPrice)}</p>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
