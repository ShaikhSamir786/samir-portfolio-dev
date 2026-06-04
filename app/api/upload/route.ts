import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { cloudinary } from "@/lib/cloudinary";
import sharp from "sharp";
import { db } from "@/lib/db";
import { media } from "@/lib/schema";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    let buffer = Buffer.from(bytes) as any;

    // Optimize images before upload to save Cloudinary space & keep OG tags light
    if (file.type.startsWith("image/") && !file.type.includes("svg") && !file.type.includes("gif")) {
      const image = sharp(buffer);
      const metadata = await image.metadata();

      // Resize large images
      let sharpInstance = image.resize(1200, 1200, {
        fit: "inside",
        withoutEnlargement: true
      });

      // Compress format
      if (metadata.hasAlpha) {
        sharpInstance = sharpInstance.webp({ quality: 80 });
      } else {
        sharpInstance = sharpInstance.jpeg({ quality: 80, progressive: true });
      }

      buffer = await sharpInstance.toBuffer();
    }

    const result = await new Promise<{ secure_url: string; public_id: string }>(
      (resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "portfolio/blogs", resource_type: "auto" },
          (error, result) => {
            if (error || !result) reject(error || new Error("Upload failed"));
            else resolve(result as { secure_url: string; public_id: string });
          }
        ).end(buffer);
      }
    );

    // Save to media library
    await db.insert(media).values({
      url: result.secure_url,
      publicId: result.public_id,
    });

    return NextResponse.json({ url: result.secure_url, publicId: result.public_id });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
