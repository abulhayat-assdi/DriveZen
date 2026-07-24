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
      heroImage: "/seed/dz-hero-driver.webp",
      isActive: true,
      sortOrder: 0,
      // The four gallery slots, in the order the landing page captions them:
      // Front View · Side View · Open Storage View · Installed In Aqua.
      images: {
        create: [
          { url: "/seed/dz-studio-warm.webp", alt: "Premium armrest, studio front view", sortOrder: 0 },
          { url: "/seed/dz-fit-light-2.webp", alt: "Armrest fitted between the front seats — side view", sortOrder: 1 },
          { url: "/seed/dz-studio-open.webp", alt: "Open storage compartment with charging cable", sortOrder: 2 },
          { url: "/seed/dz-usb-ports.webp", alt: "USB-A and USB-C ports, installed in a Toyota Aqua", sortOrder: 3 },
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
            imageUrl: "/seed/dz-fit-light-2.webp",
            sortOrder: 0,
          },
          {
            title: "Premium leather finish",
            description:
              "Top-grade leather with clean stitching that stays like new through everyday use.",
            imageUrl: "/seed/dz-dark-cabin.webp",
            sortOrder: 1,
          },
          {
            title: "Hassle-free installation",
            description:
              "No drills, no cutting — fit it yourself in minutes. Fully plug-and-play.",
            imageUrl: "/seed/dz-studio-open.webp",
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
        question: "এটা কি সব Toyota Aqua মডেলে ফিট হয়?",
        answer:
          "হ্যাঁ, DriveZen Armrest Toyota Aqua-এর জন্য বিশেষভাবে ডিজাইন করা এবং সব সাধারণ Aqua মডেলে ফিট হয়।",
        sortOrder: 0,
      },
      {
        question: "ডেলিভারিতে কত সময় লাগে?",
        answer: "সাধারণত সারা বাংলাদেশে ২-৪ কর্মদিবসের মধ্যে ডেলিভারি হয়।",
        sortOrder: 1,
      },
      {
        question: "Installation কি কঠিন?",
        answer: "না, কোনো টুল বা ড্রিলিং ছাড়াই কয়েক মিনিটে নিজে ইনস্টল করতে পারবেন।",
        sortOrder: 2,
      },
      {
        question: "Cash On Delivery আছে কি?",
        answer: "হ্যাঁ, পণ্য হাতে পেয়ে টাকা পরিশোধ করতে পারবেন।",
        sortOrder: 3,
      },
      {
        question: "Warranty আছে কি?",
        answer: "হ্যাঁ, প্রোডাক্টে কোয়ালিটি গ্যারান্টি সহ ৭ দিনের ফিটমেন্ট গ্যারান্টি আছে — ঠিকমতো ফিট না হলে আমরা সমাধান করে দেবো।",
        sortOrder: 4,
      },
    ],
  });

  // ---- Testimonials (text reviews carousel) ----
  await prisma.testimonial.deleteMany({});
  await prisma.testimonial.createMany({
    data: [
      { name: "Mahmudul Hasan", text: "Driving comfort has improved so much. Storage space is a huge bonus!", tag: "Toyota Aqua Owner", rating: 5, sortOrder: 0 },
      { name: "Sadia Rahman", text: "Looks premium and fits perfectly. Feels like it came with the car from factory.", tag: "Toyota Aqua Owner", rating: 5, sortOrder: 1 },
      { name: "Rashed Ahmed", text: "Installation was super easy. Quality is excellent. Highly recommended!", tag: "Verified Buyer", rating: 5, sortOrder: 2 },
      { name: "Tanvir Islam", text: "লং ড্রাইভে হাতের আরাম পুরো বদলে গেছে। Highly satisfied!", tag: "Toyota Aqua Owner", rating: 5, sortOrder: 3 },
      { name: "Nusrat Jahan", text: "Storage space-টা দারুণ কাজের। ফোন আর ওয়ালেট এখন এক জায়গায় থাকে।", tag: "Verified Buyer", rating: 5, sortOrder: 4 },
      { name: "Imran Chowdhury", text: "Delivery ছিল দ্রুত, প্যাকেজিং ভালো। Armrest-এর ফিনিশিংটা আসলেই premium।", tag: "Toyota Aqua Owner", rating: 5, sortOrder: 5 },
      { name: "Farhan Rahman", text: "দাম অনুযায়ী quality অসাধারণ। Aqua-র interior-এর সাথে perfectly match করে।", tag: "Verified Buyer", rating: 5, sortOrder: 6 },
      { name: "Sharmin Akter", text: "Installation নিজেই করেছি ৫ মিনিটে। মনে হয় factory fitted।", tag: "Toyota Aqua Owner", rating: 5, sortOrder: 7 },
    ],
  });

  // ---- Image reviews (customer photo strip) ----
  await prisma.reviewImage.deleteMany({});
  await prisma.reviewImage.createMany({
    data: [
      { imageUrl: "/seed/dz-driver-pov.webp", caption: "", sortOrder: 0 },
      { imageUrl: "/seed/dz-hero-driver.webp", caption: "", sortOrder: 1 },
      { imageUrl: "/seed/dz-dark-cabin.webp", caption: "", sortOrder: 2 },
      { imageUrl: "/seed/dz-usb-ports.webp", caption: "", sortOrder: 3 },
      { imageUrl: "/seed/dz-console-cup.webp", caption: "", sortOrder: 4 },
      { imageUrl: "/seed/dz-fit-light-2.webp", caption: "", sortOrder: 5 },
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
