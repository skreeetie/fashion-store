import { Suspense } from "react";
import { Header } from "@/widgets/header/ui/header";
import { CatalogView } from "@/widgets/catalog/ui/catalog-view";

export function HomePage() {
  return (
    <main className="mx-auto min-h-screen max-w-[1800px] px-6 py-8 sm:px-10 sm:py-10 lg:px-16">
      <Header />
      <Suspense fallback={<div className="mt-10 h-[420px] animate-pulse rounded-sm border border-line" />}>
        <CatalogView />
      </Suspense>
    </main>
  );
}
