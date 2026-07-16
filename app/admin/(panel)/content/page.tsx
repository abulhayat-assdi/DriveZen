import { CONTENT_FIELDS, CONTENT_GROUPS, getContent } from "@/lib/content";
import ContentEditor from "./ContentEditor";

export const dynamic = "force-dynamic";

export default async function ContentPage() {
  const values = await getContent();

  const fieldsByGroup: Record<string, typeof CONTENT_FIELDS> = {};
  for (const g of CONTENT_GROUPS) {
    fieldsByGroup[g] = CONTENT_FIELDS.filter((f) => f.group === g);
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Content Management</h1>
        <p className="text-sm text-muted">
          Edit every heading and button label shown on the landing page — no code needed.
        </p>
      </div>
      <ContentEditor groups={CONTENT_GROUPS} fieldsByGroup={fieldsByGroup} initial={values} />
    </div>
  );
}
