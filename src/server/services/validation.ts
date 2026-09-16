export type ValidationResult<T> =
  { success: true; data: T } | { success: false; error: string };
export const productId = (value: string | null): ValidationResult<string> =>
  value && /^[a-z0-9-]{3,80}$/.test(value)
    ? { success: true, data: value }
    : { success: false, error: "Некорректный идентификатор товара." };
export function catalogQuery(input: URLSearchParams): ValidationResult<{
  query?: string;
  storeId?: string;
  size?: string;
  color?: string;
  maxPrice?: number;
}> {
  const maxPriceValue = input.get("maxPrice");
  const maxPrice = maxPriceValue ? Number(maxPriceValue) : undefined;
  if (
    maxPrice !== undefined &&
    (!Number.isInteger(maxPrice) || maxPrice < 0 || maxPrice > 100000000)
  )
    return { success: false, error: "Некорректный ценовой фильтр." };
  return {
    success: true,
    data: {
      query: input.get("q")?.slice(0, 200) || undefined,
      storeId: input.get("storeId") || undefined,
      size: input.get("size") || undefined,
      color: input.get("color") || undefined,
      maxPrice,
    },
  };
}
