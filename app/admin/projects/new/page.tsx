import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import ProjectForm from "@/components/admin/ProjectForm";

export default async function NewProjectPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="flex flex-1">
      <div className="flex-1 p-6 md:p-10 overflow-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold tracking-tight">New Project</h1>
        </div>
        <ProjectForm />
      </div>
    </main>
  );
}
