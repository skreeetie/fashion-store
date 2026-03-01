import clsx from "clsx";
import { Product } from "../model/types";
import { formatPrice } from "@/shared/lib/format-price";

const toneClasses: Record<Product["tone"], string> = {
  cream: "from-[#f2ede6] to-[#e6ded1]",
  charcoal: "from-[#3b3b40] to-[#23242a]",
  sand: "from-[#ddd3c4] to-[#c9bcac]",
  sky: "from-[#d4dce2] to-[#b9c8d4]",
  olive: "from-[#d9d2c5] to-[#bfb3a0]",
  vanilla: "from-[#f5f1ea] to-[#ddd8cf]",
};

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  return (
    <article className="group flex flex-col">
      <div
        className={clsx(
          "relative aspect-[4/5] rounded-sm bg-gradient-to-br p-5",
          toneClasses[product.tone],
        )}
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(255,255,255,0.28),transparent_48%)]" />
        <div className="absolute right-3 top-3 text-[11px] uppercase tracking-[0.24em] text-black/45">
          New
        </div>
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
