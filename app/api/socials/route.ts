import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { query } from "@/lib/db";

export async function GET() {
  try {
    const result = await query("SELECT name, url, display_order FROM socials ORDER BY display_order ASC");
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error("GET /api/socials error:", error);
    return NextResponse.json({ error: "Failed to fetch socials" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const socials = await req.json();

    if (!Array.isArray(socials)) {
      return NextResponse.json({ error: "Expected an array of socials" }, { status: 400 });
    }

    // Begin transaction
    await query("BEGIN");
    
    // Clear existing
    await query("DELETE FROM socials");

    // Insert new
    for (let i = 0; i < socials.length; i++) {
      const s = socials[i];
      await query(
        "INSERT INTO socials (name, url, display_order) VALUES ($1, $2, $3)",
        [s.name, s.url, i] // use array index for order
      );
    }

    await query("COMMIT");

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/projects");
    revalidatePath("/blogs");
    revalidatePath("/contact");
    revalidatePath("/resume");

    return NextResponse.json({ success: true });
  } catch (error) {
    await query("ROLLBACK");
    console.error("PUT /api/socials error:", error);
    return NextResponse.json({ error: "Failed to update socials" }, { status: 500 });
  }
}
