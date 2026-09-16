import postgres from "postgres";
const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL is required for db:seed");
const sql = postgres(url, { prepare: false });
const palette = [
  ["чёрный", "#1c1917"],
  ["бежевый", "#d5c6b5"],
  ["молочный", "#ebe7e0"],
  ["синий", "#334155"],
] as const;
const catalog = Array.from({ length: 36 }, (_, index) => {
  const number = index + 1;
  const [colorName, hex] = palette[index % palette.length];
  const category = index % 3 === 0 ? "men" : "women";
  const kind =
    index % 4 === 0
      ? "Кроссовки"
      : index % 4 === 1
        ? "Платье"
        : index % 4 === 2
          ? "Тренч"
          : "Топ";
  return {
    number,
    id: `seed-${number}`,
    name: `${kind} Studio ${number}`,
    category,
    colorName,
    hex,
    price: 350000 + index * 25000,
  };
});
await sql.begin(async (transaction) => {
  await transaction`insert into stores (id, slug, name, description) values ('atelier-north', 'atelier-north', 'AI Fashion Atelier', 'Демонстрационный магазин одежды') on conflict (id) do nothing`;
  for (const item of catalog) {
    const color = [{ id: item.colorName, name: item.colorName, hex: item.hex }];
    const sizes = ["S", "M", "L"].map((code, sortOrder) => ({
      code,
      label: code,
      sortOrder,
    }));
    const images = [
      {
        id: `${item.id}-image`,
        alt: item.name,
        url: `https://placehold.co/900x1100/${item.hex.slice(1)}/ffffff?text=AI+Fashion`,
        placeholderColor: item.hex,
      },
    ];
    await transaction`insert into products (id, store_id, name, description, category, brand, price_amount, currency, colors, sizes, images, tags) values (${item.id}, 'atelier-north', ${item.name}, ${`Модель ${item.name} для повседневного гардероба.`}, ${item.category}, 'AI Fashion Atelier', ${item.price}, 'UZS', ${JSON.stringify(color)}::jsonb, ${JSON.stringify(sizes)}::jsonb, ${JSON.stringify(images)}::jsonb, ${JSON.stringify([item.colorName, kindForTag(item.name)])}::jsonb) on conflict (id) do nothing`;
    for (const size of sizes)
      await transaction`insert into product_variants (id, product_id, sku, color, size, price_amount, currency, stock) values (${`${item.id}-${size.code}`}, ${item.id}, ${`AF-${item.number}-${size.code}`}, ${JSON.stringify(color)}::jsonb, ${JSON.stringify(size)}::jsonb, ${item.price}, 'UZS', ${4 + (item.number % 6)}) on conflict (id) do nothing`;
  }
});
await sql.end();
function kindForTag(name: string) {
  return name.split(" ")[0].toLocaleLowerCase("ru-RU");
}
