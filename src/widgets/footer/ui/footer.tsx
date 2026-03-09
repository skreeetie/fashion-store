import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-14 border-t border-line bg-bg/85">
      <div className="mx-auto max-w-[1800px] px-3 py-10 sm:px-10 sm:py-12 lg:px-16">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <section>
            <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-text">Информация</h3>
            <p className="mt-4 text-sm text-muted">ИП Петров Петр Петрович</p>
            <p className="mt-2 text-sm text-muted">ОГРНИП 123456789</p>
            <p className="mt-2 text-sm text-muted">Москва, ул. Петровская 123</p>
          </section>

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-text">Ссылки</h3>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link href="/" className="hover-jolt text-sm text-muted hover:text-text">
                  Главная
                </Link>
              </li>
              <li>
                <Link href="/new" className="hover-jolt text-sm text-muted hover:text-text">
                  Новинки
                </Link>
              </li>
              <li>
                <Link href="/women" className="hover-jolt text-sm text-muted hover:text-text">
                  Женщинам
                </Link>
              </li>
              <li>
                <Link href="/men" className="hover-jolt text-sm text-muted hover:text-text">
                  Мужчинам
                </Link>
              </li>
            </ul>
          </section>

          <section>
            <h3 className="text-sm font-semibold uppercase tracking-[0.08em] text-text">Контакты</h3>
            <p className="mt-4 text-sm text-muted">Email: info@fashionstore.ru</p>
            <p className="mt-2 text-sm text-muted">Телефон: +7 (999) 123-45-67</p>
            <p className="mt-2 text-sm text-muted">Пн-Вс 10:00 - 22:00</p>
          </section>
        </div>

        <div className="mt-8 border-t border-line pt-6 text-center text-xs text-muted sm:text-sm">
          <p>© {new Date().getFullYear()} Fashion Store. Все права защищены.</p>
        </div>
      </div>
    </footer>
  );
}
