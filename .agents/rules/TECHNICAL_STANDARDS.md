# Technical & Deployment Architecture Standards

## ⚡ Framework & Performance Budget

- **Core Framework:** Astro 4.15+ (Static Site Generation / SSG).
- **Styling:** Tailwind CSS 3.4+ with custom holiday palette tokens (`tailwind.config.mjs`).
- **Interactive Islands:** React 18 (`@astrojs/react`) hydrated with `client:load` for immediate widgets or `client:visible` for below-fold tools.
- **Core Web Vitals Budget:**
  - Cumulative Layout Shift (CLS): **0.00** (enforce fixed container minimum heights, skeleton states, explicit image aspect ratios).
  - First Contentful Paint (FCP): **< 0.6s**
  - Largest Contentful Paint (LCP): **< 1.0s**
  - Zero-JS Static Fallback: Every interactive calculator and scheduler table renders accessible semantic HTML fallback tables before JS hydration.

---

## 🗺️ Sitemap & SEO Indexing

- **Master Sitemap Index:** `/sitemap-index.xml`
- **Segmented Sub-Sitemaps:**
  - `/sitemap-services.xml` (Staff portraits, resident/family, Santa experience, unit sessions)
  - `/sitemap-locations.xml` (Dallas Regional, Fort Worth Senior Living, Plano Specialty, Arlington Pavilion)
  - `/sitemap-tools.xml` (Interactive Scheduler, Package Calculator, Wardrobe Matcher, Prep Checklist)
- **Robots Directives:** `/robots.txt` disallowing query parameter noise (`/*?*`) to preserve crawl equity.

---

## 🌐 Schema.org & Algorithmic Insulation

- **Dual QDF Timestamps:** Every page JSON-LD block must render valid `datePublished` and `dateModified` in ISO 8601 format.
- **Linked Data Graph Nodes:**
  - `MedicalBusiness` (Foursquare Healthcare parent entity)
  - `PhotographyBusiness` & `Event` (Christmas Portrait Session schedule per campus)
  - `Service` (Portrait packages & digital galleries)
  - `FAQPage` (Pre-session prep, dress codes, mobility accommodations)
  - `BreadcrumbList` (Clean crawl hierarchy)

---

## 🚀 Build & Deployment Commands

```bash
# Install dependencies
npm install

# Build static bundle
npm run build

# Deploy to Netlify Production (Team THINKMENTS)
npx netlify deploy --prod --dir=dist
```
