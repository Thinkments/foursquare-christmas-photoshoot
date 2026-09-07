# 🎄 Foursquare Healthcare Annual Christmas Photo Shoot — Website & Scheduler

[![Production Build](https://img.shields.io/badge/build-passing-brightgreen.svg)]()
[![Netlify Status](https://img.shields.io/badge/deployed-netlify-00ad9f.svg)]()
[![Framework](https://img.shields.io/badge/Astro-4.15-BC52EE.svg)]()
[![React](https://img.shields.io/badge/React-18.3-61DAFB.svg)]()
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)]()

Production-grade, high-performance static website and interactive session scheduling engine for the **Foursquare Healthcare Annual Christmas Photo Shoot**, engineered under the **Antigravity Project Specification Standard**.

Built for front-line nurses (RN/LVN/CNA), physicians, staff, residents, visiting families, and clinical units across North Texas DFW facilities.

---

## 🌟 Key Capabilities & Features

1. **Interactive Multi-Campus Scheduler (`/schedule`)**:
   - Dynamic campus picker (Dallas Regional, Fort Worth Senior Living & Rehab, Plano Specialty, Arlington Emergency Pavilion).
   - Session types: 15-min Shift Express, Resident Multi-Gen Family, Santa Experience, Unit Team Group.
   - Real-time time slot selector, participant headcount, accessibility accommodation checkboxes.
   - Instant confirmation with booking code and `.ics` Apple/Google Calendar export.

2. **Holiday Photo Package & Print Calculator (`/calculator`)**:
   - Real-time cost estimator for digital packages, holiday greeting cards, framed canvases, and staff/resident discounts.
   - Zero-JS static HTML pricing table fallback for crawlability.

3. **Wardrobe & Studio Backdrop Matcher (`/style-guide`)**:
   - Visual color palette selector matching outfits (Festive Knits, Classic Velvet, Winter Whites, Holiday Scrubs) against 4 holiday backdrops.

4. **Session Prep & Accessibility Checklist (`/prep-checklist`)**:
   - Interactive checklist with clinical sanitization guidelines, arrival badges, and printable view.

5. **Global `Ctrl+K` Command Search Palette**:
   - Instant keyboard-driven fuzzy search across all services, campus dates, FAQs, and calculators.

6. **PWA Offline Shell & Web App Manifest**:
   - Installable on iOS/Android and desktop with offline support.

7. **Algorithmic Insulation & Technical SEO**:
   - Bi-directional internal linking mesh across service hubs and location pages.
   - Structured Schema.org JSON-LD graph nodes (`MedicalBusiness`, `PhotographyBusiness`, `Event`, `Service`, `FAQPage`, `BreadcrumbList`).
   - Dual QDF timestamps (`datePublished` and `dateModified`).

---

## 📁 Repository Structure

```
foursquare-christmas-photoshoot/
├── .agents/
│   ├── rules/
│   │   ├── BUSINESS_SPEC.md        # Corporate background, E-E-A-T, and personas
│   │   ├── BRAND_GUIDELINES.md     # Color palette, logos, and studio standards
│   │   └── TECHNICAL_STANDARDS.md  # Astro/React/Tailwind stack & CWV rules
│   └── mcp_config.json             # DevTools & GitHub MCP config
├── public/
│   ├── manifest.webmanifest        # PWA manifest
│   ├── sw.js                       # Service worker
│   └── icons/                      # App and holiday icons
├── src/
│   ├── components/
│   │   ├── Header.astro            # Festive header with navigation & Ctrl+K CTA
│   │   ├── Footer.astro            # Bi-directional linking mesh & contact info
│   │   ├── CommandPalette.tsx      # React Ctrl+K search dialog
│   │   ├── SchedulerWizard.tsx     # React interactive booking flow
│   │   ├── PackageCalculator.tsx   # React real-time pricing calculator
│   │   ├── WardrobeMatcher.tsx     # React backdrop & outfit matcher
│   │   ├── PrepChecklist.tsx       # React interactive checklist
│   │   └── CountdownTimer.tsx      # Festive holiday launch countdown
│   ├── layouts/
│   │   └── Layout.astro            # Base layout with Schema.org & Meta tags
│   ├── pages/
│   │   ├── index.astro             # Homepage with hero, services, campuses, FAQ
│   │   ├── schedule.astro          # Dedicated booking page
│   │   ├── calculator.astro        # Pricing calculator page
│   │   ├── style-guide.astro       # Backdrop & wardrobe styling
│   │   ├── prep-checklist.astro    # Preparation guidelines & checklist
│   │   ├── services/
│   │   │   ├── staff-portraits.astro
│   │   │   ├── resident-family.astro
│   │   │   ├── santa-experience.astro
│   │   │   └── department-teams.astro
│   │   ├── locations/
│   │   │   ├── dallas-regional.astro
│   │   │   ├── fort-worth-senior-living.astro
│   │   │   ├── plano-specialty.astro
│   │   │   └── arlington-pavilion.astro
│   │   ├── robots.txt.ts           # Robots directives
│   │   ├── sitemap-index.xml.ts    # Segmented sitemap index
│   │   ├── sitemap-services.xml.ts
│   │   ├── sitemap-locations.xml.ts
│   │   └── sitemap-tools.xml.ts
│   └── styles/
│       └── global.css              # Custom holiday design tokens & utilities
├── astro.config.mjs
├── tailwind.config.mjs
├── package.json
└── netlify.toml
```

---

## 🚀 Development & Build

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build production static bundle
npm run build
```

---

## 🌐 Deployment

Configured for continuous deployment via **Netlify** under team **THINKMENTS** (`spicer@thinkments.com`) linked to GitHub repository `Thinkments/foursquare-christmas-photoshoot`.
