import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { experiences as experiencesSchema } from "@/lib/schema";
import { auth } from "@/lib/auth";
import { reindexExperiencesForRag } from "@/lib/rag";

export async function GET() {
  try {
    const result = await db.select().from(experiencesSchema).orderBy(experiencesSchema.displayOrder, experiencesSchema.startDate);
    // Transform to match front-end expectations (snake_case)
    const formattedResult = result.map(exp => ({
      id: exp.id,
      company_name: exp.companyName,
      logo_url: exp.logoUrl,
      position: exp.position,
      description: exp.description,
      start_date: exp.startDate,
      end_date: exp.endDate,
      pay: exp.pay,
      is_current: exp.isCurrent,
      display_order: exp.displayOrder,
      created_at: exp.createdAt,
      updated_at: exp.updatedAt,
    }));
    return NextResponse.json(formattedResult);
  } catch (error) {
    console.error("GET /api/experience error:", error);
    return NextResponse.json(
      { error: "Failed to fetch experiences" },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const experiences = await req.json();

    if (!Array.isArray(experiences)) {
      return NextResponse.json({ error: "Expected an array of experiences" }, { status: 400 });
    }

    // Delete all existing experiences
    await db.delete(experiencesSchema);

    // Insert all incoming experiences
    if (experiences.length > 0) {
      await db.insert(experiencesSchema).values(
        experiences.map((exp: any, i: number) => ({
          companyName: exp.company_name,
          logoUrl: exp.logo_url || null,
          position: exp.position,
          description: exp.description || null,
          startDate: exp.start_date || null,
          endDate: exp.end_date || null,
          pay: exp.pay || null,
          isCurrent: exp.is_current || false,
          displayOrder: i,
        }))
      );
    }

    revalidatePath("/about");
    revalidatePath("/admin/experience");
    revalidatePath("/");

    await reindexExperiencesForRag();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/experience error:", error);
    return NextResponse.json(
      { error: "Failed to update experiences" },
      { status: 500 }
    );
  }
}
