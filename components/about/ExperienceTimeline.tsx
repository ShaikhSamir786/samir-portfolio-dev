import { db } from "@/lib/db";
import { experiences as experiencesSchema } from "@/lib/schema";

function formatDate(dateStr: string | null) {
  if (!dateStr) return "";
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

export default async function ExperienceTimeline() {
  const experiences = await db.select().from(experiencesSchema).orderBy(experiencesSchema.displayOrder);

  if (!experiences || experiences.length === 0) {
    return null;
  }

  return (
    <div className="mt-20">
      <h2 className="text-2xl font-semibold tracking-tight text-gray-900 mb-8">Work Experience</h2>
      <div className="relative border-l border-gray-200 ml-3 md:ml-4 space-y-12">
        {experiences.map((exp, index) => {
          const startDateStr = formatDate(exp.startDate);
          const endDateStr = exp.isCurrent ? "Present" : formatDate(exp.endDate);
          const dateRange = `${startDateStr} - ${endDateStr}`;

          return (
            <div key={exp.id || index} className="relative pl-8 md:pl-10 group">
              {/* Timeline dot or logo */}
              <div className="absolute -left-[17px] top-1 flex items-center justify-center w-8 h-8 rounded-full border border-gray-200 bg-white shadow-sm ring-4 ring-white transition-transform group-hover:scale-110">
                {exp.logoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={exp.logoUrl}
                    alt={exp.companyName}
                    className="w-5 h-5 rounded-sm object-cover"
                  />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-gray-300 group-hover:bg-gray-900 transition-colors" />
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-2">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">{exp.position}</h3>
                  <div className="text-sm font-medium text-gray-700 mt-0.5">
                    {exp.companyName}
                  </div>
                </div>
                <div className="text-sm text-gray-500 mt-1 md:mt-0 whitespace-nowrap">
                  {dateRange}
                </div>
              </div>

              {exp.description && (
                <div
                  className="prose prose-sm prose-gray max-w-none text-gray-600 mt-4 [&_p]:leading-relaxed [&_ul]:my-2 [&_li]:my-0.5 [&_a]:text-gray-900 [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-gray-600 transition-colors"
                  dangerouslySetInnerHTML={{ __html: exp.description }}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
