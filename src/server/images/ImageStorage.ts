import type {
  ImageAsset,
  ImagePurpose,
  UploadedImage,
} from "../../types/image";
export interface ImageStorage {
  put(
    image: UploadedImage,
    purpose: ImagePurpose,
    mime: ImageAsset["mime"],
    ttlMs: number,
  ): Promise<ImageAsset>;
  sign(
    assetId: string,
    ttlMs: number,
  ): Promise<{ url: string; expiresAt: string }>;
  delete(assetId: string): Promise<boolean>;
  get(assetId: string): Promise<UploadedImage | null>;
}
export class MemoryImageStorage implements ImageStorage {
  private data = new Map<string, { asset: ImageAsset; image: UploadedImage }>();
  async put(
    image: UploadedImage,
    purpose: ImagePurpose,
    mime: ImageAsset["mime"],
    ttlMs: number,
  ) {
    const id = crypto.randomUUID();
    const now = Date.now();
    const asset: ImageAsset = {
      id,
      purpose,
      mime,
      bytes: image.bytes.length,
      createdAt: new Date(now).toISOString(),
      expiresAt: new Date(now + ttlMs).toISOString(),
      private: true,
    };
    this.data.set(id, { asset, image });
    return asset;
  }
  async sign(id: string, ttlMs: number) {
    if (!this.data.has(id)) throw new Error("IMAGE_NOT_FOUND");
    return {
      url: `private-image://${id}?token=${crypto.randomUUID()}`,
      expiresAt: new Date(Date.now() + ttlMs).toISOString(),
    };
  }
  async delete(id: string) {
    return this.data.delete(id);
  }
  async get(id: string) {
    return this.data.get(id)?.image ?? null;
  }
}
