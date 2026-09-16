const sections = [
  "Dashboard",
  "Products",
  "Inventory",
  "Orders",
  "Reservations",
  "Customers",
  "Analytics",
  "Store Settings",
];
export default function AdminPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <p className="text-xs uppercase tracking-widest text-stone-500">
        Store administration
      </p>
      <h1 className="mt-2 text-3xl font-semibold">Панель магазина</h1>
      <p className="mt-2 text-sm text-amber-700">
        Доступ требует серверной роли магазина. Данные ниже не являются
        demo-аналитикой.
      </p>
      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {sections.map((section) => (
          <section key={section} className="rounded-2xl border bg-white p-5">
            <h2 className="font-medium">{section}</h2>
            <p className="mt-2 text-sm text-stone-500">
              Подключается к store-scoped API.
            </p>
          </section>
        ))}
      </div>
    </main>
  );
}
