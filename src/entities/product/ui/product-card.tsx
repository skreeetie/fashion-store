import Image from "next/image";
import { Product } from "../model/types";
import { formatPrice } from "@/shared/lib/format-price";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
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
        className="hover-jolt hover-outline-scan mt-3 rounded-sm border border-line px-4 py-2 text-sm tracking-[0.08em] text-text"
        type="button"
      >
        В корзину
      </button>
    </article>
  );
}
