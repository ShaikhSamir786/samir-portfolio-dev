import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { media } from "@/lib/schema";
import { desc, eq } from "drizzle-orm";
import { cloudinary } from "@/lib/cloudinary";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const allMedia = await db.select().from(media).orderBy(desc(media.createdAt));
    return NextResponse.json(allMedia);
  } catch (error) {
    console.error("Fetch media error:", error);
    return NextResponse.json({ error: "Failed to fetch media" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const [mediaItem] = await db.select().from(media).where(eq(media.id, id)).limit(1);
    if (!mediaItem) {
      return NextResponse.json({ error: "Media not found" }, { status: 404 });
    }

    // Delete from Cloudinary
    await new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(mediaItem.publicId, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });

    // Delete from DB
    await db.delete(media).where(eq(media.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete media error:", error);
    return NextResponse.json({ error: "Failed to delete media" }, { status: 500 });
  }
}
