import {
  boolean,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
};
export const stores = pgTable("stores", {
  id: text("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  isActive: boolean("is_active").notNull(),
  ...timestamps,
});
export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    email: text("email"),
    phone: text("phone"),
    name: text("name"),
    avatarUrl: text("avatar_url"),
    preferredLanguage: text("preferred_language"),
    sizes: jsonb("sizes").notNull(),
    stylePreferences: jsonb("style_preferences").notNull(),
    favoriteCategories: jsonb("favorite_categories").notNull(),
    favoriteColors: jsonb("favorite_colors").notNull(),
    budgetPreference: integer("budget_preference"),
    ...timestamps,
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => [uniqueIndex("users_email_unique").on(table.email)],
);
export const products = pgTable("products", {
  id: text("id").primaryKey(),
  storeId: text("store_id")
    .notNull()
    .references(() => stores.id),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  subcategory: text("subcategory"),
  brand: text("brand").notNull(),
  priceAmount: integer("price_amount").notNull(),
  currency: text("currency").notNull(),
  colors: jsonb("colors").notNull(),
  sizes: jsonb("sizes").notNull(),
  images: jsonb("images").notNull(),
  tags: jsonb("tags").notNull(),
  ...timestamps,
});
