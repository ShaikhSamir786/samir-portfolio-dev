import { neon, NeonQueryFunction } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql: NeonQueryFunction<false, false> = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql);


