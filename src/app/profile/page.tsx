export default function ProfilePage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-semibold">Профиль</h1>
      <p className="mt-2 text-stone-500">
        Заполняйте только то, что помогает подбору. Размеры — ориентир, а не
        гарантия посадки.
      </p>
      <section className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border bg-white p-5">
          <h2 className="font-medium">Мои предпочтения</h2>
          <p className="mt-2 text-sm text-stone-500">
            Цвета, стили, бюджет и размеры можно изменить или удалить в любой
            момент.
          </p>
        </div>
        <div className="rounded-2xl border bg-white p-5">
          <h2 className="font-medium">Приватность</h2>
          <p className="mt-2 text-sm text-stone-500">
            Управление фото, результатами примерки, предпочтениями и историями
            диалогов.
          </p>
        </div>
      </section>
    </main>
  );
}
