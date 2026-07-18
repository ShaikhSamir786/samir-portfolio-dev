import Image from "next/image";
import { db } from "@/lib/db";
import { experiences as experiencesSchema } from "@/lib/schema";
import HtmlParser from "@/components/HtmlParser";

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
      <h2 className="text-2xl font-semibold tracking-tight text-foreground mb-8">Work Experience</h2>
      <div className="relative border-l border-border-primary ml-3 md:ml-4 space-y-12">
        {experiences.map((exp, index) => {
          const startDateStr = formatDate(exp.startDate);
          const endDateStr = exp.isCurrent ? "Present" : formatDate(exp.endDate);
          const dateRange = `${startDateStr} - ${endDateStr}`;

          return (
            <div key={exp.id || index} className="relative pl-8 md:pl-10 group">
              {/* Timeline dot or logo */}
              <div className="absolute -left-[17px] top-1 flex items-center justify-center w-8 h-8 rounded-full border border-border-primary bg-background shadow-sm ring-4 ring-background transition-transform group-hover:scale-110">
                {exp.logoUrl ? (
                  <Image
                    src={exp.logoUrl}
                    alt={`${exp.companyName} logo`}
                    width={20}
                    height={20}
                    className="w-5 h-5 rounded-sm object-cover"
                  />
                ) : (
                  <div className="w-2.5 h-2.5 rounded-full bg-border-primary group-hover:bg-foreground transition-colors" />
                )}
              </div>

              {/* Content */}
              <div className="flex flex-col md:flex-row md:items-baseline md:justify-between mb-2">
                <div>
                  <h3 className="text-lg font-medium text-foreground">{exp.position}</h3>
                  <div className="text-sm font-medium text-text-secondary mt-0.5">
                    {exp.companyName}
                  </div>
                </div>
                <div className="text-sm text-text-muted mt-1 md:mt-0 whitespace-nowrap">
                  {dateRange}
                </div>
              </div>

              {exp.description && (
                <HtmlParser
                  html={exp.description}
                  className="prose prose-sm prose-gray dark:prose-invert max-w-none text-text-muted mt-4 [&_p]:leading-relaxed [&_ul]:my-2 [&_li]:my-0.5 [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-2 hover:[&_a]:text-text-secondary transition-colors"
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
