"use client";

import { FormEvent, useState } from "react";
import {
  Camera,
  ImagePlus,
  MapPin,
  Menu,
  Mic,
  Package,
  Plus,
  SendHorizontal,
  ShoppingBag,
  Sparkles,
  WandSparkles,
  X,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/types/catalog";

const products: Product[] = [
  {
    id: "linen-set",
    name: "Льняной костюм Latte",
    price: "12 990 ₽",
    sizes: ["S", "M", "L"],
    availability: "В наличии",
    color: "#e7ded3",
  },
  {
    id: "trench",
    name: "Тренч Soft Sand",
    price: "16 490 ₽",
    sizes: ["XS", "S", "M"],
    availability: "Мало осталось",
    color: "#d5c6b5",
  },
  {
    id: "silk-top",
    name: "Шёлковый топ Pearl",
    price: "6 790 ₽",
    sizes: ["S", "M", "L"],
    availability: "В наличии",
    color: "#ebe7e0",
  },
];

type Message = { id: string; role: "assistant" | "user"; text: string };

const initialMessages: Message[] = [
  {
    id: "welcome",
    role: "assistant",
    text: "Здравствуйте! 👋\n\nЯ ваш персональный продавец одежды. Помогу подобрать вещи, найти похожие модели и показать, как выбранная одежда может выглядеть на вас.\n\nМожете написать мне, отправить фотографию или рассказать голосом, что вы ищете.",
  },
  {
    id: "prompt",
    role: "assistant",
    text: "Например: «Ищу образ на осень для офиса»",
  },
];

const actions = [
  { label: "Камера", icon: Camera },
  { label: "Фото", icon: ImagePlus },
  { label: "Найти по фотографии", icon: Sparkles },
  { label: "Примерить", icon: WandSparkles },
  { label: "Мои заказы", icon: Package },
  { label: "Найти магазин", icon: MapPin },
];

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <div
        className="relative aspect-[1.14] overflow-hidden"
        style={{ backgroundColor: product.color }}
      >
        <div className="absolute left-1/2 top-[18%] h-[72%] w-[52%] -translate-x-1/2 rounded-t-[42%] rounded-b-[22%] border border-stone-300/50 bg-white/35" />
        <div className="absolute left-1/2 top-[31%] h-4 w-[68%] -translate-x-1/2 rounded-full bg-white/30" />
        <span className="absolute bottom-3 left-3 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-medium text-stone-700 backdrop-blur">
          AI Fashion edit
        </span>
      </div>
      <div className="space-y-3 p-4">
        <div>
          <h3 className="text-sm font-semibold">{product.name}</h3>
          <p className="mt-1 text-sm text-stone-500">{product.price}</p>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-stone-500">
            Размеры: {product.sizes.join(" · ")}
          </span>
          <span
            className={
              product.availability === "В наличии"
                ? "text-emerald-700"
                : "text-amber-700"
            }
          >
            {product.availability}
          </span>
        </div>
        <div className="flex gap-2">
          <Button className="flex-1 px-2 py-2 text-xs" variant="secondary">
            Подробнее
          </Button>
          <Button className="flex-1 px-2 py-2 text-xs">Примерить</Button>
        </div>
      </div>
    </article>
  );
}

export function AiSellerChat() {
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setMessages((current) => [
      ...current,
      { id: crypto.randomUUID(), role: "user", text },
    ]);
    setDraft("");
    setIsTyping(true);
    window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: "Поняла вас. Я уже подбираю варианты — начнём с этих моделей. При желании уточните цвет, размер или повод.",
        },
      ]);
      setIsTyping(false);
    }, 650);
  }

  return (
    <main className="min-h-screen bg-[#f7f6f4] text-stone-900">
      <div className="mx-auto flex min-h-screen max-w-6xl flex-col border-x border-stone-200 bg-[#fcfbf9]">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-stone-200 px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <Button
              variant="icon"
              className="sm:hidden"
              aria-label="Открыть меню"
            >
              <Menu size={19} />
            </Button>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-stone-900 text-white">
              <ShoppingBag size={17} />
            </div>
            <div>
              <h1 className="text-sm font-semibold">AI Продавец</h1>
              <div className="flex items-center gap-1.5 text-xs text-stone-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Онлайн · отвечаю сразу
              </div>
            </div>
          </div>
          <Button variant="ghost" className="hidden sm:inline-flex">
            Новый диалог
          </Button>
        </header>

        <section
          className="flex flex-1 flex-col px-4 py-6 sm:px-8 sm:py-9"
          aria-label="Диалог с AI продавцом"
        >
          <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col">
            <div className="space-y-6 pb-6">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : ""}`}
                >
                  {message.role === "assistant" && <Avatar assistant />}
                  <div
                    className={`max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-6 ${message.role === "assistant" ? "bg-stone-100 text-stone-800" : "bg-stone-900 text-white"}`}
                  >
                    {message.text}
                  </div>
                  {message.role === "user" && <Avatar />}
                </div>
              ))}
              <div className="ml-12">
                <p className="mb-3 text-sm font-medium text-stone-800">
                  Подобрала несколько вариантов
                </p>
                <div className="grid gap-3 sm:grid-cols-3">
                  {products.map((product) => (
                    <ProductCard key={product.id} product={product} />
                  ))}
                </div>
              </div>
              {isTyping && (
                <div className="flex gap-3">
                  <Avatar assistant />
                  <div
                    className="flex items-center gap-1 rounded-2xl bg-stone-100 px-4 py-4"
                    aria-live="polite"
                    aria-label="AI продавец печатает"
                  >
                    <i />
                    <i />
                    <i />
                  </div>
                </div>
              )}
            </div>
            <div className="sticky bottom-0 mt-auto bg-[#fcfbf9] pt-4">
              {menuOpen && (
                <div
                  className="mb-3 grid grid-cols-2 gap-2 rounded-2xl border border-stone-200 bg-white p-2 shadow-lg sm:grid-cols-3"
                  role="menu"
                >
                  {actions.map(({ label, icon: Icon }) => (
                    <button
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 rounded-xl px-3 py-3 text-left text-sm text-stone-700 hover:bg-stone-100"
                      key={label}
                      role="menuitem"
                    >
                      <Icon size={17} className="text-stone-500" />
                      {label}
                    </button>
                  ))}
                </div>
              )}
              <form
                onSubmit={sendMessage}
                className="flex items-end gap-1 rounded-2xl border border-stone-200 bg-white p-2 shadow-sm focus-within:border-stone-400 focus-within:ring-2 focus-within:ring-stone-200"
              >
                <Button
                  type="button"
                  variant="icon"
                  aria-label={
                    menuOpen ? "Закрыть меню действий" : "Открыть меню действий"
                  }
                  onClick={() => setMenuOpen(!menuOpen)}
                >
                  {menuOpen ? <X size={19} /> : <Plus size={20} />}
                </Button>
                <Button
                  type="button"
                  variant="icon"
                  aria-label="Прикрепить фотографию"
                >
                  <ImagePlus size={19} />
                </Button>
                <Button
                  type="button"
                  variant="icon"
                  aria-label="Записать голосовое сообщение"
                >
                  <Mic size={19} />
                </Button>
                <label className="sr-only" htmlFor="message">
                  Сообщение
                </label>
                <textarea
                  id="message"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" && !event.shiftKey) {
                      event.preventDefault();
                      event.currentTarget.form?.requestSubmit();
                    }
                  }}
                  rows={1}
                  placeholder="Напишите, что ищете…"
                  className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-2 py-2.5 text-sm outline-none placeholder:text-stone-400"
                />
                <Button
                  type="submit"
                  variant="icon"
                  className="bg-stone-900 text-white hover:bg-stone-700"
                  aria-label="Отправить сообщение"
                  disabled={!draft.trim()}
                >
                  <SendHorizontal size={18} />
                </Button>
              </form>
              <p className="mt-3 text-center text-xs text-stone-400">
                AI Fashion может ошибаться. Для точного наличия уточняйте детали
                у магазина.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
