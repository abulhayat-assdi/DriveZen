import { prisma } from "@/lib/prisma";
import FaqEditor from "./FaqEditor";

export const dynamic = "force-dynamic";

export default async function FaqsPage() {
  const faqs = await prisma.faq.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">FAQs</h1>
        <p className="text-sm text-muted">Manage the questions shown on your landing page</p>
      </div>
      <FaqEditor initial={faqs.map((f) => ({ question: f.question, answer: f.answer }))} />
    </div>
  );
}
