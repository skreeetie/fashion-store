import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[calc(100vh-90px)] w-full max-w-[1800px] items-center justify-center px-4 py-10 sm:px-10 lg:px-16">
      <section className="w-full max-w-2xl rounded-md border border-line bg-card-bg/45 p-8 text-center sm:p-12">
        <p className="catalog-title text-[clamp(56px,9vw,120px)] leading-none text-muted">404</p>
        <p className="mt-2 text-3xl text-text sm:text-4xl">:(</p>
        <h1 className="mt-4 text-2xl font-medium text-text sm:text-3xl">Страница не найдена</h1>
        <p className="mt-3 text-sm text-muted sm:text-base">
          Похоже, эта страница ушла с подиума. Вернитесь в каталог, там всё на месте.
        </p>
        <Link
          href="/"
          className="hover-jolt hover-outline-scan mt-7 inline-flex rounded-sm border border-line px-5 py-2 text-sm uppercase tracking-[0.08em] text-text"
        >
          В каталог
        </Link>
      </section>
    </main>
  );
}
