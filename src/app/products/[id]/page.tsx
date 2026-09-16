import { notFound } from "next/navigation";
import Link from "next/link";
import { catalogRepository } from "@/server/bootstrap";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await catalogRepository.getById(id);
  if (!product) notFound();
  const sizes = product.sizes.map((size) => size.label).join(" · ");
  const price = new Intl.NumberFormat("ru-RU").format(product.price.amount);
  return (
    <main className="min-h-screen bg-[#f7f6f4] px-4 py-8 text-stone-900 sm:px-8">
      <article className="mx-auto grid max-w-5xl gap-8 rounded-3xl border border-stone-200 bg-[#fcfbf9] p-5 sm:grid-cols-2 sm:p-8">
        <div
          className="aspect-[.9] rounded-2xl"
          style={{ backgroundColor: product.images[0]?.placeholderColor }}
          aria-label={product.images[0]?.alt}
        />
        <div className="space-y-5">
          <p className="text-sm text-stone-500">
            {product.brand} · {product.category}
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            {product.name}
          </h1>
          <p className="text-2xl">
            {price}{" "}
            {product.price.currency === "UZS" ? "сум" : product.price.currency}
          </p>
          <p className="leading-7 text-stone-600">{product.description}</p>
          <dl className="space-y-2 text-sm">
            <div>
              <dt className="inline font-medium">Цвета: </dt>
              <dd className="inline">
                {product.colors.map((color) => color.name).join(", ")}
              </dd>
            </div>
            <div>
              <dt className="inline font-medium">Размеры: </dt>
              <dd className="inline">{sizes}</dd>
            </div>
            <div>
              <dt className="inline font-medium">Наличие: </dt>
              <dd className="inline">
                {product.availability === "in_stock"
                  ? "В наличии"
                  : "Мало осталось"}
              </dd>
            </div>
            <div>
              <dt className="inline font-medium">Магазин: </dt>
              <dd className="inline">{product.storeId}</dd>
            </div>
          </dl>
          <div className="grid grid-cols-2 gap-2">
            <button className="rounded-xl bg-stone-900 px-4 py-3 text-sm font-medium text-white">
              В корзину
            </button>
            <button className="rounded-xl border border-stone-200 px-4 py-3 text-sm font-medium">
              В избранное
            </button>
            <button className="rounded-xl border border-stone-200 px-4 py-3 text-sm font-medium">
              Забронировать
            </button>
            <Link
              href={`/try-on/${product.id}`}
              className="rounded-xl border border-stone-200 px-4 py-3 text-center text-sm font-medium"
            >
              Примерить
            </Link>
          </div>
          <aside className="rounded-2xl bg-stone-100 p-4 text-sm text-stone-600">
            AI-рекомендация: эта модель найдена по вашему запросу. Уточните
            размер в диалоге с AI Продавцом.
          </aside>
        </div>
      </article>
    </main>
  );
}
