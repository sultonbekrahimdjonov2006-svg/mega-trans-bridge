"use client";
import { FormEvent, useState } from "react";
import { useParams } from "next/navigation";
export default function TryOnPage() {
  const { productId } = useParams<{ productId: string }>();
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    data.set("productId", productId);
    try {
      const response = await fetch("/api/vto", { method: "POST", body: data });
      const body = (await response.json()) as {
        notice?: string;
        error?: { message: string };
      };
      setMessage(
        body.notice ?? body.error?.message ?? "Не удалось выполнить примерку.",
      );
    } finally {
      setLoading(false);
    }
  }
  return (
    <main className="mx-auto max-w-xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Примерить на фото</h1>
      <p className="mt-2 text-stone-500">
        Посмотрите, как вещь может выглядеть на вас. Визуализация не гарантирует
        реальную посадку.
      </p>
      <form
        onSubmit={submit}
        className="mt-6 space-y-4 rounded-2xl border bg-white p-5"
      >
        <input
          required
          type="file"
          name="image"
          accept="image/jpeg,image/png,image/webp"
        />
        <label className="flex gap-2 text-sm">
          <input required type="checkbox" name="consent" value="true" />Я
          разрешаю обработать фото для демонстрационной примерки.
        </label>
        <button
          disabled={loading}
          className="w-full rounded-xl bg-stone-900 p-3 text-white"
        >
          {loading ? "Обрабатываем…" : "Начать примерку"}
        </button>
        {message && (
          <p aria-live="polite" className="rounded-xl bg-stone-100 p-3 text-sm">
            {message}
          </p>
        )}
      </form>
    </main>
  );
}
