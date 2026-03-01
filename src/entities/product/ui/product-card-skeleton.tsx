export function ProductCardSkeleton() {
  return (
    <article className="flex flex-col">
      <div className="skeleton-shimmer aspect-[4/5] rounded-sm" />
      <div className="skeleton-shimmer mt-3 h-7 w-3/4 self-center rounded-sm" />
      <div className="skeleton-shimmer mt-2 h-7 w-1/2 self-center rounded-sm" />
      <div className="skeleton-shimmer mt-3 h-10 rounded-sm" />
    </article>
  );
}
