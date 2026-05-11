import { Client } from "@neondatabase/serverless";

let client: Client | null = null;
let isConnected = false;

async function getClient() {
  if (!client) {
    client = new Client(process.env.DATABASE_URL!);
  }
  if (!isConnected) {
    await client.connect();
    isConnected = true;
  }
  return client;
}

export async function query(sqlString: string, params?: unknown[]) {
  const client = await getClient();
  const result = await client.query(sqlString, params);
  const rows = Array.isArray(result) ? result[0].rows : result.rows;
  return { rows: rows as Record<string, unknown>[] };
}
