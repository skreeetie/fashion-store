"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { toggleItemInCart, selectIsProductInCart } from "@/entities/cart/model/cart-slice";
import { useAppDispatch, useAppSelector } from "@/shared/lib/hooks/redux";
import { Product } from "../model/types";
import { formatPrice } from "@/shared/lib/format-price";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
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
      <div className="mt-3 text-center">
        <h3 className="text-[clamp(17px,1.6vw,36px)] font-medium text-text">{product.name}</h3>
        <p className="mt-1 text-[clamp(17px,1.6vw,36px)] text-muted">{formatPrice(product.price)}</p>
      </div>
      <button
        className={clsx(
          "hover-jolt hover-outline-scan mt-3 rounded-sm border px-4 py-2 text-sm tracking-[0.08em]",
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
            }),
          )
        }
      >
        {cartLabel}
      </button>
    </article>
  );
}
