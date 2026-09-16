import { catalogRepository } from "../bootstrap.ts";
import { imageStorage } from "../images/bootstrap.ts";
import { MockVirtualTryOnProvider } from "./VirtualTryOnProvider.ts";
import { VirtualTryOnService } from "./VirtualTryOnService.ts";
export const virtualTryOnService = new VirtualTryOnService(
  catalogRepository,
  imageStorage,
  new MockVirtualTryOnProvider(),
);
