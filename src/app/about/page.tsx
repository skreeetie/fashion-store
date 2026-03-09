export default function AboutPage() {
  return (
    <main className="mx-auto min-h-screen w-full max-w-[1800px] px-3 pb-10 pt-8 sm:px-10 sm:pb-12 sm:pt-10 lg:px-16">
      <section className="rounded-md border border-line bg-card-bg/45 p-6 sm:p-8 lg:p-10">
        <p className="catalog-title text-[clamp(36px,7vw,92px)] uppercase leading-none tracking-[0.04em] text-text">
          О нас
        </p>
        <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
          Когда-то Fashion Store был тайной мастерской между старым кинотеатром и кофейней без вывески. По легенде,
          туда приносили винтажные вещи после ночных съемок, а утром из них собирали новые образы для тех, кто не
          хотел выглядеть «как все».
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
          Мы сохранили этот дух: сочетать классику и стрит, строгие линии и неожиданные детали. Поэтому в каталоге
          рядом живут пальто с характером, лоферы для долгих городских маршрутов и новинки, которые появляются быстрее,
          чем о них успевают рассказать.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
          Наш простой лор: мы одеваем людей так, будто у каждого сегодня важная сцена. Даже если это просто путь за
          кофе в 8:30.
        </p>
      </section>
    </main>
  );
}
