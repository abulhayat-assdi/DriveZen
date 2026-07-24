/**
 * Points every landing-page image slot at the photo set committed under
 * `public/seed/`.
 *
 * Unlike `seed.ts` this does NOT recreate the product or wipe FAQs — it only
 * rewrites image URLs, so it is safe to run against a live database with real
 * orders in it. Running it twice changes nothing.
 *
 *   npx tsx prisma/set-images.ts
 *
 * Use it after a deploy when the database still points at `/uploads/...` files
 * that no longer exist on disk.
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Every one of the ten source photos is used exactly once in a "hero" slot
// below, so no two prominent frames on the page show the same shot.
const HERO = "/seed/dz-hero-driver.webp";

// The four gallery slots, in the order the landing page captions them:
// Front View · Side View · Open Storage View · Installed In Aqua.
// All four are portrait/square so they survive the 4:5 gallery crop.
const GALLERY: { url: string; alt: string }[] = [
  { url: "/seed/dz-studio-warm.webp", alt: "Premium armrest, studio front view" },
  { url: "/seed/dz-fit-light-2.webp", alt: "Armrest fitted between the front seats — side view" },
  { url: "/seed/dz-studio-open.webp", alt: "Open storage compartment with charging cable" },
  { url: "/seed/dz-usb-ports.webp", alt: "USB-A and USB-C ports, installed in a Toyota Aqua" },
];

// Section photos stored in SiteContent — keep in sync with the "Section Images"
// group in lib/content.ts.
const SECTION_IMAGES: Record<string, string> = {
  fit_image: "/seed/dz-fit-light.webp",
  // The slider wipes vertically, so the AFTER shot has to carry the armrest in
  // its right half — dz-console-cup does, the tighter dark-cabin shot does not.
  before_image: "/seed/dz-before-console.webp",
  after_image: "/seed/dz-console-cup.webp",
  install_video_thumb: "/seed/dz-driver-pov.webp",
  included_image: "/seed/dz-dark-cabin.webp",
  // Customer strip — in-car shots only, so they read as owner photos.
  customer_photo_1: "/seed/dz-driver-pov.webp",
  customer_photo_2: "/seed/dz-hero-driver.webp",
  customer_photo_3: "/seed/dz-dark-cabin.webp",
  customer_photo_4: "/seed/dz-usb-ports.webp",
  customer_photo_5: "/seed/dz-console-cup.webp",
  customer_photo_6: "/seed/dz-fit-light-2.webp",
};

async function main() {
  const product =
    (await prisma.product.findFirst({ where: { isActive: true }, orderBy: { sortOrder: "asc" } })) ??
    (await prisma.product.findFirst({ orderBy: { createdAt: "desc" } }));

  if (!product) {
    console.error("✖ No product found. Run `npm run seed` first.");
    process.exitCode = 1;
    return;
  }

  await prisma.product.update({
    where: { id: product.id },
    data: { heroImage: HERO },
  });
  console.log(`hero image      → ${HERO}`);

  // Replace the gallery wholesale so the four slots line up with the captions
  // regardless of what was there before.
  await prisma.productImage.deleteMany({ where: { productId: product.id } });
  await prisma.productImage.createMany({
    data: GALLERY.map((img, i) => ({ ...img, productId: product.id, sortOrder: i })),
  });
  GALLERY.forEach((img, i) => console.log(`gallery ${i + 1}       → ${img.url}`));

  for (const [key, value] of Object.entries(SECTION_IMAGES)) {
    await prisma.siteContent.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
    console.log(`${key.padEnd(16)}→ ${value}`);
  }

  console.log(`\n✅ Image slots set on product "${product.name}".`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
