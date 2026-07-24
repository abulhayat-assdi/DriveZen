import { prisma } from "@/lib/prisma";
import TestimonialsEditor from "./TestimonialsEditor";

export const dynamic = "force-dynamic";

export default async function TestimonialsPage() {
  const rows = await prisma.testimonial.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Testimonials</h1>
        <p className="text-sm text-muted">
          Text reviews shown in the “What Aqua Owners Say” carousel on your
          landing page. Inactive ones are hidden from the site.
        </p>
      </div>
      <TestimonialsEditor
        initial={rows.map((r) => ({
          name: r.name,
          text: r.text,
          tag: r.tag,
          rating: r.rating,
          isActive: r.isActive,
        }))}
      />
    </div>
  );
}
