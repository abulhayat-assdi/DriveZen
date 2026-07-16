import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // ---- Admin user (email + password login) ----
  // Override via ADMIN_EMAIL / ADMIN_PASSWORD env vars in production —
  // otherwise this falls back to the demo credentials.
  const email = process.env.ADMIN_EMAIL || "admin@drivezen.com";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: { email, passwordHash, name: "Drive Zen Admin" },
  });

  // ---- Site settings ----
  await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {},
    create: {
      id: "singleton",
      brandName: "Drive Zen",
      tagline: "Premium Car Accessories",
      whatsapp: "01608221914",
      phone: "01608221914",
      facebookUrl: "https://www.facebook.com/share/1BpWmkUYLp/",
      messengerUrl: "https://m.me/",
      email: "hello@drivezen.com",
      address: "Dhaka, Bangladesh",
      heroKicker: "Premium Car Accessories",
      heroHeadline: "The comfort your drive deserves.",
      announcement: "Cash on delivery nationwide — order today.",
      deliveryInside: 60,
      deliveryOutside: 120,
      primaryColor: "#e0b04f",
      currency: "৳",
      footerText:
        "Drive Zen — premium customised accessories for your car. Guaranteed quality and a precise, factory-like fit.",
    },
  });

  // ---- Featured product: Toyota Aqua Premium Armrest ----
  await prisma.product.deleteMany({ where: { name: "Premium Customised Armrest" } });

  await prisma.product.create({
    data: {
      name: "Premium Customised Armrest",
      tagline:
        "Perfect-fitting, plug-and-play comfort for the driver and passenger of your Toyota Aqua.",
      badge: "Best Seller",
      price: 2490,
      oldPrice: 3200,
      priceNote: "Home delivery across Bangladesh",
      shortDesc:
        "Plug-and-play installation with no drilling or cutting — comfortable, stylish and premium.",
      description:
        "Does your Toyota Aqua only have a driver-side armrest, leaving your passenger without support? Not anymore. Our custom-fit premium armrest is designed exclusively for the Aqua — it blends seamlessly with your interior and adds comfort and style on every journey, from daily commutes to long drives.",
      heroImage: "/seed/armrest-hero.jpg",
      isActive: true,
      sortOrder: 0,
      images: {
        create: [
          { url: "/seed/armrest-1.jpg", alt: "Premium armrest installed view", sortOrder: 0 },
          { url: "/seed/armrest-2.jpg", alt: "Leather finish close-up", sortOrder: 1 },
          { url: "/seed/armrest-3.jpg", alt: "Cup holder detail", sortOrder: 2 },
        ],
      },
      features: {
        create: [
          { text: "Comfortable support for both driver and passenger", sortOrder: 0 },
          { text: "Blends seamlessly with your car's interior", sortOrder: 1 },
          { text: "No drilling or cutting required", sortOrder: 2 },
          { text: "Plug-and-play installation", sortOrder: 3 },
          { text: "Comfortable, premium finish", sortOrder: 4 },
          { text: "Built-in cup holder and storage", sortOrder: 5 },
        ],
      },
      highlights: {
        create: [
          {
            title: "Perfect fitment",
            description:
              "Custom-designed for the Toyota Aqua — a precise fit against the centre console with zero movement.",
            imageUrl: "/seed/highlight-1.jpg",
            sortOrder: 0,
          },
          {
            title: "Premium leather finish",
            description:
              "Top-grade leather with clean stitching that stays like new through everyday use.",
            imageUrl: "/seed/highlight-2.jpg",
            sortOrder: 1,
          },
          {
            title: "Hassle-free installation",
            description:
              "No drills, no cutting — fit it yourself in minutes. Fully plug-and-play.",
            imageUrl: "/seed/highlight-3.jpg",
            sortOrder: 2,
          },
        ],
      },
    },
  });

  // ---- FAQs ----
  await prisma.faq.deleteMany({});
  await prisma.faq.createMany({
    data: [
      {
        question: "Will this fit my car?",
        answer:
          "This armrest is customised for the Toyota Aqua. For other models, message us on WhatsApp and we'll confirm fitment for you.",
        sortOrder: 0,
      },
      {
        question: "Do I need to drill to install it?",
        answer:
          "No. It's completely plug-and-play — no drilling or cutting required. You can fit it yourself in minutes.",
        sortOrder: 1,
      },
      {
        question: "How long does delivery take?",
        answer: "Usually 1–2 days inside Dhaka and 2–4 days outside Dhaka.",
        sortOrder: 2,
      },
      {
        question: "How do I pay?",
        answer:
          "Cash on delivery is available — inspect the product when it arrives, then pay.",
        sortOrder: 3,
      },
      {
        question: "Is there any warranty or return?",
        answer:
          "Replacement/return is available for manufacturing defects. Call or WhatsApp us for details.",
        sortOrder: 4,
      },
    ],
  });

  console.log(`✅ Seed complete. Login → email: ${email}  password: ${password}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
