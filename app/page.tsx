import Link from "next/link";
import Image from "next/image";
import { getActiveProduct, getFaqs, getSettings } from "@/lib/data";
import { getContent } from "@/lib/content";
import { formatTaka, discountPercent, pad2, toWhatsAppNumber } from "@/lib/utils";
import SmoothScroll from "@/components/site/SmoothScroll";
import FacebookPixel from "@/components/site/FacebookPixel";
import Navbar from "@/components/site/Navbar";
import FloatingCTA from "@/components/site/FloatingCTA";
import Hero from "@/components/site/Hero";
import OrderForm from "@/components/site/OrderForm";
import Faq from "@/components/site/Faq";
import Gallery from "@/components/site/Gallery";
import Reveal from "@/components/site/Reveal";
import {
  Star,
  Whatsapp,
  Phone,
  Facebook,
  MapPin,
  ArrowRight,
} from "@/components/icons";

export const dynamic = "force-dynamic";

const REVIEWS = [
  {
    name: "Ferdous Kabir",
    text: "Really effective for Aqua users — I've been using it for a month. Great fit and a premium look.",
    car: "Toyota Aqua",
  },
  {
    name: "Rakib Hasan",
    text: "Fitted without any drilling and it blends right into the interior. Delivery was fast too.",
    car: "Aqua Owner",
  },
  {
    name: "Sabbir Ahmed",
    text: "Finally an armrest for the passenger side as well — so much more comfortable. Great service.",
    car: "Verified Buyer",
  },
];

export default async function Home() {
  const [settings, product, faqs, content] = await Promise.all([
    getSettings(),
    getActiveProduct(),
    getFaqs(),
    getContent(),
  ]);

  if (!product) {
    return (
      <main className="grid min-h-screen place-items-center px-6 text-center">
        <div>
          <h1 className="font-display text-2xl font-bold uppercase">No product found</h1>
          <p className="mt-2 text-muted">Add a product in the admin panel and set it Active.</p>
          <Link href="/admin/dashboard" className="btn-gold mt-6 inline-flex rounded-full px-6 py-2.5 font-semibold">
            Go to admin
          </Link>
        </div>
      </main>
    );
  }

  const c = settings.currency;
  const discount = discountPercent(product.price, product.oldPrice);
  const wa = `https://wa.me/${toWhatsAppNumber(settings.whatsapp)}`;
  const priceLabel = formatTaka(product.price, c);
  const heroImages = Array.from(
    new Set([product.heroImage, ...product.images.map((i) => i.url)].filter(Boolean) as string[])
  );

  return (
    <div id="top">
      {settings.fbPixelId && <FacebookPixel pixelId={settings.fbPixelId} />}
      <SmoothScroll />
      <Navbar brandName={settings.brandName} logoUrl={settings.logoUrl} whatsapp={settings.whatsapp} content={content} />
      <FloatingCTA whatsapp={settings.whatsapp} priceLabel={priceLabel} content={content} />

      <Hero
        images={heroImages}
        kicker={settings.heroKicker || settings.tagline}
        headline={settings.heroHeadline || product.tagline}
        productName={product.name}
        priceLabel={priceLabel}
        oldPriceLabel={product.oldPrice ? formatTaka(product.oldPrice, c) : null}
        discount={discount}
        badge={product.badge}
        content={content}
      />

      {/* Statement */}
      <section className="bg-black py-8 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-8">
          <Reveal>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold sm:mb-5">
              {product.priceNote || content.statement_eyebrow_fallback}
            </p>
            <h2 className="display-xl text-4xl sm:text-6xl">
              {content.statement_heading}
            </h2>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-muted sm:mt-6">
              {product.description}
            </p>
          </Reveal>
        </div>
      </section>

      {/* Features / included */}
      {product.features.length > 0 && (
        <section id="features" className="border-y border-white/10 bg-ink-2 py-8 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-8">
            <Reveal className="max-w-2xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold sm:mb-4">
                {content.features_eyebrow}
              </p>
              <h2 className="display-xl text-4xl sm:text-5xl">{content.features_heading}</h2>
              <p className="mt-3 text-muted sm:mt-4">{product.shortDesc}</p>
            </Reveal>

            <div className="mt-6 grid gap-x-8 gap-y-5 sm:mt-10 sm:grid-cols-2 sm:gap-x-12 sm:gap-y-8">
              {product.features.map((f, i) => (
                <Reveal
                  key={f.id}
                  delay={i * 50}
                  className="flex items-start gap-4 border-t border-white/10 pt-5 sm:pt-6"
                >
                  <span className="font-display text-sm font-bold text-gold">{pad2(i + 1)}</span>
                  <p className="text-lg leading-snug text-fg/90">{f.text}</p>
                </Reveal>
              ))}
            </div>

            <div className="mt-6 sm:mt-8">
              <a
                href="#order"
                className="btn-gold inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold uppercase tracking-wide"
              >
                {content.features_order_button} <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Highlights — editorial showcase */}
      {product.highlights.length > 0 && (
        <section id="highlights" className="bg-black py-8 sm:py-14">
          <div className="mx-auto max-w-7xl space-y-8 px-4 sm:px-8 sm:space-y-14">
            {product.highlights.map((h, i) => (
              <Reveal
                key={h.id}
                className={`flex flex-col gap-5 md:flex-row md:items-center md:gap-14 ${
                  i % 2 === 1 ? "md:flex-row-reverse" : ""
                }`}
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden md:w-3/5">
                  <Image
                    src={h.imageUrl || "/seed/highlight-1.jpg"}
                    alt={h.title}
                    fill
                    loading="lazy"
                    sizes="(max-width: 768px) 100vw, 60vw"
                    quality={85}
                    className="object-cover"
                  />
                </div>
                <div className="md:w-2/5">
                  <span className="font-display text-sm font-bold text-gold">{pad2(i + 1)}</span>
                  <h3 className="mt-2 display-xl text-3xl sm:mt-3 sm:text-4xl">{h.title}</h3>
                  <p className="mt-3 leading-relaxed text-muted sm:mt-4">{h.description}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-8 flex justify-center sm:mt-12">
            <a
              href="#order"
              className="btn-gold inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold uppercase tracking-wide"
            >
              {content.highlights_order_button} <ArrowRight className="h-4 w-4" />
            </a>
          </div>
        </section>
      )}

      {/* Gallery */}
      {product.images.length > 0 && (
        <section id="gallery" className="border-y border-white/10 bg-ink-2 py-8 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-8">
            <Reveal className="max-w-2xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold sm:mb-4">{content.gallery_eyebrow}</p>
              <h2 className="display-xl text-4xl sm:text-5xl">{content.gallery_heading}</h2>
            </Reveal>
            <div className="mt-5 sm:mt-8">
              <Gallery images={product.images} />
            </div>
            <div className="mt-6 flex justify-center sm:mt-10">
              <a
                href="#order"
                className="btn-gold inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold uppercase tracking-wide"
              >
                {content.gallery_order_button} <ArrowRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </section>
      )}

      {/* Reviews */}
      <section id="reviews" className="bg-black py-8 sm:py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-8">
          <Reveal className="max-w-2xl">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold sm:mb-4">{content.reviews_eyebrow}</p>
            <h2 className="display-xl text-4xl sm:text-5xl">{content.reviews_heading}</h2>
          </Reveal>
          <div className="mt-5 grid gap-4 sm:mt-8 sm:gap-5 md:grid-cols-3">
            {REVIEWS.map((r, i) => (
              <Reveal key={r.name} delay={i * 80} className="card rounded-2xl p-6">
                <div className="flex items-center gap-1 text-gold">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="h-4 w-4" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-fg/90">“{r.text}”</p>
                <div className="mt-5 flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-white/10 font-semibold text-fg">
                    {r.name.charAt(0)}
                  </span>
                  <div>
                    <p className="text-sm font-semibold">{r.name}</p>
                    <p className="text-xs text-muted">{r.car}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section id="faq" className="bg-black py-8 sm:py-14">
          <div className="mx-auto max-w-7xl px-4 sm:px-8">
            <Reveal className="max-w-2xl">
              <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold sm:mb-4">{content.faq_eyebrow}</p>
              <h2 className="display-xl text-4xl sm:text-5xl">{content.faq_heading}</h2>
            </Reveal>
            <div className="mt-5 sm:mt-8">
              <Faq items={faqs} />
            </div>
          </div>
        </section>
      )}

      {/* CTA + Order — the final "Ready to upgrade?" section holds the order form directly */}
      <section id="order" className="relative overflow-hidden border-y border-white/10 bg-ink-2 py-10 sm:py-16">
        <div className="pointer-events-none absolute inset-0 bg-grid opacity-40" />
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold/10 blur-[120px]" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-8">
          <Reveal className="max-w-3xl text-center sm:mx-auto">
            <h2 className="display-xl text-4xl sm:text-6xl">{content.cta_heading}</h2>
            <p className="mt-3 text-muted sm:mt-4">{content.cta_subheading}</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3 sm:mt-7">
              <a href="#order-form" className="btn-gold rounded-full px-8 py-3.5 font-semibold uppercase tracking-wide">
                {content.cta_order_button}
              </a>
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-outline inline-flex items-center gap-2 rounded-full px-6 py-3.5 font-semibold uppercase tracking-wide"
              >
                <Whatsapp className="h-5 w-5 text-[#25D366]" /> {settings.whatsapp}
              </a>
            </div>
          </Reveal>

          <Reveal id="order-form" delay={100} className="mt-8 scroll-mt-24 rounded-3xl border border-line bg-black/40 p-4 sm:mt-10 sm:p-8">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold sm:mb-4">{content.order_eyebrow}</p>
            <h3 className="display-xl text-2xl sm:text-3xl">{content.order_heading}</h3>
            <p className="mt-2 text-muted sm:mt-3">{content.order_subheading}</p>

            <div className="mt-6 sm:mt-8">
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
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-8 sm:py-12">
          <div className="grid gap-8 md:grid-cols-3 md:gap-10">
            <div>
              <span className="font-display text-2xl font-extrabold uppercase tracking-[0.35em]">
                {settings.brandName}
              </span>
              <p className="mt-3 max-w-xs text-sm leading-relaxed text-muted sm:mt-5">
                {settings.footerText || content.footer_default_text}
              </p>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{content.footer_contact_label}</h4>
              <ul className="mt-3 space-y-2 text-sm sm:mt-5 sm:space-y-3">
                <li>
                  <a href={`tel:${settings.phone}`} className="inline-flex items-center gap-2 text-fg/90 hover:text-gold">
                    <Phone className="h-4 w-4 text-gold" /> {settings.phone}
                  </a>
                </li>
                <li>
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-fg/90 hover:text-gold">
                    <Whatsapp className="h-4 w-4 text-[#25D366]" /> WhatsApp: {settings.whatsapp}
                  </a>
                </li>
                {settings.address && (
                  <li className="inline-flex items-center gap-2 text-fg/90">
                    <MapPin className="h-4 w-4 text-gold" /> {settings.address}
                  </li>
                )}
                {settings.facebookUrl && (
                  <li>
                    <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-fg/90 hover:text-gold">
                      <Facebook className="h-4 w-4 text-[#1877F2]" /> {content.footer_facebook_label}
                    </a>
                  </li>
                )}
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{content.footer_explore_label}</h4>
              <ul className="mt-3 space-y-2 text-sm sm:mt-5 sm:space-y-3">
                <li><a href="#features" className="text-fg/90 hover:text-gold">{content.nav_features}</a></li>
                <li><a href="#gallery" className="text-fg/90 hover:text-gold">{content.nav_gallery}</a></li>
                <li><a href="#order" className="text-fg/90 hover:text-gold">{content.nav_order}</a></li>
                <li><a href="#faq" className="text-fg/90 hover:text-gold">{content.nav_faq}</a></li>
              </ul>
            </div>
          </div>

          <div className="mt-6 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-5 text-xs text-muted-2 sm:mt-8 sm:flex-row sm:pt-6">
            <p>© {new Date().getFullYear()} {settings.brandName}. {content.footer_copyright_suffix}</p>
            <Link href="/admin/dashboard" className="hover:text-muted">Admin</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
