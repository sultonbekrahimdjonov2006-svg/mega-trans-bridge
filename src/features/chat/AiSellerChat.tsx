"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import Link from "next/link";
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
  UserRound,
  WandSparkles,
  X,
} from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import {
  requestConsultantHandoff,
  requestSellerResponse,
} from "@/features/chat/api";
import type { AiConversation, AiMessage } from "@/types/ai";
import type { CatalogProduct } from "@/types/catalog";

const initialMessages: AiMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    content:
      "Здравствуйте! 👋\n\nЯ ваш персональный продавец одежды. Помогу подобрать вещи, найти похожие модели и показать, как выбранная одежда может выглядеть на вас.\n\nМожете написать мне, отправить фотографию или рассказать голосом, что вы ищете.",
    createdAt: "2026-01-01",
  },
  {
    id: "prompt",
    role: "assistant",
    content: "Например: «Мне нужно чёрное платье до 1 000 000 сум»",
    createdAt: "2026-01-01",
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
const formatPrice = (amount: number) =>
  new Intl.NumberFormat("ru-RU").format(amount) + " сум";

function ProductCard({
  product,
  onTryOn,
}: {
  product: CatalogProduct;
  onTryOn: (name: string) => void;
}) {
  const sizes = product.sizes.map((size) => size.label).join(" · ");
  return (
    <article className="overflow-hidden rounded-2xl border border-stone-200 bg-white">
      <div
        className="relative aspect-[1.14] overflow-hidden"
        style={{ backgroundColor: product.images[0]?.placeholderColor }}
      >
        <div className="absolute left-1/2 top-[18%] h-[72%] w-[52%] -translate-x-1/2 rounded-t-[42%] rounded-b-[22%] border border-stone-300/50 bg-white/35" />
        <span className="absolute bottom-3 left-3 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-medium text-stone-700">
          {product.brand}
        </span>
      </div>
      <div className="space-y-3 p-4">
        <div>
          <h3 className="text-sm font-semibold">{product.name}</h3>
          <p className="mt-1 text-sm text-stone-500">
            {formatPrice(product.price.amount)}
          </p>
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-stone-500">Размеры: {sizes}</span>
          <span
            className={
              product.availability === "in_stock"
                ? "text-emerald-700"
                : "text-amber-700"
            }
          >
            {product.availability === "in_stock"
              ? "В наличии"
              : "Мало осталось"}
          </span>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/products/${product.id}`}
            className="flex flex-1 items-center justify-center rounded-xl border border-stone-200 px-2 py-2 text-xs font-medium hover:bg-stone-50"
          >
            Подробнее
          </Link>
          <Button
            className="flex-1 px-2 py-2 text-xs"
            onClick={() =>
              onTryOn(
                `Виртуальная примерка «${product.name}» будет доступна в следующем этапе.`,
              )
            }
          >
            Примерить
          </Button>
        </div>
      </div>
    </article>
  );
}

export function AiSellerChat() {
  const [messages, setMessages] = useState(initialMessages);
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [draft, setDraft] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [notice, setNotice] = useState<string>();
  const [imageFile, setImageFile] = useState<File>();
  const [imageConsent, setImageConsent] = useState(false);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const conversation = useMemo<AiConversation>(
    () => ({
      id: "demo-conversation",
      storeId: "atelier-north",
      messages,
      createdAt: initialMessages[0].createdAt,
      updatedAt: new Date().toISOString(),
    }),
    [messages],
  );
  function appendNotice(content: string) {
    setMessages((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        role: "assistant",
        content,
        createdAt: new Date().toISOString(),
      },
    ]);
  }
  async function searchByImage() {
    if (!imageFile || !imageConsent) {
      setNotice("Подтвердите согласие на обработку изображения.");
      return;
    }
    setIsTyping(true);
    try {
      const data = new FormData();
      data.set("image", imageFile);
      data.set("consent", "true");
      if (draft.trim()) data.set("text", draft.trim());
      const response = await fetch("/api/image-search", {
        method: "POST",
        body: data,
      });
      const payload = (await response.json()) as {
        products?: CatalogProduct[];
        notice?: string;
        error?: { message: string };
      };
      if (!response.ok) throw new Error(payload.error?.message);
      setProducts(payload.products ?? []);
      setNotice(payload.notice ?? "Поиск по изображению завершён.");
      setImageFile(undefined);
      setImageConsent(false);
    } catch (error) {
      setNotice(
        error instanceof Error && error.message
          ? error.message
          : "Не удалось выполнить поиск по изображению.",
      );
    } finally {
      setIsTyping(false);
    }
  }
  async function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const userMessage: AiMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: text,
      createdAt: new Date().toISOString(),
      input: { type: "text", text },
    };
    const nextConversation = {
      ...conversation,
      messages: [...messages, userMessage],
    };
    setMessages((current) => [...current, userMessage]);
    setDraft("");
    setIsTyping(true);
    setNotice(undefined);
    try {
      const response = await requestSellerResponse(
        { type: "text", text },
        nextConversation,
      );
      setMessages((current) => [...current, response.message]);
      setProducts(response.recommendations.map((item) => item.product));
      const outfitSummary = response.outfit
        ? ` Образ: ${response.outfit.products.length} вещи на ${formatPrice(response.outfit.totalPrice)}.`
        : "";
      setNotice(
        `${response.notice === "mock_response" ? "Демонстрационный mock-ответ." : "Ответ AI Fashion Seller."}${outfitSummary}${response.followUp ? ` ${response.followUp}` : ""}`,
      );
    } catch {
      appendNotice("Не удалось обработать запрос. Попробуйте ещё раз.");
    } finally {
      setIsTyping(false);
    }
  }
  async function handoff() {
    try {
      const result = await requestConsultantHandoff(
        conversation.id,
        products.map((product) => product.id),
      );
      setNotice(result.message);
    } catch {
      setNotice("Не удалось подготовить запрос консультанту.");
    }
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
          <Button
            variant="ghost"
            className="hidden sm:inline-flex"
            onClick={handoff}
          >
            <UserRound size={16} />
            Позвать консультанта
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
                    {message.content}
                  </div>
                  {message.role === "user" && <Avatar />}
                </div>
              ))}
              {products.length > 0 && (
                <div className="ml-0 sm:ml-12">
                  <p className="mb-3 text-sm font-medium text-stone-800">
                    Подходящие варианты
                  </p>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {products.map((product) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        onTryOn={appendNotice}
                      />
                    ))}
                  </div>
                </div>
              )}
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
              {notice && (
                <p
                  className="mb-3 rounded-xl bg-stone-100 px-3 py-2 text-sm text-stone-600"
                  aria-live="polite"
                >
                  {notice}
                </p>
              )}
              {menuOpen && (
                <div
                  className="mb-3 grid grid-cols-2 gap-2 rounded-2xl border border-stone-200 bg-white p-2 shadow-lg sm:grid-cols-3"
                  role="menu"
                >
                  {actions.map(({ label, icon: Icon }) => (
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        setNotice(
                          `${label}: эта возможность пока не подключена.`,
                        );
                      }}
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
              <div
                className="mb-2 flex gap-2 overflow-x-auto pb-1"
                aria-label="Быстрые действия"
              >
                {["Найти одежду", "Собрать образ", "Найти дешевле"].map(
                  (suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => setDraft(suggestion)}
                      className="shrink-0 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-600 hover:bg-stone-100"
                    >
                      {suggestion}
                    </button>
                  ),
                )}
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  className="shrink-0 rounded-full border border-stone-200 bg-white px-3 py-1.5 text-xs text-stone-600"
                >
                  Подобрать по фото
                </button>
              </div>
              <input
                ref={imageInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="sr-only"
                onChange={(event) => setImageFile(event.target.files?.[0])}
              />
              {imageFile && (
                <div className="mb-3 rounded-2xl border border-stone-200 bg-white p-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="truncate text-sm">{imageFile.name}</span>
                    <button
                      type="button"
                      className="text-xs text-stone-500 underline"
                      onClick={() => {
                        setImageFile(undefined);
                        setImageConsent(false);
                      }}
                    >
                      Удалить
                    </button>
                  </div>
                  <label className="mt-3 flex items-start gap-2 text-xs text-stone-600">
                    <input
                      type="checkbox"
                      checked={imageConsent}
                      onChange={(event) =>
                        setImageConsent(event.target.checked)
                      }
                    />
                    Я разрешаю обработать изображение для поиска одежды и
                    подтверждаю право на его использование. Чувствительные
                    признаки не определяются.
                  </label>
                  <Button
                    type="button"
                    className="mt-3 w-full"
                    onClick={searchByImage}
                    disabled={!imageConsent || isTyping}
                  >
                    {isTyping ? "Анализируем…" : "Найти похожее"}
                  </Button>
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
                  onClick={() => imageInputRef.current?.click()}
                >
                  <ImagePlus size={19} />
                </Button>
                <Button
                  type="button"
                  variant="icon"
                  aria-label="Записать голосовое сообщение"
                  onClick={() =>
                    setNotice("Голосовой ввод ждёт безопасной транскрибации.")
                  }
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
