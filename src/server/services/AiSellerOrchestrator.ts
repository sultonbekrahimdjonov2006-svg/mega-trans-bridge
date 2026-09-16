import type { AiConversation, AiInput, AiResponse } from "../../types/ai";
import type { AiProvider } from "../ai/contracts.ts";
import { parseCatalogIntent } from "./intent.ts";

export class AiSellerOrchestrator {
  private readonly provider: AiProvider;

  constructor(provider: AiProvider) {
    this.provider = provider;
  }
  async respond(
    input: AiInput,
    conversation: AiConversation,
  ): Promise<AiResponse> {
    const filters =
      input.type === "text" || input.type === "voice"
        ? parseCatalogIntent(
            input.type === "text" ? input.text : input.transcription,
          )
        : {};
    return this.provider.respond(input, conversation, filters);
  }
}
