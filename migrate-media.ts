import { neon } from "@neondatabase/serverless";

async function main() {
  const sql = neon(process.env.DATABASE_URL!);
  
  await sql`
    CREATE TABLE IF NOT EXISTS "media" (
      "id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      "url" text NOT NULL,
      "public_id" text NOT NULL,
      "created_at" timestamp with time zone DEFAULT now()
    );
  `;
  
  console.log("Media table created");
}

main().catch(console.error);
