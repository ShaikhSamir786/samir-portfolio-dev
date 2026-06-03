import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { socials as socialsSchema } from "@/lib/schema";

export async function GET() {
  try {
    const result = await db.select().from(socialsSchema).orderBy(socialsSchema.displayOrder);
    return NextResponse.json(result);
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

    await db.delete(socialsSchema);
      
    if (socials.length > 0) {
      await db.insert(socialsSchema).values(
        socials.map((s, i) => ({
          name: s.name,
          url: s.url,
          displayOrder: i
        }))
      );
    }

    revalidatePath("/");
    revalidatePath("/about");
    revalidatePath("/projects");
    revalidatePath("/blogs");
    revalidatePath("/contact");
    revalidatePath("/resume");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/socials error:", error);
    return NextResponse.json({ error: "Failed to update socials" }, { status: 500 });
  }
}
