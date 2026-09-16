import type { CatalogSearchFilters } from "../../types/catalog";

export function parseCatalogIntent(text: string): CatalogSearchFilters {
  const normalized = text.toLocaleLowerCase("ru-RU");
  const priceMatch = normalized.match(
    /(?:до|не дороже)\s*([\d\s]+)\s*(?:сум|uzs)/u,
  );
  const maxPrice = priceMatch
    ? Number(priceMatch[1].replace(/\s/g, ""))
    : undefined;
  const sizeMatch = normalized.match(/(?:размер\s*)?(xs|s|m|l|xl)\b/iu);
  const color = normalized.includes("чёрн")
    ? "чёрный"
    : normalized.includes("беж")
      ? "бежевый"
      : undefined;
  const category =
    normalized.includes("мужск") || normalized.includes("кроссов")
      ? "men"
      : normalized.includes("плать") || normalized.includes("женск")
        ? "women"
        : undefined;
  const tags = [
    normalized.includes("кроссов") ? "кроссовки" : undefined,
    normalized.includes("плать") ? "платье" : undefined,
    normalized.includes("осен") ? "осень" : undefined,
  ].filter((tag): tag is string => Boolean(tag));
  return {
    maxPrice,
    size: sizeMatch?.[1]?.toUpperCase(),
    color,
    category,
    tags: tags.length ? tags : undefined,
  };
}
