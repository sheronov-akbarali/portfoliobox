import { getT } from "@/lib/i18n/server";
import NewProjectForm from "./NewProjectForm";

export default async function NewProjectPage() {
  const { locale, t } = await getT();

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 font-display text-2xl font-bold text-[var(--text)]">
        {t.form.heading}
      </h1>
      <NewProjectForm locale={locale} />
    </div>
  );
}
