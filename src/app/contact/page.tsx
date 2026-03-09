export default function ContactPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-[1800px] px-3 pb-10 pt-8 sm:px-10 sm:pb-12 sm:pt-10 lg:px-16">
      <section className="rounded-md border border-line bg-card-bg/45 p-6 sm:p-8 lg:p-10">
        <p className="catalog-title text-[clamp(36px,7vw,92px)] uppercase leading-none tracking-[0.04em] text-text">
          Контакты
        </p>
        <div className="mt-6 space-y-3 text-sm text-muted sm:text-base">
          <p>Email: info@fashionstore.ru</p>
          <p>Телефон: +7 (999) 123-45-67</p>
          <p>Режим работы: Пн-Вс 10:00 - 22:00</p>
        </div>
      </section>
    </main>
  );
}
