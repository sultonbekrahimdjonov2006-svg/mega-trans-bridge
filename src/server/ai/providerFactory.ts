import type { CatalogRepository } from "../domain/catalog.ts";
import type { AiProvider } from "./contracts.ts";
import { MockAiProvider } from "./MockAiProvider.ts";
import { OpenAiProvider } from "./OpenAiProvider.ts";
export function createAiProvider(catalog: CatalogRepository): AiProvider {
  const enabled = process.env.REAL_AI_ENABLED === "true";
  const key = process.env.OPENAI_API_KEY;
  if (!enabled || !key) return new MockAiProvider(catalog);
  return new OpenAiProvider(
    catalog,
    key,
    process.env.OPENAI_MODEL ?? "gpt-4.1-mini",
    Number(process.env.AI_REQUEST_TIMEOUT_MS ?? 15000),
  );
}
