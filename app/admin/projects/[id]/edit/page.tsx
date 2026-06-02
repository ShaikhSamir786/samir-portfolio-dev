import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { projects as projectsSchema } from "@/lib/schema";
import { eq } from "drizzle-orm";
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
  const result = await db.select().from(projectsSchema).where(eq(projectsSchema.id, id));

  if (result.length === 0) {
    redirect("/admin/projects");
  }

  const project = result[0];

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
            cover_image_url: project.coverImageUrl || "",
            is_published: project.isPublished ?? false,
            technologies: project.technologies || [],
            github_link: project.githubLink || "",
            demo_link: project.demoLink || "",
          }}
        />
      </div>
    </main>
  );
}
