import { neon, NeonQueryFunction } from "@neondatabase/serverless";

const sql: NeonQueryFunction<false, false> = neon(process.env.DATABASE_URL!);

export async function query(
  sqlString: string,
  params?: unknown[]
): Promise<{ rows: Record<string, unknown>[] }> {
  const rows = await sql.query(sqlString, params ?? []);
  return { rows: rows as Record<string, unknown>[] };
}
