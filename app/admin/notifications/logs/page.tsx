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
            <p className="text-sm text-gray-500 mt-1">History of dispatched web pushes</p>
          </div>
          <Link
            href="/admin/notifications"
            className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
          >
            Back
          </Link>
        </div>

        <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm">
          {logs.length === 0 ? (
            <p className="text-sm text-gray-400 p-6">No notifications sent yet.</p>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
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
              <tbody className="divide-y divide-gray-100">
                {logs.map((log: any) => (
                  <tr key={log.id} className="hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <p className="text-gray-900 font-medium truncate max-w-[150px] sm:max-w-[200px]">
                        {log.title}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="text-gray-500 truncate max-w-[150px] sm:max-w-[250px] text-xs">
                        {log.body}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium border ${
                        log.targetTopic === "blogs"
                          ? "bg-gray-50 text-gray-600 border-gray-200"
                          : "bg-gray-900 text-white border-gray-900"
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
                          className="h-12 w-auto max-w-[120px] object-cover rounded-md border border-gray-200" 
                        />
                      ) : (
                        <span className="text-gray-400 text-xs italic">None</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center bg-green-50 text-green-700 border border-green-200 font-semibold px-2 py-1 rounded-md text-xs">
                        {log.successCount}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-right">
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
