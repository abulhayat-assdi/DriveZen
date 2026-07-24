import { prisma } from "@/lib/prisma";
import ReviewImagesEditor from "./ReviewImagesEditor";

export const dynamic = "force-dynamic";

export default async function ReviewImagesPage() {
  const rows = await prisma.reviewImage.findMany({
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-bold">Image Reviews</h1>
        <p className="text-sm text-muted">
          Customer photos shown in the “Join Hundreds Of Aqua Owners” strip.
          Uploads are automatically compressed to WebP before saving.
        </p>
      </div>
      <ReviewImagesEditor
        initial={rows.map((r) => ({
          imageUrl: r.imageUrl,
          caption: r.caption,
          isActive: r.isActive,
        }))}
      />
    </div>
  );
}
