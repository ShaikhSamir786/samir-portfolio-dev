import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sentNotifications as sentNotificationsSchema } from "@/lib/schema";
import { desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import Link from "next/link";
import { DeleteLogButton } from "@/components/admin/DeleteLogButton";

export default async function NotificationLogsPage() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const logs = await db.select().from(sentNotificationsSchema).orderBy(desc(sentNotificationsSchema.createdAt));

  return (
    <main className="flex flex-1">
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Notification Logs</h1>
            <p className="text-sm text-text-muted mt-1">History of dispatched web pushes</p>
          </div>
          <Link
            href="/admin/notifications"
            className="text-sm font-medium text-text-muted hover:text-foreground transition-colors"
          >
            Back
          </Link>
        </div>

        <div className="border border-border-primary rounded-xl overflow-hidden bg-background shadow-sm">
          {logs.length === 0 ? (
            <p className="text-sm text-text-muted p-6">No notifications sent yet.</p>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-footer-bg border-b border-border-primary text-text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Title</th>
                  <th className="px-4 py-3 font-medium">Description</th>
                  <th className="px-4 py-3 font-medium">Audience</th>
                  <th className="px-4 py-3 font-medium">Image</th>
                  <th className="px-4 py-3 font-medium text-center">Delivered</th>
                  <th className="px-4 py-3 font-medium text-right">Date</th>
                  <th className="px-4 py-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-primary">
                {logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-footer-bg">
                    <td className="px-4 py-3">
                      <p className="text-foreground font-medium truncate max-w-[150px] sm:max-w-[200px]">
                        {log.title}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-text-muted truncate max-w-[150px] sm:max-w-[250px] text-xs">
                        {log.body}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                        log.targetTopic === "blogs"
                          ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-200 dark:border-purple-800"
                          : "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-800"
                      }`}>
                        {log.targetTopic === "blogs" ? "Blogs Only" : "All Updates"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {log.imageUrl ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img 
                          src={log.imageUrl} 
                          alt="Notification" 
                          className="h-12 w-auto max-w-[120px] object-cover rounded-md border border-border-primary" 
                        />
                      ) : (
                        <span className="text-text-muted text-xs italic">None</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 font-semibold px-2 py-1 rounded-md text-xs">
                        {log.successCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-text-muted whitespace-nowrap text-right">
                      {new Date(log.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DeleteLogButton id={log.id} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}
