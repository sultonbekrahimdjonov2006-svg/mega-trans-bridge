import test from "node:test";
import assert from "node:assert/strict";
import { FashionPreferenceService } from "./FashionPreferenceService.ts";
import { mockCatalog } from "../repositories/MockCatalogRepository.ts";
const profile = {
  userId: "u1",
  preferredCategories: [],
  preferredColors: ["чёрный"],
  dislikedColors: [],
  sizes: [
    { category: "tops" as const, value: "M", guidanceOnly: true as const },
  ],
  styleTags: [],
};
test("preferences require explicit consent and can be deleted", () => {
  const s = new FashionPreferenceService();
  assert.throws(
    () => s.save(profile, { explicit: false, source: "PROFILE" }),
    /CONSENT/,
  );
  s.save(profile, { explicit: true, source: "PROFILE" });
  assert.equal(s.get("u1")?.sizes[0].guidanceOnly, true);
  assert.equal(s.delete("u1"), true);
});
test("preferences rank but do not hide catalog", () => {
  const s = new FashionPreferenceService();
  const saved = s.save(profile, {
    explicit: true,
    source: "CONVERSATION_CONFIRMATION",
  });
  const ranked = s.rank(mockCatalog, saved);
  assert.equal(ranked.length, mockCatalog.length);
  assert.equal(ranked[0].id, "midnight-dress");
});
