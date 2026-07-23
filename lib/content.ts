import { prisma } from "@/lib/prisma";

export type ContentField = {
  key: string;
  label: string;
  group: string;
  type?: "text" | "textarea" | "image";
  default: string;
};

// Every editable button label / heading / static copy shown on the landing page.
// Add a new field here and it instantly appears in /admin/content — no other
// wiring needed as long as the component reads it from getContent().
export const CONTENT_FIELDS: ContentField[] = [
  // Navigation
  { key: "nav_menu_label", label: "Menu label (desktop)", group: "Navigation", default: "Menu" },
  { key: "nav_features", label: "Nav: Features", group: "Navigation", default: "Features" },
  { key: "nav_highlights", label: "Nav: Highlights", group: "Navigation", default: "Highlights" },
  { key: "nav_gallery", label: "Nav: Gallery", group: "Navigation", default: "Gallery" },
  { key: "nav_reviews", label: "Nav: Reviews", group: "Navigation", default: "Reviews" },
  { key: "nav_faq", label: "Nav: FAQ", group: "Navigation", default: "FAQ" },
  { key: "nav_order", label: "Nav: Order", group: "Navigation", default: "Order" },

  // Hero
  { key: "hero_order_button", label: "\"Order now\" button", group: "Hero", default: "Order now" },
  { key: "hero_discover_button", label: "\"Discover more\" button", group: "Hero", default: "Discover more" },
  { key: "hero_from_label", label: "Price prefix (\"From\")", group: "Hero", default: "From" },
  { key: "hero_off_label", label: "Discount suffix (\"OFF\")", group: "Hero", default: "OFF" },

  // Statement section
  { key: "statement_eyebrow_fallback", label: "Eyebrow (fallback text)", group: "Statement Section", default: "Engineered comfort" },
  { key: "statement_heading", label: "Heading", group: "Statement Section", type: "textarea", default: "Where craftsmanship meets everyday comfort." },

  // Features section
  { key: "features_eyebrow", label: "Eyebrow", group: "Features Section", default: "Every detail included" },
  { key: "features_heading", label: "Heading", group: "Features Section", default: "What you get" },
  { key: "features_order_button", label: "\"Order now\" button", group: "Features Section", default: "Order now" },

  // Highlights section
  { key: "highlights_order_button", label: "\"Order now\" button", group: "Highlights Section", default: "Order now" },

  // Gallery section
  { key: "gallery_eyebrow", label: "Eyebrow", group: "Gallery Section", default: "Gallery" },
  { key: "gallery_heading", label: "Heading", group: "Gallery Section", default: "See it up close" },
  { key: "gallery_order_button", label: "\"Order now\" button", group: "Gallery Section", default: "Order now" },

  // Reviews section
  { key: "reviews_eyebrow", label: "Eyebrow", group: "Reviews Section", default: "Reviews" },
  { key: "reviews_heading", label: "Heading", group: "Reviews Section", default: "What people say" },

  // Order section
  { key: "order_eyebrow", label: "Eyebrow", group: "Order Section", default: "Order" },
  { key: "order_heading", label: "Heading", group: "Order Section", default: "Place your order" },
  { key: "order_subheading", label: "Subheading", group: "Order Section", type: "textarea", default: "Fill in the form below. We'll call to confirm — pay on delivery when it arrives." },

  // Order form
  { key: "order_form_name_label", label: "\"Full name\" field label", group: "Order Form", default: "Full name *" },
  { key: "order_form_phone_label", label: "\"Mobile number\" field label", group: "Order Form", default: "Mobile number *" },
  { key: "order_form_address_label", label: "\"Full address\" field label", group: "Order Form", default: "Full address *" },
  { key: "order_form_area_label", label: "\"Delivery area\" field label", group: "Order Form", default: "Delivery area" },
  { key: "order_form_inside_label", label: "Inside-Dhaka option label", group: "Order Form", default: "Inside Dhaka" },
  { key: "order_form_outside_label", label: "Outside-Dhaka option label", group: "Order Form", default: "Outside Dhaka" },
  { key: "order_form_note_label", label: "\"Note\" field label", group: "Order Form", default: "Note (optional)" },
  { key: "order_form_summary_heading", label: "Summary card heading", group: "Order Form", default: "Order summary" },
  { key: "order_form_quantity_label", label: "\"Quantity\" label", group: "Order Form", default: "Quantity" },
  { key: "order_form_subtotal_label", label: "\"Subtotal\" label", group: "Order Form", default: "Subtotal" },
  { key: "order_form_delivery_label", label: "\"Delivery\" label", group: "Order Form", default: "Delivery" },
  { key: "order_form_total_label", label: "\"Total\" label", group: "Order Form", default: "Total" },
  { key: "order_form_coupon_label", label: "\"Coupon code\" field label", group: "Order Form", default: "Coupon code (optional)" },
  { key: "order_form_coupon_placeholder", label: "Coupon code placeholder", group: "Order Form", default: "Enter code" },
  { key: "order_form_coupon_apply_button", label: "\"Apply\" button", group: "Order Form", default: "Apply" },
  { key: "order_form_discount_label", label: "\"Discount\" label", group: "Order Form", default: "Discount" },
  { key: "order_form_confirm_button", label: "\"Confirm order\" button", group: "Order Form", default: "Confirm order" },
  { key: "order_form_cod_note", label: "Cash-on-delivery note", group: "Order Form", default: "Cash on delivery · pay when it arrives" },
  { key: "order_form_success_heading", label: "Success heading", group: "Order Form", default: "Order placed! 🎉" },
  { key: "order_form_whatsapp_button", label: "\"Confirm on WhatsApp\" button", group: "Order Form", default: "Confirm on WhatsApp" },

  // FAQ section
  { key: "faq_eyebrow", label: "Eyebrow", group: "FAQ Section", default: "FAQ" },
  { key: "faq_heading", label: "Heading", group: "FAQ Section", default: "Questions & answers" },

  // CTA section
  { key: "cta_heading", label: "Heading", group: "Call To Action", default: "Ready to upgrade?" },
  { key: "cta_subheading", label: "Subheading", group: "Call To Action", default: "Limited stock — order now or reach us on WhatsApp." },
  { key: "cta_order_button", label: "\"Order now\" button", group: "Call To Action", default: "Order now" },

  // Footer
  { key: "footer_contact_label", label: "\"Contact\" column label", group: "Footer", default: "Contact" },
  { key: "footer_explore_label", label: "\"Explore\" column label", group: "Footer", default: "Explore" },
  { key: "footer_facebook_label", label: "\"Facebook page\" link label", group: "Footer", default: "Facebook page" },
  { key: "footer_default_text", label: "Default footer description (used if Settings footer text is empty)", group: "Footer", type: "textarea", default: "Premium customised accessories for your car." },
  { key: "footer_copyright_suffix", label: "Copyright suffix", group: "Footer", default: "All rights reserved." },

  // Floating bar (mobile)
  { key: "floating_from_label", label: "Price prefix (\"From\")", group: "Floating Bar", default: "From" },
  { key: "floating_order_button", label: "\"Order now\" button", group: "Floating Bar", default: "Order now" },

  // Section images — every landing-page photo that is not part of the product
  // record itself. The hero image and the four gallery photos live on the
  // product (Admin → Products), everything below is edited here.
  {
    key: "fit_image",
    label: "\"Perfect Fit\" card photo — 4:3, shows the armrest fitted in the car",
    group: "Section Images",
    type: "image",
    default: "/seed/dz-fit-light-2.webp",
  },
  {
    key: "before_image",
    label: "Before/After slider — BEFORE (console with no armrest)",
    group: "Section Images",
    type: "image",
    default: "/seed/dz-before-console.webp",
  },
  {
    key: "after_image",
    label: "Before/After slider — AFTER (same view, armrest installed)",
    group: "Section Images",
    type: "image",
    default: "/seed/dz-dark-cabin.webp",
  },
  {
    key: "install_video_thumb",
    label: "Installation video thumbnail — 16:9",
    group: "Section Images",
    type: "image",
    default: "/seed/dz-driver-pov.webp",
  },
  {
    key: "included_image",
    label: "\"Everything Included\" card photo — 16:9",
    group: "Section Images",
    type: "image",
    default: "/seed/dz-console-cup.webp",
  },
  { key: "customer_photo_1", label: "Customer photo strip 1 — square", group: "Section Images", type: "image", default: "/seed/dz-driver-pov.webp" },
  { key: "customer_photo_2", label: "Customer photo strip 2 — square", group: "Section Images", type: "image", default: "/seed/dz-fit-light.webp" },
  { key: "customer_photo_3", label: "Customer photo strip 3 — square", group: "Section Images", type: "image", default: "/seed/dz-dark-cabin.webp" },
  { key: "customer_photo_4", label: "Customer photo strip 4 — square", group: "Section Images", type: "image", default: "/seed/dz-usb-ports.webp" },
  { key: "customer_photo_5", label: "Customer photo strip 5 — square", group: "Section Images", type: "image", default: "/seed/dz-console-cup.webp" },
  { key: "customer_photo_6", label: "Customer photo strip 6 — square", group: "Section Images", type: "image", default: "/seed/dz-fit-light-2.webp" },
];

// Keys whose value is an image URL — used by the admin editor to swap the text
// input for an uploader, and by the page to fall back when a value is cleared.
export const CONTENT_IMAGE_KEYS: string[] = CONTENT_FIELDS.filter(
  (f) => f.type === "image"
).map((f) => f.key);

export const CONTENT_GROUPS: string[] = Array.from(
  new Set(CONTENT_FIELDS.map((f) => f.group))
);

export type ContentMap = Record<string, string>;

export async function getContent(): Promise<ContentMap> {
  const rows = await prisma.siteContent.findMany();
  const overrides = Object.fromEntries(rows.map((r) => [r.key, r.value]));
  const result: ContentMap = {};
  for (const f of CONTENT_FIELDS) {
    const override = overrides[f.key];
    // An image that was removed in the admin panel falls back to the packaged
    // default so the section never renders a broken <Image src="">.
    result[f.key] =
      f.type === "image" && !override ? f.default : override ?? f.default;
  }
  return result;
}
