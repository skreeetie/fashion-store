"use client";

import { useEffect, useRef, useState } from "react";
import { CartModal } from "@/features/cart/ui/cart-modal";
import { ThemeToggleButton } from "@/features/theme-toggle/ui/theme-toggle-button";
import clsx from "clsx";
import { Menu, X } from "lucide-react";

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
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isMenuOpen) {
      return;
    }

    const onPointerDown = (event: MouseEvent) => {
      if (!mobileMenuRef.current?.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener("mousedown", onPointerDown);
    window.addEventListener("keydown", onEscape);

    return () => {
      window.removeEventListener("mousedown", onPointerDown);
      window.removeEventListener("keydown", onEscape);
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-bg/92 backdrop-blur-md">
      <div className="mx-auto hidden max-w-[1800px] flex-wrap items-center justify-between gap-4 px-6 py-6 sm:flex sm:px-10 lg:px-16">
        <nav className="flex flex-wrap items-center gap-6 lg:gap-8">
          {leftLinks.map((link) => (
            <NavButton key={link} label={link} />
          ))}
        </nav>

        <div className="flex items-center gap-7">
          <nav className="flex flex-wrap items-center gap-6 lg:gap-8">
            {rightLinks.map((link) => (
              <NavButton key={link} label={link} />
            ))}
          </nav>
          <ThemeToggleButton />
          <CartModal />
        </div>
      </div>

      <div className="mx-auto flex max-w-[1800px] items-center justify-between px-3 py-3 sm:hidden" ref={mobileMenuRef}>
        <button
          type="button"
          aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
          className="hover-jolt hover-outline-scan rounded-sm border border-line p-2 text-text"
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          {isMenuOpen ? <X size={18} /> : <Menu size={18} />}
        </button>

        <div className="flex items-center gap-2.5">
          <ThemeToggleButton />
          <CartModal />
        </div>

        {isMenuOpen ? (
          <div className="absolute left-3 right-3 top-full mt-2 rounded-sm border border-line bg-bg p-3 shadow-lg">
            <nav className="grid grid-cols-2 gap-x-3 gap-y-2">
              {[...leftLinks, ...rightLinks].map((link) => (
                <NavButton key={link} label={link} className="text-left text-xs" />
              ))}
            </nav>
          </div>
        ) : null}
      </div>
    </header>
  );
}
