import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { resume } from "@/lib/schema";

export async function GET() {
  try {
    const result = await db.select({ resume: resume.resume }).from(resume).limit(1);
    const resumeData = result[0]?.resume ?? "";
    return NextResponse.json({ resume: resumeData });
  } catch (error) {
    console.error("GET /api/resume error:", error);
    return NextResponse.json({ error: "Failed to fetch resume" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const reqData = await req.json();
    const resumeData = reqData.resume;

    const existing = await db.select({ resume: resume.resume }).from(resume).limit(1);
    if (existing.length > 0) {
      await db.update(resume).set({ resume: resumeData ?? "" });
    } else {
      await db.insert(resume).values({ resume: resumeData ?? "" });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /api/resume error:", error);
    return NextResponse.json({ error: "Failed to update resume" }, { status: 500 });
  }
}
