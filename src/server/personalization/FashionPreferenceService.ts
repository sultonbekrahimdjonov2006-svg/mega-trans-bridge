import type { CatalogProduct } from "../../types/catalog";
import type {
  FashionPreferenceProfile,
  PreferenceConsent,
} from "../../types/preferences";
export class FashionPreferenceService {
  private profiles = new Map<string, FashionPreferenceProfile>();
  save(
    profile: Omit<FashionPreferenceProfile, "updatedAt">,
    consent: PreferenceConsent,
  ) {
    if (!consent.explicit) throw new Error("PREFERENCE_CONSENT_REQUIRED");
    const saved = { ...profile, updatedAt: new Date().toISOString() };
    this.profiles.set(profile.userId, saved);
    return saved;
  }
  get(userId: string) {
    return this.profiles.get(userId) ?? null;
  }
  delete(userId: string) {
    return this.profiles.delete(userId);
  }
  rank(products: CatalogProduct[], profile: FashionPreferenceProfile | null) {
    if (!profile) return products;
    return products
      .map((product, index) => ({
        product,
        index,
        score:
          (product.colors.some((c) => profile.preferredColors.includes(c.name))
            ? 2
            : 0) +
          (product.tags.some((t) => profile.styleTags.includes(t)) ? 1 : 0) +
          (product.variants.some(
            (v) =>
              profile.sizes.some((s) => s.value === v.size.code) && v.stock > 0,
          )
            ? 2
            : 0),
      }))
      .sort((a, b) => b.score - a.score || a.index - b.index)
      .map((x) => x.product);
  }
}
