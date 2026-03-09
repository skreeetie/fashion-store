import { Suspense } from "react";
import { CatalogView } from "@/widgets/catalog/ui/catalog-view";

type HomePageProps = {
  title?: string;
  source?: "catalog" | "men" | "women" | "new";
};

export function HomePage({ title = "Каталог", source = "catalog" }: HomePageProps) {
  return (
    <main className="min-h-screen">
      <div className="mx-auto max-w-[1800px] px-3 pb-8 sm:px-10 sm:pb-10 lg:px-16">
        <Suspense fallback={<div className="mt-10 h-[420px] animate-pulse rounded-sm border border-line" />}>
          <CatalogView title={title} source={source} />
        </Suspense>
      </div>
    </main>
  );
}
