import Image from "next/image";
import Link from "next/link";
import type { ProjectWithDeveloper } from "@/lib/queries";
import { cn, formatAED, formatDate, titleCase } from "@/lib/utils";

type ProjectCardProps = {
  project: ProjectWithDeveloper;
  startingPrice?: number;
  className?: string;
  wide?: boolean;
};

export function ProjectCard({ project, startingPrice, className, wide }: ProjectCardProps) {
  return (
    <Link href={`/projects/${project.slug}`} className={cn("group block", className)}>
      <div className={cn("relative overflow-hidden bg-offwhite", wide ? "aspect-[16/10]" : "aspect-[4/5]")}>
        {project.imageUrl && (
          <Image
            src={project.imageUrl}
            alt={project.name}
            fill
            sizes={wide ? "(min-width: 1024px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"}
            className="object-cover transition-transform duration-[1600ms] ease-[var(--ease-luxury)] group-hover:scale-[1.06]"
          />
        )}
        <span className="label absolute left-4 top-4 bg-white/90 px-3 py-1.5 text-[0.55rem] text-charcoal backdrop-blur">
          {titleCase(project.status)}
        </span>
      </div>
      <div className="pt-6">
        <span className="gold-line mb-4 transition-all duration-500 group-hover:w-16" />
        <p className="label text-[0.6rem] text-warmgray">{project.developer?.name ?? "Developer"}</p>
        <h3 className="mt-2 font-serif text-2xl font-light text-charcoal md:text-3xl">{project.name}</h3>
        <div className="mt-3 flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
          <p className="label text-warmgray">{project.community}</p>
          {startingPrice !== undefined && <p className="label text-charcoal">From {formatAED(startingPrice)}</p>}
        </div>
        <p className="mt-2 text-xs font-light text-warmgray">
          {project.paymentPlan ? `${project.paymentPlan} payment plan` : "Flexible payment plan"} &middot; Handover{" "}
          {formatDate(project.handoverDate, { month: "short", year: "numeric" })}
        </p>
      </div>
    </Link>
  );
}
