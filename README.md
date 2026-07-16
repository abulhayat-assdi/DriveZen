# Drive Zen — Premium Car Accessories Landing Page + CMS

A premium, dark, **single-product landing page** with a full **CMS admin panel** for the Drive Zen
car-accessories business. Cinematic monochrome design (inspired by the Porsche Cayenne Black Edition),
buttery smooth scrolling, English throughout, and a cash-on-delivery ordering system.

Brand: **Drive Zen** · Reference design: Porsche Cayenne Black Edition

---

## 🚀 Getting Started

```bash
npm install          # install dependencies (once)
npm run dev          # dev server → http://localhost:3000
```

- **Landing page:** http://localhost:3000
- **Admin panel:** http://localhost:3000/admin/dashboard

### 🔑 Admin login (demo credentials)

| | |
|---|---|
| **URL** | `/admin/login` |
| **Email** | `admin@drivezen.com` |
| **Password** | `admin123` |

> ⚠️ **Change the password before going live.** See "Change the admin password" below.

---

## 🖥️ Admin panel (CMS)

Everything is editable without touching code:

| Route | What it does |
|---|---|
| `/admin/dashboard` | Order/product stats and recent orders |
| `/admin/order` | Order list, click any order for full details, inline edit, and courier dispatch |
| `/admin/products` | Add / edit / delete / set **Active** product |
| `/admin/products/new` | New product (name, price, images, features, highlights, gallery) |
| `/admin/content` | Edit **every heading and button label** shown on the landing page |
| `/admin/faqs` | Manage the FAQ |
| `/admin/settings` | Brand, logo, WhatsApp/phone, address, Facebook, delivery charges, hero copy, colour, Steadfast keys |

**Content Management (`/admin/content`):** every static piece of copy on the landing page — nav labels,
button text ("Order now", "Confirm order", "Send to Courier" flow, etc.), section headings and eyebrows,
form field labels, footer text — is editable here, grouped by section. Product-specific content (name,
price, features, highlights, images) is still managed from `/admin/products`.

**Image upload:** click any image field to upload (JPG/PNG/WEBP/GIF/SVG, max 5MB). Photos are automatically
resized (max 1920px wide) and converted to compressed WebP on upload for fast page loads — see
[Image optimization](#-image-optimization) below.

**Active product:** the landing page always shows the product marked "Active". Only one can be active
at a time — setting a new one active automatically deactivates the previous one.

---

## 🛒 Order flow

1. The customer fills in the **order form** on the landing page (name, phone, address, area, quantity).
2. The total is computed **server-side** (unit price × quantity + delivery) — the client-sent price is never trusted.
3. The order is saved to the database with an order number (`DZ-00001`) and status **New Order**.
4. In `/admin/order`, click any order to open its detail card — edit any field (name, phone, address,
   quantity, area, note), change status, or delete.
5. Move status: **New Order → Confirmed → Cancelled / Fake** (only these three stages).
6. From the order detail card, click **Send to Courier** to create a Steadfast consignment automatically
   (requires Steadfast API keys — see below).

A **WhatsApp** button is available throughout the site (number controlled from Settings).

---

## 🚚 Steadfast Courier integration

1. Go to `/admin/settings` → **Steadfast Courier** and paste your **API Key** and **Secret Key**
   (from your Steadfast merchant panel).
2. Open any order in `/admin/order` and click **Send to Courier**.
3. The order is submitted to Steadfast's `create_order` API with the customer's name, phone, address,
   and COD amount. On success, the tracking code is saved on the order and shown in the detail card.
4. Without API keys configured, the button shows a clear message asking you to add them in Settings first
   — it never fails silently.

Implementation: [lib/steadfast.ts](lib/steadfast.ts) (API client) and
[app/admin/(panel)/order/actions.ts](<app/admin/(panel)/order/actions.ts>) (`sendOrderToCourier`).

---

## 🖼️ Image optimization

- **On upload:** every JPG/PNG/WEBP/AVIF is resized to a max width of 1920px and re-encoded as WebP
  (quality 82) via [sharp](https://sharp.pixelplumbing.com/) — see
  [app/api/admin/upload/route.ts](app/api/admin/upload/route.ts). SVGs and GIFs pass through unchanged.
- **On render:** every image on the site uses `next/image`, which lazy-loads off-screen images, serves
  correctly sized images per breakpoint, and marks the hero image `priority` for fast first paint.

---

## 🎨 Design & UX

- Cinematic, monochrome (black/white) editorial layout with a subtle gold accent.
- Full-viewport hero with an auto-advancing image carousel and centered wordmark navigation.
- **Smooth momentum scrolling** powered by [Lenis](https://github.com/darkroomengineering/lenis)
  (respects `prefers-reduced-motion`).
- Fonts: **Archivo** (display) + **Inter** (body).

---

## 🧱 Tech stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Tailwind CSS v4**
- **Prisma 6** + **PostgreSQL** (see [DEPLOY.md](DEPLOY.md) for the Docker Compose VPS setup)
- **jose** (JWT sessions) + **bcryptjs** (password hashing)
- **sharp** (image resize/compress on upload) + **next/image** (optimized rendering)
- Admin route protection: `proxy.ts` (Next.js middleware)
- Steadfast Courier REST API for shipment creation

## 📁 Project structure

```
app/
  page.tsx                 # landing page
  api/orders/              # order submission API
  api/admin/upload/        # image upload API (auth-protected, sharp-optimized)
  admin/login/             # login
  admin/(panel)/           # protected admin panel (sidebar layout)
    dashboard/ order/ products/ content/ faqs/ settings/
components/
  site/                    # landing components (Navbar, Hero, OrderForm, Gallery, SmoothScroll…)
  admin/                   # admin components (ProductEditor, ImageUpload…)
lib/                       # prisma, auth, data, content, steadfast, utils
prisma/schema.prisma       # database schema
prisma/seed.ts             # seed data (Drive Zen)
```

---

## 🔧 Useful commands

```bash
npm run dev        # dev server
npm run build      # production build
npm run start      # production server (after build)
npm run seed       # seed the database (Drive Zen demo data + admin user)
npm run db:reset   # reset + reseed the database (⚠️ deletes all data)
```

### 🔐 Change the admin password

Locally (replace `your-new-password`):

```bash
npx tsx -e "import{PrismaClient}from'@prisma/client';import bcrypt from 'bcryptjs';const p=new PrismaClient();(async()=>{await p.adminUser.update({where:{email:'admin@drivezen.com'},data:{passwordHash:await bcrypt.hash('your-new-password',10)}});console.log('done');await p.\$disconnect();})();"
```

On the VPS (inside the running `app` container):

```bash
docker compose exec app node -e "const{PrismaClient}=require('@prisma/client');const bcrypt=require('bcryptjs');const p=new PrismaClient();(async()=>{await p.adminUser.update({where:{email:'admin@drivezen.com'},data:{passwordHash:await bcrypt.hash('your-new-password',10)}});console.log('done');await p.\$disconnect();})();"
```

In production, also set a long random `AUTH_SECRET` in `.env` (see [DEPLOY.md](DEPLOY.md)).

---

## ☁️ Deployment notes

This app is set up to self-host on a VPS with **Docker Compose**: the Next.js app, a **PostgreSQL**
database, and uploaded product images all run/persist on the VPS's own disk — no third-party
database or storage service required.

See **[DEPLOY.md](DEPLOY.md)** for the full step-by-step VPS setup (Docker install, `.env`, Nginx +
HTTPS, backups).

> Note: this only works because the app runs as a persistent Node server (`next start` / Docker), not
> on a read-only-filesystem serverless platform like Vercel — those need external storage (S3/Cloudinary)
> and a hosted database (Neon/Supabase) instead.
