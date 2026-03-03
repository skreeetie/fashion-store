import { Suspense } from "react";
import { Header } from "@/widgets/header/ui/header";
import { CatalogView } from "@/widgets/catalog/ui/catalog-view";

export function HomePage() {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="mx-auto max-w-[1800px] px-6 pb-8 sm:px-10 sm:pb-10 lg:px-16">
        <Suspense fallback={<div className="mt-10 h-[420px] animate-pulse rounded-sm border border-line" />}>
          <CatalogView />
        </Suspense>
      </div>
    </main>
  );
}
