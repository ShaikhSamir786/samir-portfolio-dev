import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { query } from "@/lib/db";
import ProjectForm from "@/components/admin/ProjectForm";

interface EditPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditProjectPage({ params }: EditPageProps) {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const { id } = await params;
  const result = await query("SELECT * FROM projects WHERE id = $1", [id]);

  if (result.rows.length === 0) {
    redirect("/admin/projects");
  }

  const project = result.rows[0] as unknown as {
    id: string;
    title: string;
    slug: string;
    excerpt: string | null;
    content: string;
    cover_image_url: string | null;
    is_published: boolean;
    technologies: string[] | null;
    github_link: string | null;
    demo_link: string | null;
  };

  return (
    <main className="flex flex-1">
      <div className="flex-1 p-6 md:p-10">
        <h1 className="text-2xl font-semibold mb-8 tracking-tight">
          Edit Project
        </h1>
        <ProjectForm
          projectId={project.id}
          initialData={{
            title: project.title,
            slug: project.slug,
            excerpt: project.excerpt || "",
            content: project.content,
            cover_image_url: project.cover_image_url || "",
            is_published: project.is_published,
            technologies: project.technologies || [],
            github_link: project.github_link || "",
            demo_link: project.demo_link || "",
          }}
        />
      </div>
    </main>
  );
}
