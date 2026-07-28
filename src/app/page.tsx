import Link from "next/link";
import { listProjects } from "@/lib/queries";
import ProjectCard from "@/components/ProjectCard";

export default async function Home() {
  const projects = await listProjects();

  return (
    <div className="flex flex-col gap-8">
      <section className="text-center py-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900">
          Dasturchilar loyihalari uchun platforma
        </h1>
        <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
          Oʻz loyihangizni joylang, boshqa dasturchilarning ishlarini koʻring,
          baholang va fikringizni yozing.
        </p>
        <Link
          href="/projects/new"
          className="mt-6 inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition"
        >
          Loyihangizni joylang
        </Link>
      </section>

      {projects.length === 0 ? (
        <p className="text-center text-slate-500 py-12">
          Hozircha loyihalar yoʻq. Birinchi boʻlib joylang!
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}
