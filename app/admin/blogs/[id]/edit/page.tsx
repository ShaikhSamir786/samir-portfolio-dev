import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";
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
  const result = await query("SELECT * FROM blogs WHERE id = $1", [id]);

  if (result.rows.length === 0) {
    redirect("/admin");
  }

  const blog = result.rows[0] as unknown as {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    cover_image_url: string | null;
    is_published: boolean;
  };

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
            cover_image_url: blog.cover_image_url || "",
            is_published: blog.is_published,
          }}
        />
      </div>
    </main>
  );
}
