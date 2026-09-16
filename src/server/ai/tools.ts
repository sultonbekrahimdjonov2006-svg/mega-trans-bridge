const objectTool = (
  name: string,
  description: string,
  properties: Record<string, unknown>,
  required: string[] = [],
) => ({
  type: "function",
  name,
  description,
  parameters: {
    type: "object",
    properties,
    required,
    additionalProperties: false,
  },
});
const string = { type: "string" };
const number = { type: "number", minimum: 0 };
const strings = { type: "array", items: string };
export const openAiCatalogTools = [
  objectTool("search_products", "Search confirmed catalog products.", {
    query: string,
    category: string,
    color: string,
    size: string,
    minPrice: number,
    maxPrice: number,
    storeId: string,
    tags: strings,
  }),
  objectTool(
    "get_product",
    "Get one confirmed product and variants.",
    { productId: string },
    ["productId"],
  ),
  objectTool(
    "check_stock",
    "Check a confirmed variant's availability.",
    { variantId: string },
    ["variantId"],
  ),
  objectTool(
    "find_similar_products",
    "Find confirmed alternatives.",
    { productId: string, maxPrice: number, color: string, size: string },
    ["productId"],
  ),
  objectTool(
    "recommend_outfit",
    "Validate products and calculate an outfit total.",
    {
      productIds: strings,
      occasion: string,
      style: string,
      budget: number,
      size: string,
      color: string,
    },
    ["productIds"],
  ),
];
export const catalogToolNames = new Set(
  openAiCatalogTools.map((tool) => tool.name),
);
