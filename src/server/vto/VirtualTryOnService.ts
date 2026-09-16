import type { CatalogRepository } from "../domain/catalog.ts";
import type { ImageStorage } from "../images/ImageStorage.ts";
import type { VirtualTryOnProvider } from "./VirtualTryOnProvider.ts";
import type { VirtualTryOnJob, VirtualTryOnRequest } from "../../types/vto";
export class VirtualTryOnService {
  private jobs = new Map<string, VirtualTryOnJob>();
  private catalog: CatalogRepository;
  private storage: ImageStorage;
  private provider: VirtualTryOnProvider;
  constructor(
    catalog: CatalogRepository,
    storage: ImageStorage,
    provider: VirtualTryOnProvider,
  ) {
    this.catalog = catalog;
    this.storage = storage;
    this.provider = provider;
  }
  async create(request: VirtualTryOnRequest) {
    if (!request.consent) throw new Error("VTO_CONSENT_REQUIRED");
    if (!(await this.storage.get(request.userImageAssetId)))
      throw new Error("VTO_IMAGE_REQUIRED");
    const product = await this.catalog.getById(request.productId);
    if (!product) throw new Error("PRODUCT_NOT_FOUND");
    const image = product.images[0];
    if (!image) throw new Error("GARMENT_IMAGE_REQUIRED");
    const id = crypto.randomUUID(),
      now = new Date().toISOString();
    const started = await this.provider.create({
      userImageReference: request.userImageAssetId,
      garmentImageReference: image.id,
      garmentCategory:
        request.garmentCategory ?? product.subcategory ?? product.category,
    });
    const job: VirtualTryOnJob = {
      id,
      productId: product.id,
      userImageAssetId: request.userImageAssetId,
      status: started.status,
      providerRequestId: started.providerRequestId,
      createdAt: now,
      updatedAt: now,
      userId: request.userId,
    };
    this.jobs.set(id, job);
    return job;
  }
  async refresh(id: string) {
    const job = this.jobs.get(id);
    if (!job?.providerRequestId) throw new Error("VTO_JOB_NOT_FOUND");
    const state = await this.provider.status(job.providerRequestId);
    job.status = state.status;
    job.updatedAt = new Date().toISOString();
    if (state.status === "COMPLETED" && state.resultBytes) {
      const asset = await this.storage.put(
        { bytes: state.resultBytes },
        "VIRTUAL_TRY_ON_RESULT",
        "image/jpeg",
        86400000,
      );
      job.result = {
        assetId: asset.id,
        expiresAt: asset.expiresAt,
        private: true,
        disclaimer:
          "Визуализация показывает, как вещь может выглядеть, и не гарантирует посадку.",
      };
    }
    return job;
  }
  async delete(id: string, userId?: string) {
    const job = this.jobs.get(id);
    if (userId && job?.userId !== userId) throw new Error("VTO_ACCESS_DENIED");
    if (job?.result) await this.storage.delete(job.result.assetId);
    return this.jobs.delete(id);
  }
}
