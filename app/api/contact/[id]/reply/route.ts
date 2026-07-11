import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { contact as contactSchema } from "@/lib/schema";
import { eq } from "drizzle-orm";
import nodemailer from "nodemailer";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  try {
    const { replyText } = await req.json();

    if (!replyText) {
      return NextResponse.json({ error: "Reply text is required" }, { status: 400 });
    }

    // Get the user's email
    const result = await db.select({ name: contactSchema.name, email: contactSchema.email, subject: contactSchema.subject }).from(contactSchema).where(eq(contactSchema.id, id));
    if (result.length === 0) {
      return NextResponse.json({ error: "Contact not found" }, { status: 404 });
    }

    const { name, email, subject } = result[0];

    if (!email) {
      return NextResponse.json({ error: "Contact has no email address" }, { status: 400 });
    }

    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
      console.warn("SMTP credentials missing. Would have sent:", replyText, "to", email);
      return NextResponse.json({ error: "SMTP credentials not configured" }, { status: 500 });
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: Number(process.env.SMTP_PORT) || 465,
      secure: true,
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: `"${process.env.NEXT_PUBLIC_SITE_NAME || "Samir Shaikh"}" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: `Re: ${subject || "Your Message"}`,
      text: replyText,
      html: `<p>Hi ${name || "there"},</p><p>${replyText.replace(/\n/g, "<br>")}</p>`,
    });

    // Optionally mark as seen if we replied
    await db.update(contactSchema).set({ seen: true }).where(eq(contactSchema.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(`POST /api/contact/${id}/reply error:`, error);
    return NextResponse.json({ error: "Failed to send reply" }, { status: 500 });
  }
}
