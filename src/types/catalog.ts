export type Product = {
  id: string;
  name: string;
  price: string;
  sizes: string[];
  availability: "В наличии" | "Мало осталось";
  color: string;
};
