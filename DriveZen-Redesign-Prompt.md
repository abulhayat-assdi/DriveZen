# DriveZen Premium Armrest — Landing Page Redesign Prompt

> **এই ফাইলটি Claude Code (Fable 5)-এর জন্য একটি সম্পূর্ণ রিডিজাইন নির্দেশনা।**
> এই ল্যান্ডিং পেজটি একটি Toyota Aqua Premium Armrest বিক্রির জন্য। নিচের রেফারেন্স ইমেজ এবং এই ডকুমেন্ট অনুযায়ী পুরো সাইটটি নতুন করে রিডিজাইন করতে হবে।

---

## 🎯 MISSION / প্রধান নির্দেশনা

তুমি একজন senior front-end designer + developer. তোমার কাজ হচ্ছে বর্তমান প্রজেক্ট ফোল্ডারে থাকা DriveZen ল্যান্ডিং পেজের **পুরো UI নতুন করে ডিজাইন করা**, সাথে দেওয়া রেফারেন্স ইমেজ এবং এই ডকুমেন্টের কন্টেন্ট অনুযায়ী।

**অবশ্যই মানতে হবে:**

1. **পুরনো ডিজাইন সম্পূর্ণ বাদ দাও।** পুরনো CSS/styling/layout রেখো না। শুধু কাজের logic (form submit, order handling ইত্যাদি) থাকলে সেটা রেখে UI অংশ পুরো নতুন করে লেখো।
2. **টেক স্ট্যাক পরিবর্তন করবে না।** প্রজেক্ট ফোল্ডারে এখন যে ফ্রেমওয়ার্ক/স্ট্যাক আছে (Next.js / React / HTML — যা-ই হোক) সেটাই ব্যবহার করবে। শুধু UI/UX রিডিজাইন হবে, নতুন করে প্রজেক্ট setup করবে না। প্রথমে প্রজেক্টের বর্তমান স্ট্রাকচার পড়ে বুঝে নাও।
3. **MOBILE FIRST।** ৯৯% ভিজিটর মোবাইল থেকে আসবে। তাই আগে মোবাইল লেআউট নিখুঁত করবে, তারপর ট্যাবলেট, তারপর ডেস্কটপ। প্রতিটি সেকশন mobile-first breakpoint দিয়ে লিখবে।
4. **Soft, smooth transitions।** সব সেকশনে soft fade-in / slide-up on-scroll animation, hover-এ smooth transition, বাটনে subtle press effect। কোনো ঝাঁকুনি বা hard cut যেন না থাকে।
5. রেফারেন্স ইমেজটা visual direction (color, layout, section order, mood)-এর জন্য follow করবে, আর নিচের text content আমি যা দিয়েছি সেটাই ব্যবহার করবে।

---

## 🎨 DESIGN SYSTEM

### Color Palette
রেফারেন্স ইমেজ অনুযায়ী **dark premium theme + orange accent**:

| Token | Hex | ব্যবহার |
|-------|-----|---------|
| `--bg-black` | `#0D0D0D` | Hero, footer, dark section background |
| `--bg-dark` | `#161616` | Card / secondary dark surface |
| `--bg-light` | `#F5F5F3` | Light section background (Problem, Perfect Fit ইত্যাদি) |
| `--bg-white` | `#FFFFFF` | Card on light section |
| `--accent` | `#F5820A` | Primary orange (button, highlight text, icon) |
| `--accent-hover` | `#D96E00` | Button hover |
| `--text-dark` | `#1A1A1A` | Light bg-এর উপর টেক্সট |
| `--text-muted` | `#6B6B6B` | Sub-text / caption |
| `--text-white` | `#FFFFFF` | Dark bg-এর উপর টেক্সট |
| `--border` | `#E5E5E5` | Card border on light |

> Orange শুধু accent হিসেবে ব্যবহার করবে — বাটন, গুরুত্বপূর্ণ শব্দ (highlight), আইকন, badge. পুরো ব্যাকগ্রাউন্ড কমলা করবে না।

### Typography
- Heading: bold, tight, বড় (mobile-এ `clamp()` দিয়ে scale করবে)। Font: modern sans-serif (Inter / Poppins / Manrope অথবা প্রজেক্টে যা আছে)। বাংলা টেক্সটের জন্য **Hind Siliguri / Noto Sans Bengali** load করবে যাতে বাংলা সুন্দর দেখায়।
- Highlight শব্দ কমলা রঙে (যেমন "Better", "Everything", "Problems?" রেফারেন্স স্টাইলে)।
- Body: readable, line-height ~1.6, mobile-এ font-size ~16px।

### Spacing & Shape
- Rounded corners: cards `border-radius: 16px`, buttons `border-radius: 10px` (বা pill shape রেফারেন্স অনুযায়ী)।
- Section padding: mobile `48px 20px`, desktop `80px 0`।
- Soft shadow on cards: `0 8px 30px rgba(0,0,0,0.08)` (light), dark card-এ subtle glow।

### Buttons
- Primary: কমলা ব্যাকগ্রাউন্ড, সাদা টেক্সট, একটা তীর/আইকন সহ। hover-এ `--accent-hover` + slight lift (`translateY(-2px)`) + smooth transition।
- Secondary: outline / dark, "Installation Video দেখুন" টাইপ — একটা play icon সহ।

### Animation / Transition (গুরুত্বপূর্ণ)
- On-scroll reveal: প্রতিটি সেকশন/কার্ড scroll-এ আসলে `opacity 0 → 1` + `translateY(20px) → 0`, duration ~0.5s ease-out, stagger করে (Intersection Observer / framer-motion / AOS — স্ট্যাক অনুযায়ী)।
- Hover transitions: `transition: all 0.3s ease`।
- Hero image-এ subtle zoom / glow।
- Before/After section-এ একটা draggable slider (touch-friendly)।
- সব animation যেন performance-friendly হয় (transform/opacity only), মোবাইলে lag না করে।

---

## 🧩 SECTION-BY-SECTION BREAKDOWN

> সেকশনের ক্রম রেফারেন্স ইমেজ অনুযায়ী। প্রতিটি সেকশনের নিচে দেওয়া কন্টেন্ট হুবহু ব্যবহার করবে।

---

### 0. NAVBAR (Sticky)
- Dark ব্যাকগ্রাউন্ড, বাঁয়ে **DriveZen** লোগো + ছোট ট্যাগলাইন "Drive Better. Live Comfortably."
- মাঝে/ডানে nav লিংক: `Home` · `Features` · `Reviews` · `FAQ` · `Contact` (smooth scroll-to-section)।
- ডান কোণে কমলা বাটন: **Upgrade My Aqua**
- **Mobile:** hamburger menu → smooth slide-in drawer। sticky top, scroll-এ subtle background blur/shadow।

---

### 1. HERO SECTION
**Layout:** Dark background, গাড়ির interior / armrest-এর premium ছবি (রেফারেন্সের মতো)। বাঁয়ে টেক্সট, mobile-এ টেক্সট উপরে + ছবি নিচে (বা background image-এর উপর overlay টেক্সট)। উপরে ছোট badge: **PREMIUM TOYOTA AQUA ARMREST**।

**Content:**

**Headline:**
> আপনার Aqua-টা কি সত্যিই **Complete**?

**Sub-text:**
> মাইলেজ নিয়ে কোনো অভিযোগ নেই। ইঞ্জিন নিয়েও না।
> কিন্তু প্রতিদিন গাড়িতে উঠে যদি হাত রাখার একটা আরামদায়ক জায়গা খুঁজতে হয়, তাহলে হয়তো আপনার Aqua-তে এখনও একটা গুরুত্বপূর্ণ জিনিসের অভাব আছে।
> **DriveZen Premium Armrest** সেই অভাবটাই পূরণ করে।

**Buttons:**
- 🟧 **আমার Aqua Upgrade করবো** (primary, কমলা)
- ⚫ **Installation Video দেখুন** (secondary, play icon)

**Feature chips (ছোট আইকনসহ, hero-এর নিচে সারিতে):**
- ✓ Cash On Delivery
- ✓ সারা বাংলাদেশে Delivery
- ✓ Toyota Aqua-এর জন্য Perfect Fit

**Side badges (রেফারেন্সের মতো ডান পাশে ছোট আইকন কার্ড — ডেস্কটপে):** Fast Delivery · Quality Tested · Customer Favorite

---

### 2. TRUST / STATS BAR
**Layout:** Dark strip, ৩টি stat পাশাপাশি (mobile-এ ৩টি একসাথে ছোট করে বা stacked), মাঝে divider। এর সাথে একটা trust bar।

**Stats (রেফারেন্স ইমেজ থেকে — placeholder সংখ্যা, পরে বদলানো যাবে):**
- 🚗 **500+** — Aqua Owners Served
- 📦 **1000+** — Orders Delivered
- ⭐ **4.9/5** — Customer Satisfaction

**Trust bar (আলাদা ছোট strip — কন্টেন্ট থেকে):**
- 💰 **7-Day Money Back Guarantee**
- 🚚 **Nationwide Delivery**

---

### 3. PROBLEM SECTION
**Layout:** Light background। উপরে center-aligned heading + sub-text। নিচে **৪টি কার্ড** (mobile-এ ১ কলাম বা ২x২ grid, desktop-এ ৪ কলাম)। প্রতিটি কার্ডে আইকন + শিরোনাম + বর্ণনা।

**Heading:**
> আপনার Aqua-তেও কি এই **সমস্যাগুলো** হয়?

**Sub-text:**
> ছোট ছোট অসুবিধা, কিন্তু প্রতিদিনের Driving Experience-টা একটু একটু করে নষ্ট করে দেয়।

**Card 1 — হাত রাখার আরামদায়ক জায়গা নেই**
লং ড্রাইভে হাত ঝুলিয়ে রাখতে রাখতে কাঁধ ও ঘাড়ে অস্বস্তি শুরু হয়।

**Card 2 — জিনিসপত্র রাখার জায়গা নেই**
ফোন, মানিব্যাগ, চাবি—সব ছড়িয়ে থাকে সিটে, ড্যাশবোর্ডে বা কাপ হোল্ডারে।

**Card 3 — Interior-টা কেমন যেন অসম্পূর্ণ লাগে**
গাড়িটা ভালো, কিন্তু ভেতরে বসলে মনে হয় কিছু একটা এখনও Missing।

**Card 4 — প্রতিদিনের ছোট Discomfort**
একদিন সমস্যা না। কিন্তু প্রতিদিন একই অসুবিধা ধীরে ধীরে বিরক্তিতে পরিণত হয়।

---

### 4. SOLUTION SECTION
**Layout:** Light background। বাঁয়ে টেক্সট + checklist, ডানে **প্রোডাক্ট ইমেজ গ্যালারি** (রেফারেন্সের মতো ৪টি thumbnail: Front View · Side View · Open Storage View · Installed In Aqua)। Mobile-এ গ্যালারি একটা horizontal scroll / swipeable carousel হবে (thumbnail নিচে)। ছবিগুলোর জন্য placeholder image ব্যবহার করবে।

**Small label (কমলা):** THE PERFECT SOLUTION

**Heading:**
> একটা ছোট Upgrade, পুরো Driving Experience **বদলে দেয়**

**Sub-text:**
> DriveZen Premium Armrest শুধু একটা Accessory নয়।
> এটা Comfort, Storage এবং Premium Feel—তিনটারই একটি Smart Combination।

**Checklist (কমলা টিক আইকনসহ):**
- ✓ **Comfortable Arm Support**
- ✓ **Hidden Storage Space**
- ✓ **Factory-Like Premium Look**
- ✓ **কয়েক মিনিটেই Installation**
- ✓ **মজবুত ও টেকসই নির্মাণ**

**Sub-block — কেন এটা আলাদা?**
> কারণ এটা কোনো Universal Product নয়।
> এটা শুধুমাত্র Toyota Aqua-এর Interior মাথায় রেখে ডিজাইন করা হয়েছে।

**Image gallery captions:** `Front View` · `Side View` · `Open Storage View` · `Installed In Aqua`

---

### 5. PERFECT FIT + "SEE THE DIFFERENCE"
**Layout:** দুই ভাগ (রেফারেন্সের মতো)।
- **বাম/উপরের ব্লক (dark card):** "Designed Specifically For Toyota Aqua" — checklist সহ, পাশে armrest ছবি।
- **ডান/নিচের ব্লক:** "See The Difference" — একটা **before/after image comparison slider** (draggable handle, touch-friendly)। বাঁয়ে "Without Armrest", ডানে "With DriveZen Armrest"।

**Heading (মূল):**
> Toyota Aqua-এর জন্যই **বানানো**

**Sub-text:**
> এমনভাবে Fit হবে, যেন Factory থেকেই গাড়ির অংশ ছিল।

**Checklist:**
- ✓ **Factory-Like Appearance**
- ✓ **Dashboard-এ কোনো কাটাছেঁড়া লাগবে না**
- ✓ **কোনো Drilling লাগবে না**
- ✓ **শক্তভাবে বসে থাকবে**
- ✓ **Interior-এর সাথে মানানসই Design**

**Closing line (কমলা highlight):**
> দেখতেও Factory-এর, অনুভূতিতেও Factory-এর।

**Before/After labels:**
- Without Armrest → chips: `Empty` · `Basic` · `Less Organized`
- With DriveZen Armrest → chips: `Premium` · `Comfortable` · `Organized`

---

### 6. "INSTALLS IN MINUTES" — VIDEO SECTION
**Layout:** বাঁয়ে ভিডিও থাম্বনেইল (play button overlay, ক্লিকে modal/lightbox-এ চালু হবে), ডানে টেক্সট। Mobile-এ ভিডিও উপরে।

**Heading:**
> Installs In **Minutes**

**Sub-text:**
> দেখুন কত সহজে DriveZen Armrest আপনার Toyota Aqua-তে বসে যায়।

**Feature chips (আইকনসহ):**
- 🔧 No Special Tools Required
- ⚡ Quick Setup
- 👍 Beginner Friendly

> ভিডিওর জন্য placeholder thumbnail + একটা embed placeholder (`<!-- video embed here -->`) রাখবে।

---

### 7. TESTIMONIALS / "WHAT AQUA OWNERS SAY" (Placeholder)
**Layout:** ৩টি review কার্ড (mobile-এ swipeable carousel বা stacked)। প্রতিটিতে গোল avatar (placeholder), নাম, star rating, ছোট quote। নিচে একটা customer photo গ্যালারি strip ("Join Hundreds Of Aqua Owners Across Bangladesh")।

> **সব placeholder** — আমি পরে আসল নাম/ছবি/রিভিউ বসাবো। নিচের স্যাম্পল টেক্সট ব্যবহার করো:

**Review 1 — Mahmudul Hasan** ⭐⭐⭐⭐⭐
> "Driving comfort has improved so much. Storage space is a huge bonus!"

**Review 2 — Sadia Rahman** ⭐⭐⭐⭐⭐
> "Looks premium and fits perfectly. Feels like it came with the car from factory."

**Review 3 — Rashed Ahmed** ⭐⭐⭐⭐⭐
> "Installation was super easy. Quality is excellent. Highly recommended!"

**Photo strip heading:** Join Hundreds Of Aqua Owners Across Bangladesh
> ৫-৬টি placeholder customer photo thumbnail (grid/scroll)।

---

### 8. WHY CHOOSE + EVERYTHING INCLUDED
**Layout:** দুই কলাম (mobile-এ stacked)।
- **বাম:** "Why Aqua Owners Choose DriveZen" — ৪টি ছোট আইকন-কার্ড।
- **ডান (কমলা ব্যাকগ্রাউন্ড ব্লক):** "Everything Included" — checklist + একটা প্রোডাক্ট বক্স/প্যাকেজিং ছবি।

**Why Choose — ৪ পয়েন্ট:**
- 🛠 **Perfect Aqua Fit** — Toyota Aqua-এর জন্য বিশেষভাবে তৈরি।
- 🛡 **Quality Tested** — মজবুত ও টেকসই।
- 💰 **Cash On Delivery** — পণ্য হাতে পেয়ে টাকা দিন।
- 🚚 **Fast Nationwide Delivery** — সারা বাংলাদেশে ডেলিভারি।

**Everything Included — checklist:**
- ✓ Premium Aqua Armrest
- ✓ Hidden Storage Compartment
- ✓ Installation Guide
- ✓ Delivery Support
- ✓ Cash On Delivery

---

### 9. FAQ SECTION
**Layout:** Accordion (একটা ক্লিকে expand/collapse, smooth height transition + chevron rotate)। Center, max-width সীমিত।

**Heading:** Frequently Asked Questions

**Questions (accordion — placeholder উত্তর, পরে বদলাবো):**
1. **এটা কি সব Toyota Aqua মডেলে ফিট হয়?**
   হ্যাঁ, DriveZen Armrest Toyota Aqua-এর জন্য বিশেষভাবে ডিজাইন করা এবং সব সাধারণ Aqua মডেলে ফিট হয়।
2. **ডেলিভারিতে কত সময় লাগে?**
   সাধারণত সারা বাংলাদেশে ২-৪ কর্মদিবসের মধ্যে ডেলিভারি হয়।
3. **Installation কি কঠিন?**
   না, কোনো টুল বা ড্রিলিং ছাড়াই কয়েক মিনিটে নিজে ইনস্টল করতে পারবেন।
4. **Cash On Delivery আছে কি?**
   হ্যাঁ, পণ্য হাতে পেয়ে টাকা পরিশোধ করতে পারবেন।
5. **Warranty আছে কি?**
   হ্যাঁ, প্রোডাক্টে কোয়ালিটি গ্যারান্টি সহ ৭ দিনের মানি-ব্যাক গ্যারান্টি আছে।

---

### 10. FINAL CTA SECTION
**Layout:** Dark background, center টেক্সট + বড় কমলা বাটন। পাশে/ব্যাকগ্রাউন্ডে Toyota Aqua গাড়ির ছবি (রেফারেন্সের মতো)। "Limited Stock Available" badge।

**Heading:**
> আপনার Aqua-টা এই Upgrade-এর **যোগ্য**

**Body:**
> প্রতিদিন Drive করেন।
> প্রতিদিন এই Interior-এই বসেন।
> প্রতিদিন এই Comfort-টাই অনুভব করেন।
> তাহলে কেন এমন একটা Upgrade বাদ রাখবেন, যা প্রতিটি Drive-কে আরও Comfortable ও Premium করে তুলতে পারে?

**Button:**
- 🟧 **আজই Aqua Upgrade করুন**

**Trust chips:**
- ⭐ Aqua Owner-দের পছন্দের Upgrade
- ✓ Cash On Delivery
- ✓ Fast Delivery
- ✓ Perfect Aqua Fit
- ⚠️ **Limited Stock Available** (কমলা/highlight badge)

---

### 11. FOOTER
- Dark background। বাঁয়ে DriveZen লোগো + এক লাইন ট্যাগলাইন।
- যোগাযোগ: **Facebook** · **WhatsApp** · **Phone** · **Email** (আইকনসহ, placeholder link/number)।
- নিচে copyright: `© 2026 DriveZen. All rights reserved.`

---

## 📱 RESPONSIVE RULES (MOBILE FIRST — বাধ্যতামূলক)

- **Base স্টাইল = মোবাইল (≤480px)।** সব সেকশন single-column, বড় টাচ-টার্গেট বাটন (min-height 48px), font readable।
- Breakpoints: `480px` (large phone), `768px` (tablet), `1024px+` (desktop)। ছোট থেকে বড়র দিকে `min-width` মিডিয়া কুয়েরি।
- Grid: mobile ১ কলাম → tablet ২ কলাম → desktop ৩/৪ কলাম।
- Hero, gallery, testimonials — মোবাইলে swipeable / horizontal scroll।
- ছবি: `max-width:100%`, lazy-load, aspect-ratio ঠিক রাখবে।
- কোনো horizontal overflow যেন না থাকে। Sticky navbar মোবাইলে drawer।
- Tap-friendly accordion ও before/after slider (touch events সাপোর্ট)।

---

## ✅ FINAL CHECKLIST (কাজ শেষে যাচাই)

- [ ] পুরনো ডিজাইন/CSS সম্পূর্ণ বাদ, নতুন UI বসানো হয়েছে।
- [ ] টেক স্ট্যাক অপরিবর্তিত (নতুন প্রজেক্ট বানানো হয়নি)।
- [ ] সব ১১টি সেকশন রেফারেন্স ইমেজ অনুযায়ী ক্রমে আছে।
- [ ] সব বাংলা/English কন্টেন্ট হুবহু বসানো হয়েছে।
- [ ] Dark + orange color system প্রয়োগ হয়েছে।
- [ ] মোবাইলে (360–480px) সব সেকশন নিখুঁত, কোনো overflow নেই।
- [ ] Smooth scroll-reveal + hover + button transition আছে।
- [ ] Before/after slider ও FAQ accordion touch-এ কাজ করে।
- [ ] ছবি/রিভিউ সব placeholder, সহজে বদলানো যায়।
- [ ] বাংলা ফন্ট (Hind Siliguri / Noto Sans Bengali) load হয়েছে।
- [ ] Lighthouse mobile performance OK (transform/opacity animation, lazy image)।

---

## 📝 নোট (আমার জন্য / পরে বদলাবো)
- Stats সংখ্যা (500+, 1000+, 4.9/5), রিভিউয়ার নাম-ছবি, ভিডিও লিংক, ফোন/WhatsApp/Email, FAQ উত্তর — সব **placeholder**। পরে আসল ডেটা বসাবো।
- রেফারেন্স ইমেজটি আলাদাভাবে Claude Code-কে দেওয়া হবে (visual direction হিসেবে)।
