import Link from "next/link";
import { Heart, Search, ShoppingBag, Sparkles, UserRound } from "lucide-react";
const links = [
  ["Главная", "/"],
  ["AI", "/ai"],
  ["Поиск", "/search"],
  ["Избранное", "/favorites"],
  ["Профиль", "/profile"],
] as const;
export function SiteNav() {
  return (
    <nav
      aria-label="Основная навигация"
      className="sticky top-0 z-20 border-b border-stone-200 bg-white/90 backdrop-blur"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
        <Link href="/" className="font-semibold">
          AI Fashion
        </Link>
        <div className="hidden gap-5 sm:flex">
          {links.map(([label, href]) => (
            <Link
              className="text-sm text-stone-600 hover:text-stone-950"
              href={href}
              key={href}
            >
              {label}
            </Link>
          ))}
        </div>
        <Link
          href="/cart"
          aria-label="Корзина"
          className="rounded-full p-2 hover:bg-stone-100"
        >
          <ShoppingBag size={19} />
        </Link>
      </div>
      <div className="flex justify-around border-t px-2 py-2 sm:hidden">
        {[
          [Sparkles, "/ai", "AI"],
          [Search, "/search", "Поиск"],
          [Heart, "/favorites", "Избранное"],
          [UserRound, "/profile", "Профиль"],
        ].map(([Icon, href, label]) => (
          <Link
            href={String(href)}
            key={String(href)}
            className="flex flex-col items-center text-[11px] text-stone-600"
          >
            <Icon size={17} />
            {String(label)}
          </Link>
        ))}
      </div>
    </nav>
  );
}
