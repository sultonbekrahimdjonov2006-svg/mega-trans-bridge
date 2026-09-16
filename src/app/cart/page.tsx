export default function CartPage() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="text-3xl font-semibold">Корзина</h1>
      <div className="mt-8 rounded-2xl border bg-white p-8 text-center">
        <p>Корзина пока пуста.</p>
        <p className="mt-2 text-sm text-stone-500">
          Цена и остатки будут повторно проверены сервером перед оформлением.
        </p>
      </div>
    </main>
  );
}
