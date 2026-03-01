import { ShoppingBag } from "lucide-react";
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
    <header className="border-b border-line pb-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
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
          <button
            className="hover-jolt rounded-sm border border-transparent p-1.5 text-muted"
            type="button"
            aria-label="Корзина"
          >
            <ShoppingBag size={22} />
          </button>
        </div>
      </div>
    </header>
  );
}
