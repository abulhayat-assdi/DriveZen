import { prisma } from "@/lib/prisma";

export const DEFAULT_SETTINGS = {
  id: "singleton",
  brandName: "Drive Zen",
  tagline: "Premium Car Accessories",
  logoUrl: null as string | null,
  whatsapp: "01608221914",
  phone: "01608221914",
  messengerUrl: null as string | null,
  facebookUrl: null as string | null,
  address: "Dhaka, Bangladesh",
  email: "",
  heroKicker: "Premium Car Accessories",
  heroHeadline: "The comfort your drive deserves.",
  announcement: "" as string | null,
  deliveryInside: 60,
  deliveryOutside: 120,
  primaryColor: "#e0b04f",
  currency: "৳",
  footerText: "",
  fbPixelId: null as string | null,
  fbAccessToken: null as string | null,
};

export type Settings = typeof DEFAULT_SETTINGS;

export async function getSettings(): Promise<Settings> {
  const s = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  if (!s) return DEFAULT_SETTINGS;
  return {
    ...DEFAULT_SETTINGS,
    ...s,
    updatedAt: undefined,
  } as unknown as Settings;
}

export async function getActiveProduct() {
  const product =
    (await prisma.product.findFirst({
      where: { isActive: true },
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        features: { orderBy: { sortOrder: "asc" } },
        highlights: { orderBy: { sortOrder: "asc" } },
      },
      orderBy: { sortOrder: "asc" },
    })) ??
    (await prisma.product.findFirst({
      include: {
        images: { orderBy: { sortOrder: "asc" } },
        features: { orderBy: { sortOrder: "asc" } },
        highlights: { orderBy: { sortOrder: "asc" } },
      },
      orderBy: { createdAt: "desc" },
    }));
  return product;
}

export async function getFaqs() {
  return prisma.faq.findMany({ orderBy: { sortOrder: "asc" } });
}

// Active text testimonials for the "What Aqua Owners Say" carousel.
export async function getTestimonials() {
  return prisma.testimonial.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
}

// Active customer photo reviews for the "Join Hundreds Of Aqua Owners" strip.
export async function getReviewImages() {
  return prisma.reviewImage.findMany({
    where: { isActive: true },
    orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
  });
}

export type ActiveProduct = NonNullable<Awaited<ReturnType<typeof getActiveProduct>>>;
