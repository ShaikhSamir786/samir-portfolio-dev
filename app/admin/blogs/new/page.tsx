import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import BlogForm from "@/components/admin/BlogForm";

export default async function NewBlogPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="flex flex-1">
      <div className="flex-1 p-6 md:p-10">
        <h1 className="text-2xl font-semibold mb-8 tracking-tight">
          New Blog
        </h1>
        <BlogForm />
      </div>
    </main>
  );
}
