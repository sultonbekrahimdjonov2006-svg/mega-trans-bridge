import Link from "next/link";
import { catalogRepository } from "@/server/bootstrap";
export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const q = await searchParams;
  let products = await catalogRepository.list({
    query: q.q,
    minPrice: q.min ? Number(q.min) : undefined,
    maxPrice: q.max ? Number(q.max) : undefined,
    size: q.size,
    color: q.color,
    storeId: q.store,
  });
  products = [...products].sort((a, b) =>
    q.sort === "price-desc"
      ? b.price.amount - a.price.amount
      : q.sort === "price-asc"
        ? a.price.amount - b.price.amount
        : 0,
  );
  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-3xl font-semibold">Каталог</h1>
      <form className="mt-5 grid gap-2 rounded-2xl border bg-white p-4 sm:grid-cols-4">
        <input
          name="q"
          placeholder="Что вы ищете?"
          className="rounded-xl border p-3"
        />
        <input
          name="size"
          placeholder="Размер"
          className="rounded-xl border p-3"
        />
        <input
          name="max"
          inputMode="numeric"
          placeholder="Цена до"
          className="rounded-xl border p-3"
        />
        <select name="sort" className="rounded-xl border p-3">
          <option value="">По релевантности</option>
          <option value="price-asc">Сначала дешевле</option>
          <option value="price-desc">Сначала дороже</option>
        </select>
        <button className="rounded-xl bg-stone-900 p-3 text-white">
          Найти
        </button>
      </form>
      {products.length ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          {products.map((p) => (
            <article key={p.id} className="rounded-2xl border bg-white p-4">
              <div
                className="aspect-square rounded-xl"
                style={{ background: p.images[0]?.placeholderColor }}
              />
              <h2 className="mt-3 font-medium">{p.name}</h2>
              <p>{new Intl.NumberFormat("ru-RU").format(p.price.amount)} сум</p>
              <Link
                href={`/products/${p.id}`}
                className="mt-3 inline-block text-sm underline"
              >
                Подробнее
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <p className="mt-10 text-stone-500">
          По вашему запросу ничего не найдено. Попробуйте изменить фильтры.
        </p>
      )}
    </main>
  );
}
