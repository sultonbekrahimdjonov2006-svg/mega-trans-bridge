export default function FavoritesPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Избранное</h1>
      <div className="mt-8 rounded-2xl border bg-white p-8 text-center">
        <p>Войдите, чтобы сохранять любимые модели.</p>
        <p className="mt-2 text-sm text-stone-500">
          Гостевые действия не выдаются за постоянное сохранение.
        </p>
      </div>
    </main>
  );
}
