import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { blogs as blogsSchema } from "@/lib/schema";
import { eq } from "drizzle-orm";
import BlogForm from "@/components/admin/BlogForm";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBlogPage({ params }: EditPageProps) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const result = await db.select().from(blogsSchema).where(eq(blogsSchema.id, id));

  if (result.length === 0) {
    redirect("/admin");
  }

  const blog = result[0];

  return (
    <main className="flex flex-1">
      <div className="flex-1 p-6 md:p-10">
        <h1 className="text-2xl font-semibold mb-8 tracking-tight">
          Edit Blog
        </h1>
        <BlogForm
          blogId={blog.id}
          initialData={{
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt || "",
            content: blog.content,
            cover_image_url: blog.coverImageUrl || "",
            is_published: blog.isPublished ?? false,
          }}
        />
      </div>
    </main>
  );
}
