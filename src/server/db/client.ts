import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
export function createDatabase(url: string) {
  return drizzle(postgres(url, { prepare: false }));
}
