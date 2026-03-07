"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { toggleItemInCart, selectIsProductInCart } from "@/entities/cart/model/cart-slice";
import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks/redux";
import { Product, ProductSize } from "../model/types";
import { formatPrice } from "@/shared/lib/format-price";

type ProductCardProps = {
  product: Product;
};

const ALL_SIZES: ProductSize[] = ["s", "m", "l", "xl", "xxl"];

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [selectedSize, setSelectedSize] = useState<ProductSize>(product.availableSizes[0] ?? "m");
  const dispatch = useAppDispatch();
  const isInCart = useAppSelector(selectIsProductInCart(product.id));

  const cartLabel = isInCart ? (isHovered ? "Убрать из корзины" : "В корзине") : "В корзину";

  return (
    <article className="group flex flex-col">
      <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-card-bg">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 50vw, 33vw"
            priority={product.id <= 3}
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-[#f2ede6] to-[#dfd7cb] dark:from-[#404048] dark:to-[#2a2a30]" />
        )}
      </div>
      <div className="mt-2 text-center sm:mt-3">
        <h3
          title={product.name}
          className="truncate text-base font-medium leading-snug text-text sm:text-[clamp(17px,1.6vw,36px)]"
        >
          {product.name}
        </h3>
        <p className="mt-1 text-base text-muted sm:text-[clamp(17px,1.6vw,36px)]">{formatPrice(product.price)}</p>
      </div>
      <div className="mt-2.5 grid w-full grid-cols-5 gap-1 sm:mt-3 sm:gap-1.5">
        {ALL_SIZES.map((size) => {
          const isAvailable = product.availableSizes.includes(size);
          const isActive = selectedSize === size;

          return (
            <button
              key={size}
              type="button"
              disabled={!isAvailable}
              aria-pressed={isActive}
              className={clsx(
                "w-full rounded-sm border px-1 py-1 text-[10px] uppercase tracking-[0.04em] transition-colors sm:px-2 sm:text-xs sm:tracking-[0.06em]",
                size === "xxl" && "px-[3px] pr-[5px] text-[9px] tracking-[0] sm:px-2 sm:text-[11px]",
                isActive ? "border-text bg-text text-bg" : "border-line text-muted",
                !isAvailable && "cursor-not-allowed border-line/60 text-muted/40 line-through",
              )}
              onClick={() => setSelectedSize(size)}
            >
              {size}
            </button>
          );
        })}
      </div>
      <button
        className={clsx(
          "hover-jolt hover-outline-scan mt-2.5 rounded-sm border px-3 py-2 text-base tracking-[0.04em] sm:mt-3 sm:px-4 sm:text-sm sm:tracking-[0.08em]",
          isInCart ? "border-accent text-accent" : "border-line text-text",
        )}
        type="button"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() =>
          dispatch(
            toggleItemInCart({
              id: product.id,
              slug: product.slug,
              name: product.name,
              price: product.price,
              imageUrl: product.imageUrl,
              size: selectedSize,
            }),
          )
        }
      >
        {cartLabel}
      </button>
    </article>
  );
}
