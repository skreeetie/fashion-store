import { CartModal } from "@/features/cart/ui/cart-modal";
import { ThemeToggleButton } from "@/features/theme-toggle/ui/theme-toggle-button";
import clsx from "clsx";

const leftLinks = ["Новинки", "Женщинам", "Мужчинам", "Аксессуары"];
const rightLinks = ["О нас", "Контакты"];

type NavButtonProps = {
  label: string;
  className?: string;
};

function NavButton({ label, className }: NavButtonProps) {
  return (
    <button
      type="button"
      className={clsx(
        "hover-jolt text-[13px] uppercase tracking-[0.12em] text-muted sm:text-sm",
        className,
      )}
    >
      {label}
    </button>
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/92 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1800px] flex-wrap items-center justify-between gap-4 px-6 py-6 sm:px-10 lg:px-16">
        <nav className="flex flex-wrap items-center gap-5 sm:gap-8">
          {leftLinks.map((link) => (
            <NavButton key={link} label={link} />
          ))}
        </nav>

        <div className="flex items-center gap-4 sm:gap-7">
          <nav className="flex flex-wrap items-center gap-5 sm:gap-8">
            {rightLinks.map((link) => (
              <NavButton key={link} label={link} />
            ))}
          </nav>
          <ThemeToggleButton />
          <CartModal />
        </div>
      </div>
    </header>
  );
}
