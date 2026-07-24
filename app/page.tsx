import Link from "next/link";
import Image from "next/image";
import {
  getActiveProduct,
  getFaqs,
  getReviewImages,
  getSettings,
  getTestimonials,
} from "@/lib/data";
import { getContent } from "@/lib/content";
import { formatTaka, toWhatsAppNumber } from "@/lib/utils";
import SmoothScroll from "@/components/site/SmoothScroll";
import FacebookPixel from "@/components/site/FacebookPixel";
import Navbar from "@/components/site/Navbar";
import FloatingCTA from "@/components/site/FloatingCTA";
import Hero from "@/components/site/Hero";
import OrderForm from "@/components/site/OrderForm";
import Faq from "@/components/site/Faq";
import BeforeAfter from "@/components/site/BeforeAfter";
import ReviewsCarousel from "@/components/site/ReviewsCarousel";
import VideoLightbox from "@/components/site/VideoLightbox";
import ImageZoom from "@/components/site/ImageZoom";
import Gallery from "@/components/site/Gallery";
import Reveal from "@/components/site/Reveal";
import {
  Star,
  Whatsapp,
  Phone,
  Facebook,
  Mail,
  ArrowRight,
  Check,
  Car,
  Package,
  Wallet,
  Truck,
  Shield,
  Wrench,
  Zap,
  ThumbsUp,
  Alert,
  ArmSupportPerson,
  OpenBox,
  SparkleDuo,
  TiredPerson,
} from "@/components/icons";

export const dynamic = "force-dynamic";

const STATS = [
  { icon: Car, value: "500+", label: "Aqua Owners Served" },
  { icon: Package, value: "1000+", label: "Orders Delivered" },
  { icon: Star, value: "4.9/5", label: "Customer Satisfaction" },
];

const PROBLEMS = [
  {
    icon: ArmSupportPerson,
    title: "হাত রাখার আরামদায়ক জায়গা নেই",
    text: "লং ড্রাইভে হাত ঝুলিয়ে রাখতে রাখতে কাঁধ ও ঘাড়ে অস্বস্তি শুরু হয়।",
  },
  {
    icon: OpenBox,
    title: "জিনিসপত্র রাখার জায়গা নেই",
    text: "ফোন, মানিব্যাগ, চাবি—সব ছড়িয়ে থাকে সিটে, ড্যাশবোর্ডে বা কাপ হোল্ডারে।",
  },
  {
    icon: SparkleDuo,
    title: "Interior-টা কেমন যেন অসম্পূর্ণ লাগে",
    text: "গাড়িটা ভালো, কিন্তু ভেতরে বসলে মনে হয় কিছু একটা এখনও Missing।",
  },
  {
    icon: TiredPerson,
    title: "প্রতিদিনের ছোট Discomfort",
    text: "একদিন সমস্যা না। কিন্তু প্রতিদিন একই অসুবিধা ধীরে ধীরে বিরক্তিতে পরিণত হয়।",
  },
];

const SOLUTION_CHECKLIST = [
  "Comfortable Arm Support",
  "Hidden Storage Space",
  "Factory-Like Premium Look",
  "কয়েক মিনিটেই Installation",
  "মজবুত ও টেকসই নির্মাণ",
];

const FIT_CHECKLIST = [
  "Factory-Like Appearance",
  "Dashboard-এ কোনো কাটাছেঁড়া লাগবে না",
  "কোনো Drilling লাগবে না",
  "শক্তভাবে বসে থাকবে",
  "Interior-এর সাথে মানানসই Design",
];

// Fallback reviews — shown only until testimonials are added in
// Admin → Testimonials. Once any exist in the database, these are ignored.
const FALLBACK_REVIEWS = [
  {
    name: "Mahmudul Hasan",
    text: "Driving comfort has improved so much. Storage space is a huge bonus!",
    tag: "Toyota Aqua Owner",
  },
  {
    name: "Sadia Rahman",
    text: "Looks premium and fits perfectly. Feels like it came with the car from factory.",
    tag: "Toyota Aqua Owner",
  },
  {
    name: "Rashed Ahmed",
    text: "Installation was super easy. Quality is excellent. Highly recommended!",
    tag: "Verified Buyer",
  },
  {
    name: "Tanvir Islam",
    text: "লং ড্রাইভে হাতের আরাম পুরো বদলে গেছে। Highly satisfied!",
    tag: "Toyota Aqua Owner",
  },
  {
    name: "Nusrat Jahan",
    text: "Storage space-টা দারুণ কাজের। ফোন আর ওয়ালেট এখন এক জায়গায় থাকে।",
    tag: "Verified Buyer",
  },
  {
    name: "Imran Chowdhury",
    text: "Delivery ছিল দ্রুত, প্যাকেজিং ভালো। Armrest-এর ফিনিশিংটা আসলেই premium।",
    tag: "Toyota Aqua Owner",
  },
  {
    name: "Farhan Rahman",
    text: "দাম অনুযায়ী quality অসাধারণ। Aqua-র interior-এর সাথে perfectly match করে।",
    tag: "Verified Buyer",
  },
  {
    name: "Sharmin Akter",
    text: "Installation নিজেই করেছি ৫ মিনিটে। মনে হয় factory fitted।",
    tag: "Toyota Aqua Owner",
  },
];

const WHY_CHOOSE = [
  { icon: Wrench, title: "Perfect Aqua Fit", text: "Toyota Aqua-এর জন্য বিশেষভাবে তৈরি।" },
  { icon: Shield, title: "Quality Tested", text: "মজবুত ও টেকসই।" },
  { icon: Wallet, title: "Cash On Delivery", text: "পণ্য হাতে পেয়ে টাকা দিন।" },
  { icon: Truck, title: "Fast Nationwide Delivery", text: "সারা বাংলাদেশে ডেলিভারি।" },
];

const INCLUDED = [
  "Premium Aqua Armrest",
  "Hidden Storage Compartment",
  "Installation Guide",
  "Delivery Support",
  "Cash On Delivery",
];

// Placeholder FAQ from the redesign doc — shown only if no FAQs exist in admin.
const FALLBACK_FAQS = [
  {
    id: "f1",
    question: "এটা কি সব Toyota Aqua মডেলে ফিট হয়?",
    answer: "হ্যাঁ, DriveZen Armrest Toyota Aqua-এর জন্য বিশেষভাবে ডিজাইন করা এবং সব সাধারণ Aqua মডেলে ফিট হয়।",
  },
  {
    id: "f2",
    question: "ডেলিভারিতে কত সময় লাগে?",
    answer: "সাধারণত সারা বাংলাদেশে ২-৪ কর্মদিবসের মধ্যে ডেলিভারি হয়।",
  },
  {
    id: "f3",
    question: "Installation কি কঠিন?",
    answer: "না, কোনো টুল বা ড্রিলিং ছাড়াই কয়েক মিনিটে নিজে ইনস্টল করতে পারবেন।",
  },
  {
    id: "f4",
    question: "Cash On Delivery আছে কি?",
    answer: "হ্যাঁ, পণ্য হাতে পেয়ে টাকা পরিশোধ করতে পারবেন।",
  },
  {
    id: "f5",
    question: "Warranty আছে কি?",
    answer: "হ্যাঁ, প্রোডাক্টে কোয়ালিটি গ্যারান্টি সহ ৭ দিনের ফিটমেন্ট গ্যারান্টি আছে — ঠিকমতো ফিট না হলে আমরা সমাধান করে দেবো।",
  },
];

// Gallery captions pair with product.images[0..3] (Admin → Products → Gallery
// images). The fallbacks below only show until those four slots are filled.
const GALLERY_CAPTIONS = ["Front View", "Side View", "Open Storage View", "Installed In Aqua"];
const GALLERY_FALLBACK = [
  "/seed/dz-studio-warm.webp",
  "/seed/dz-fit-light-2.webp",
  "/seed/dz-studio-open.webp",
  "/seed/dz-usb-ports.webp",
];

const HERO_FALLBACK = "/seed/dz-hero-driver.webp";

const CUSTOMER_PHOTO_KEYS = [
  "customer_photo_1",
  "customer_photo_2",
  "customer_photo_3",
  "customer_photo_4",
  "customer_photo_5",
  "customer_photo_6",
];

export default async function Home() {
  const [settings, product, faqs, content, testimonials, reviewImages] =
    await Promise.all([
      getSettings(),
      getActiveProduct(),
      getFaqs(),
      getContent(),
      getTestimonials(),
      getReviewImages(),
    ]);

  if (!product) {
    return (
      <main className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <h1 className="font-display text-2xl font-extrabold">No product found</h1>
          <p className="mt-2 text-white/60">Add a product in the admin panel and set it Active.</p>
          <Link href="/admin/dashboard" className="btn-brand mt-6 px-6 py-2.5">
            Go to admin
          </Link>
        </div>
      </main>
    );
  }

  const c = settings.currency;
  const wa = `https://wa.me/${toWhatsAppNumber(settings.whatsapp)}`;
  const priceLabel = formatTaka(product.price, c);
  const heroImage = product.heroImage || HERO_FALLBACK;
  const galleryItems = GALLERY_CAPTIONS.map((caption, i) => ({
    caption,
    url: product.images[i]?.url ?? GALLERY_FALLBACK[i],
  }));
  // Reviews come from the admin panel (Admin → Testimonials / Image Reviews);
  // the packaged placeholders show only until the first real ones are added.
  const reviews =
    testimonials.length > 0
      ? testimonials.map((t) => ({ name: t.name, text: t.text, tag: t.tag }))
      : FALLBACK_REVIEWS;
  const customerPhotos =
    reviewImages.length > 0
      ? reviewImages.map((r) => r.imageUrl)
      : CUSTOMER_PHOTO_KEYS.map((k) => content[k]);
  const faqItems = faqs.length > 0 ? faqs : FALLBACK_FAQS;

  return (
    <div>
      {settings.fbPixelId && <FacebookPixel pixelId={settings.fbPixelId} />}
      <SmoothScroll />
      <Navbar brandName={settings.brandName} logoUrl={settings.logoUrl} whatsapp={settings.whatsapp} />
      <FloatingCTA whatsapp={settings.whatsapp} priceLabel={priceLabel} />

      {/* 1. HERO */}
      <Hero image={heroImage} />

      {/* 2. TRUST / STATS BAR */}
      <section className="border-y border-white/10 bg-night-2">
        <div className="mx-auto max-w-6xl px-4 py-3.5 sm:px-8 sm:py-10">
          <Reveal className="grid grid-cols-3 divide-x divide-white/10">
            {STATS.map((s) => (
              <div key={s.label} className="flex flex-row items-center justify-center gap-2 px-1 text-left sm:flex-col sm:gap-2.5 sm:text-center">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-brand/15 text-brand sm:h-12 sm:w-12 sm:rounded-xl">
                  <s.icon className="h-3.5 w-3.5 sm:h-6 sm:w-6" />
                </span>
                <span className="flex flex-col leading-tight sm:contents">
                  <span className="font-display text-sm font-extrabold text-white sm:text-3xl">{s.value}</span>
                  <span className="text-[10px] leading-tight text-white/55 sm:text-sm">{s.label}</span>
                </span>
              </div>
            ))}
          </Reveal>
        </div>
        <Reveal className="border-t border-white/10 bg-night">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-4 gap-y-1 px-5 py-2 text-[10px] font-semibold text-white/80 sm:gap-x-8 sm:gap-y-2 sm:py-3.5 sm:text-sm">
            <span className="inline-flex items-center gap-1.5 sm:gap-2">
              <Car className="h-3.5 w-3.5 text-brand sm:h-4 sm:w-4" /> Designed Specifically For Toyota Aqua
            </span>
            <span className="inline-flex items-center gap-1.5 sm:gap-2">
              <Shield className="h-3.5 w-3.5 text-brand sm:h-4 sm:w-4" /> 7-Day Fitment Guarantee
            </span>
          </div>
        </Reveal>
      </section>

      {/* 3. PROBLEM SECTION */}
      <section className="bg-paper px-5 py-12 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2
              className="font-display font-extrabold leading-tight text-tdark"
              style={{ fontSize: "clamp(1.6rem, 5.5vw, 2.6rem)" }}
            >
              আপনার Aqua-তেও কি এই <span className="text-brand">সমস্যাগুলো</span> হয়?
            </h2>
            <p className="mt-3 text-base leading-relaxed text-tmuted">
              ছোট ছোট অসুবিধা, কিন্তু প্রতিদিনের Driving Experience-টা একটু একটু করে নষ্ট করে দেয়।
            </p>
          </Reveal>

          <div className="mt-8 grid gap-3 sm:mt-12 sm:gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {PROBLEMS.map((p, i) => (
              <Reveal
                key={p.title}
                delay={i * 80}
                className="card-light flex flex-col items-center p-4 text-center hover:-translate-y-1 hover:shadow-[0_14px_40px_rgba(0,0,0,0.12)] sm:p-6"
              >
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-brand/12 text-brand sm:h-12 sm:w-12">
                  <p.icon className="h-4 w-4 sm:h-6 sm:w-6" />
                </span>
                <h3 className="mt-2.5 font-display text-sm font-bold leading-snug text-tdark sm:mt-4 sm:text-base">{p.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-tmuted sm:mt-2 sm:text-sm">{p.text}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SOLUTION SECTION */}
      <section id="features" className="scroll-mt-20 border-t border-tline bg-paper px-5 py-12 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <p className="eyebrow">The Perfect Solution</p>
            <h2
              className="mt-3 font-display font-extrabold leading-tight text-tdark"
              style={{ fontSize: "clamp(1.6rem, 5.5vw, 2.6rem)" }}
            >
              একটা ছোট Upgrade, পুরো Driving Experience <span className="text-brand">বদলে দেয়</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-tmuted">
              DriveZen Premium Armrest শুধু একটা Accessory নয়।
              <br />
              এটা Comfort, Storage এবং Premium Feel—তিনটারই একটি Smart Combination।
            </p>

            <ul className="mt-6 space-y-3">
              {SOLUTION_CHECKLIST.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand text-white">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="font-semibold text-tdark">{item}</span>
                </li>
              ))}
            </ul>

            <div className="mt-7 rounded-2xl border border-brand/25 bg-brand/8 p-5">
              <h3 className="font-display text-base font-bold text-tdark">কেন এটা আলাদা?</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-tmuted">
                কারণ এটা কোনো Universal Product নয়।
                <br />
                এটা শুধুমাত্র Toyota Aqua-এর Interior মাথায় রেখে ডিজাইন করা হয়েছে।
              </p>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <Gallery items={galleryItems} />
          </Reveal>
        </div>
      </section>

      {/* 5. PERFECT FIT + SEE THE DIFFERENCE */}
      <section className="bg-paper px-5 py-12 sm:py-20">
        <div className="mx-auto max-w-6xl space-y-10 sm:space-y-14">
          {/* Perfect fit — dark card */}
          <Reveal className="card-dark overflow-hidden rounded-3xl">
            <div className="grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-2 lg:gap-12">
              <div>
                <p className="eyebrow">Perfect Fit Guarantee</p>
                <h2
                  className="mt-3 font-display font-extrabold leading-tight text-white"
                  style={{ fontSize: "clamp(1.6rem, 5.5vw, 2.4rem)" }}
                >
                  Toyota Aqua-এর জন্যই <span className="text-brand">বানানো</span>
                </h2>
                <p className="mt-3 text-base leading-relaxed text-white/65">
                  এমনভাবে Fit হবে, যেন Factory থেকেই গাড়ির অংশ ছিল।
                </p>

                <ul className="mt-6 space-y-3">
                  {FIT_CHECKLIST.map((item) => (
                    <li key={item} className="flex items-center gap-3">
                      <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-brand/20 text-brand">
                        <Check className="h-3.5 w-3.5" />
                      </span>
                      <span className="font-medium text-white/90">{item}</span>
                    </li>
                  ))}
                </ul>

                <p className="mt-6 font-display text-lg font-bold text-brand">
                  দেখতেও Factory-এর, অনুভূতিতেও Factory-এর।
                </p>
              </div>

              <ImageZoom
                src={content.fit_image}
                alt="DriveZen Premium Armrest — perfect fit for Toyota Aqua"
                wrapperClassName="relative block aspect-[4/3] w-full overflow-hidden rounded-2xl glow-brand cursor-zoom-in"
                imageClassName="object-cover"
                sizes="(max-width: 1024px) 100vw, 45vw"
                quality={85}
              />
            </div>
          </Reveal>

          {/* Before / after slider */}
          <Reveal className="mx-auto max-w-4xl">
            <h2
              className="text-center font-display font-extrabold leading-tight text-tdark"
              style={{ fontSize: "clamp(1.6rem, 5.5vw, 2.4rem)" }}
            >
              See The <span className="text-brand">Difference</span>
            </h2>
            <div className="mt-6 sm:mt-8">
              <BeforeAfter beforeSrc={content.before_image} afterSrc={content.after_image} />
            </div>
            <div className="mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row">
              <div className="flex flex-wrap justify-center gap-2">
                {["Empty", "Basic", "Less Organized"].map((t) => (
                  <span key={t} className="chip-light !text-tmuted">{t}</span>
                ))}
              </div>
              <div className="flex flex-wrap justify-center gap-2">
                {["Premium", "Comfortable", "Organized"].map((t) => (
                  <span key={t} className="chip-light border-brand/40 bg-brand/10 !text-brand">
                    {t}
                  </span>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 6. INSTALLS IN MINUTES — VIDEO */}
      <section id="install" className="scroll-mt-20 border-t border-tline bg-white px-5 py-12 sm:py-20">
        <div className="mx-auto grid max-w-6xl items-center gap-8 lg:grid-cols-2 lg:gap-14">
          <Reveal>
            <VideoLightbox thumbnail={content.install_video_thumb} videoUrl={null} />
          </Reveal>

          <Reveal delay={120}>
            <h2
              className="font-display font-extrabold leading-tight text-tdark"
              style={{ fontSize: "clamp(1.6rem, 5.5vw, 2.6rem)" }}
            >
              Installs In <span className="text-brand">Minutes</span>
            </h2>
            <p className="mt-3 text-base leading-relaxed text-tmuted">
              দেখুন কত সহজে DriveZen Armrest আপনার Toyota Aqua-তে বসে যায়।
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              {[
                { icon: Wrench, label: "No Special Tools Required" },
                { icon: Zap, label: "Quick Setup" },
                { icon: ThumbsUp, label: "Beginner Friendly" },
              ].map((f) => (
                <span key={f.label} className="chip-light">
                  <f.icon className="h-4 w-4 text-brand" /> {f.label}
                </span>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 7. TESTIMONIALS */}
      <section id="reviews" className="scroll-mt-20 border-t border-tline bg-paper px-5 py-12 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2
              className="font-display font-extrabold leading-tight text-tdark"
              style={{ fontSize: "clamp(1.6rem, 5.5vw, 2.6rem)" }}
            >
              What <span className="text-brand">Aqua Owners</span> Say
            </h2>
          </Reveal>

          {/* Review carousel — auto-scrolls every 4s, arrows + swipe, hold to pause */}
          <Reveal delay={80} className="mt-8 sm:mt-12">
            <ReviewsCarousel reviews={reviews} />
          </Reveal>

          {/* Customer photo strip */}
          <Reveal className="mt-8 rounded-3xl bg-night p-6 sm:mt-12 sm:p-8">
            <p className="text-center font-display text-base font-bold text-white sm:text-lg">
              Join Hundreds Of Aqua Owners Across Bangladesh
            </p>
            <div className="no-scrollbar mt-5 flex snap-x gap-3 overflow-x-auto pb-1 sm:grid sm:grid-cols-6 sm:overflow-visible">
              {customerPhotos.map((src, i) => (
                <ImageZoom
                  key={src + i}
                  src={src}
                  alt={`DriveZen customer photo ${i + 1}`}
                  wrapperClassName="relative block aspect-square w-24 shrink-0 snap-start overflow-hidden rounded-xl border border-white/10 sm:w-auto cursor-zoom-in"
                  imageClassName="object-cover transition-transform duration-500 hover:scale-105"
                  sizes="(max-width: 640px) 25vw, 15vw"
                  quality={75}
                />
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* 8. WHY CHOOSE + EVERYTHING INCLUDED */}
      <section className="border-t border-tline bg-paper px-5 py-12 sm:py-20">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-2 lg:gap-12">
          {/* Flex column + flex-1 grid so the four cards stretch to match the
              taller "Everything Included" card next to them on desktop. */}
          <Reveal className="flex flex-col">
            <h2
              className="font-display font-extrabold leading-tight text-tdark"
              style={{ fontSize: "clamp(1.5rem, 5vw, 2.2rem)" }}
            >
              Why Aqua Owners Choose <span className="text-brand">DriveZen</span>
            </h2>
            <div className="mt-6 grid flex-1 gap-4 sm:grid-cols-2">
              {WHY_CHOOSE.map((w, i) => (
                <Reveal
                  key={w.title}
                  delay={i * 70}
                  className="card-light flex flex-col items-center p-5 text-center hover:-translate-y-1"
                >
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-brand/12 text-brand">
                    <w.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 font-display text-sm font-bold text-tdark">{w.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-tmuted">{w.text}</p>
                </Reveal>
              ))}
            </div>
          </Reveal>

          <Reveal delay={120} className="overflow-hidden rounded-3xl bg-brand p-6 text-white shadow-[0_20px_50px_-20px_rgba(245,130,10,0.6)] sm:p-8">
            <h2
              className="font-display font-extrabold leading-tight"
              style={{ fontSize: "clamp(1.5rem, 5vw, 2.2rem)" }}
            >
              Everything Included
            </h2>
            <ul className="mt-5 space-y-3">
              {INCLUDED.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-white text-brand">
                    <Check className="h-3.5 w-3.5" />
                  </span>
                  <span className="font-semibold">{item}</span>
                </li>
              ))}
            </ul>
            <ImageZoom
              src={content.included_image}
              alt="DriveZen Premium Armrest package"
              wrapperClassName="relative mt-6 block aspect-[16/9] w-full overflow-hidden rounded-2xl border border-white/25 cursor-zoom-in"
              imageClassName="object-cover"
              sizes="(max-width: 1024px) 100vw, 45vw"
              quality={80}
            />
          </Reveal>
        </div>
      </section>

      {/* 9. FAQ */}
      <section id="faq" className="scroll-mt-20 border-t border-tline bg-paper px-5 py-12 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <h2
              className="font-display font-extrabold leading-tight text-tdark"
              style={{ fontSize: "clamp(1.6rem, 5.5vw, 2.6rem)" }}
            >
              Frequently Asked <span className="text-brand">Questions</span>
            </h2>
          </Reveal>
          <Reveal delay={100} className="mt-8 sm:mt-12">
            <Faq items={faqItems} />
          </Reveal>
        </div>
      </section>

      {/* 10. FINAL CTA */}
      <section className="relative overflow-hidden bg-night px-5 py-14 sm:py-24">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt=""
            fill
            loading="lazy"
            sizes="100vw"
            quality={75}
            className="object-cover opacity-25"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-night via-night/85 to-night" />
          <div className="pointer-events-none absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/12 blur-[130px]" />
        </div>

        <Reveal className="relative mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-brand/50 bg-brand/15 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-brand">
            <Alert className="h-4 w-4" /> Limited Stock Available
          </span>

          <h2
            className="mt-5 font-display font-extrabold leading-tight text-white"
            style={{ fontSize: "clamp(1.8rem, 6.5vw, 3rem)" }}
          >
            আপনার Aqua-টা এই Upgrade-এর <span className="text-brand">যোগ্য</span>
          </h2>

          <div className="mt-5 space-y-1 text-base leading-relaxed text-white/70 sm:text-lg">
            <p>প্রতিদিন Drive করেন।</p>
            <p>প্রতিদিন এই Interior-এই বসেন।</p>
            <p>প্রতিদিন এই Comfort-টাই অনুভব করেন।</p>
            <p className="pt-2">
              তাহলে কেন এমন একটা Upgrade বাদ রাখবেন, যা প্রতিটি Drive-কে আরও Comfortable ও Premium
              করে তুলতে পারে?
            </p>
          </div>

          <a href="#order" className="btn-brand mt-8 px-9 py-4 text-lg">
            আজই Aqua Upgrade করুন <ArrowRight className="h-5 w-5" />
          </a>

          <div className="mt-7 flex flex-wrap justify-center gap-2.5">
            <span className="chip-dark">
              <Star className="h-3.5 w-3.5 text-brand" /> Aqua Owner-দের পছন্দের Upgrade
            </span>
            {["Cash On Delivery", "Fast Delivery", "Perfect Aqua Fit"].map((t) => (
              <span key={t} className="chip-dark">
                <Check className="h-3.5 w-3.5 text-brand" /> {t}
              </span>
            ))}
          </div>
        </Reveal>
      </section>

      {/* ORDER FORM */}
      <section id="order" className="scroll-mt-20 border-t border-white/10 bg-night-2 px-5 py-12 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <Reveal className="mx-auto max-w-2xl text-center">
            <p className="eyebrow">{content.order_eyebrow}</p>
            <h2
              className="mt-3 font-display font-extrabold leading-tight text-white"
              style={{ fontSize: "clamp(1.6rem, 5.5vw, 2.4rem)" }}
            >
              {content.order_heading}
            </h2>
            <p className="mt-3 text-white/60">{content.order_subheading}</p>
          </Reveal>

          <Reveal delay={100} className="mt-8 rounded-3xl border border-white/10 bg-night-2 p-4 shadow-[0_24px_60px_-24px_rgba(0,0,0,0.8)] sm:mt-10 sm:p-8">
            <OrderForm
              productId={product.id}
              productName={product.name}
              unitPrice={product.price}
              deliveryInside={settings.deliveryInside}
              deliveryOutside={settings.deliveryOutside}
              currency={c}
              whatsapp={settings.whatsapp}
              content={content}
            />
          </Reveal>
        </div>
      </section>

      {/* 11. FOOTER */}
      <footer id="contact" className="scroll-mt-20 border-t border-white/10 bg-night">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div>
              <span className="font-display text-2xl font-extrabold tracking-tight text-white">
                Drive<span className="text-brand">Z</span>en
              </span>
              <p className="mt-2 text-sm text-white/55">Drive Better. Live Comfortably.</p>
            </div>

            <ul className="grid grid-cols-1 gap-x-8 gap-y-3 text-sm sm:grid-cols-2">
              <li>
                <a
                  href={settings.facebookUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-white/80 transition-colors duration-300 hover:text-brand"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/5">
                    <Facebook className="h-4 w-4 text-[#1877F2]" />
                  </span>
                  Facebook
                </a>
              </li>
              <li>
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2.5 text-white/80 transition-colors duration-300 hover:text-brand"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/5">
                    <Whatsapp className="h-4 w-4 text-[#25D366]" />
                  </span>
                  WhatsApp: {settings.whatsapp}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${settings.phone}`}
                  className="inline-flex items-center gap-2.5 text-white/80 transition-colors duration-300 hover:text-brand"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/5">
                    <Phone className="h-4 w-4 text-brand" />
                  </span>
                  {settings.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${settings.email || "hello@drivezen.com"}`}
                  className="inline-flex items-center gap-2.5 text-white/80 transition-colors duration-300 hover:text-brand"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-lg bg-white/5">
                    <Mail className="h-4 w-4 text-brand" />
                  </span>
                  {settings.email || "hello@drivezen.com"}
                </a>
              </li>
            </ul>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row">
            <p>© {new Date().getFullYear()} {settings.brandName}. All rights reserved.</p>
            <Link href="/admin/dashboard" className="transition-colors duration-300 hover:text-white/70">
              Admin
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
