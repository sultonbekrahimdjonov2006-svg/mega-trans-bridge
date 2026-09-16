import type { ImageValidationResult, UploadedImage } from "../../types/image";
export type ImageLimits = {
  maxBytes: number;
  maxCount: number;
  maxWidth: number;
  maxHeight: number;
  maxPixels: number;
};
export const defaultImageLimits: ImageLimits = {
  maxBytes: 8 * 1024 * 1024,
  maxCount: 3,
  maxWidth: 6000,
  maxHeight: 6000,
  maxPixels: 24_000_000,
};
export function validateImage(
  image: UploadedImage,
  overrides: Partial<ImageLimits> = {},
): ImageValidationResult {
  const limits = { ...defaultImageLimits, ...overrides };
  if (!image.bytes.length) return { valid: false, code: "IMAGE_EMPTY" };
  if (image.bytes.length > limits.maxBytes)
    return { valid: false, code: "IMAGE_TOO_LARGE" };
  const b = image.bytes;
  const isPng =
    b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47;
  if (isPng) {
    if (b.length < 24) return { valid: false, code: "IMAGE_CORRUPT" };
    const width = new DataView(b.buffer, b.byteOffset, b.byteLength).getUint32(
      16,
    );
    const height = new DataView(b.buffer, b.byteOffset, b.byteLength).getUint32(
      20,
    );
    if (
      !width ||
      !height ||
      width > limits.maxWidth ||
      height > limits.maxHeight ||
      width * height > limits.maxPixels
    )
      return { valid: false, code: "IMAGE_DIMENSIONS_INVALID" };
  }
  const mime =
    b[0] === 0xff &&
    b[1] === 0xd8 &&
    b[b.length - 2] === 0xff &&
    b[b.length - 1] === 0xd9
      ? "image/jpeg"
      : b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47
        ? "image/png"
        : b[0] === 0x52 &&
            b[1] === 0x49 &&
            b[2] === 0x46 &&
            b[3] === 0x46 &&
            b[8] === 0x57 &&
            b[9] === 0x45 &&
            b[10] === 0x42 &&
            b[11] === 0x50
          ? "image/webp"
          : undefined;
  return mime
    ? { valid: true, mime }
    : { valid: false, code: "IMAGE_UNSUPPORTED" };
}
