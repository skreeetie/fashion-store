"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartModal } from "@/features/cart/ui/cart-modal";
import { ThemeToggleButton } from "@/features/theme-toggle/ui/theme-toggle-button";
import clsx from "clsx";
import { Menu, X } from "lucide-react";

const leftLinks = [
  { label: "Главная", href: "/" },
  { label: "Новинки", href: "/new" },
  { label: "Женщинам", href: "/women" },
  { label: "Мужчинам", href: "/men" },
];
const rightLinks = ["О нас", "Контакты"];

type NavLinkProps = {
  label: string;
  href: string;
  isActive: boolean;
  onNavigate?: () => void;
  className?: string;
};

function NavLink({ label, href, isActive, onNavigate, className }: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={clsx(
        "hover-jolt border-b px-0.5 pb-0.5 text-[13px] uppercase tracking-[0.12em] sm:text-sm",
        isActive ? "border-accent text-accent" : "border-transparent text-muted",
        className,
      )}
    >
      {label}
    </Link>
  );
}

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const pathname = usePathname();

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
            <NavLink
              key={link.href}
              label={link.label}
              href={link.href}
              isActive={pathname === link.href}
            />
          ))}
        </nav>

        <div className="flex items-center gap-7">
          <nav className="flex flex-wrap items-center gap-6 lg:gap-8">
            {rightLinks.map((link) => (
              <button
                key={link}
                type="button"
                className="hover-jolt text-[13px] uppercase tracking-[0.12em] text-muted sm:text-sm"
              >
                {link}
              </button>
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
            <nav className="grid grid-cols-2 gap-x-3 gap-y-2 pb-2">
              {leftLinks.map((link) => (
                <NavLink
                  key={link.href}
                  label={link.label}
                  href={link.href}
                  isActive={pathname === link.href}
                  onNavigate={() => setIsMenuOpen(false)}
                  className="text-left text-xs"
                />
              ))}
            </nav>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 border-t border-line pt-2">
              {rightLinks.map((link) => (
                <button key={link} type="button" className="hover-jolt text-left text-xs uppercase tracking-[0.12em] text-muted">
                  {link}
                </button>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </header>
  );
}
