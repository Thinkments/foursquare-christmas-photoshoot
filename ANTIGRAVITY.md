# 🎄 Antigravity Workspace: Foursquare Christmas Photo Shoot Scheduler

## 1. Project Overview
`foursquare-christmas-photoshoot` is the dedicated workspace and production web application for the **Foursquare Healthcare 2026 Christmas Photo Tour**. It replaces paper receptionist sign-up clipboards across 12 facilities and 13 shoot sessions with a real-time, automated 10-minute slot scheduling engine.

---

## 2. Production & Repository Details
* **Production URL**: [https://foursquare-christmas-photoshoot.netlify.app](https://foursquare-christmas-photoshoot.netlify.app)
* **GitHub Repository**: [https://github.com/Thinkments/foursquare-christmas-photoshoot](https://github.com/Thinkments/foursquare-christmas-photoshoot)
* **Workspace Configuration**: [`foursquare-christmas-photoshoot.code-workspace`](file:///C:/Users/Corey/.gemini/antigravity-ide/scratch/foursquare-christmas-photoshoot.code-workspace)
* **Project Directory**: [`foursquare-christmas-photoshoot`](file:///C:/Users/Corey/.gemini/antigravity-ide/scratch/foursquare-christmas-photoshoot)

---

## 3. Operational Schedule & Business Rules
* **10-Minute Rapid Slot Increments**: Rapid back-to-back family portrait sessions (10:00 AM – 7:00 PM).
* **Morning Session**: 10:00 AM – 12:50 PM.
* **12:00 PM Locked Slot**: Reserved exclusively for the **Department Head Group Picture** (locked from public/family sign-up).
* **1:00 PM – 1:45 PM Studio Reset**: Photographer meal break and backdrop staging reset.
* **Afternoon & Evening Session**: 1:45 PM – 6:55 PM (sessions conclude at 7:00 PM).
* **1-Click Self-Service Reschedule Link**: Generated automatically upon booking confirmation. Families can switch slots without calling the facility reception desk.
* **Staff Day-of Roster**: Real-time run sheet showing resident room numbers for floor transport and "Copy Link" buttons for receptionists.

---

## 4. The 13 Facility Shoot Pages & Routes
1. **HML** – Hillside Medical Lodge (Beeville, TX) • Nov 5 • [`/hml`](file:///C:/Users/Corey/.gemini/antigravity-ide/scratch/foursquare-christmas-photoshoot/src/pages/hml.astro)
2. **WNR** – Whitney Nursing & Rehab (Whitney, TX) • Nov 6 • [`/wnr`](file:///C:/Users/Corey/.gemini/antigravity-ide/scratch/foursquare-christmas-photoshoot/src/pages/wnr.astro)
3. **CML** – Cheyenne Medical Lodge (Colorado City, TX) • Nov 9 (Day 1) • [`/cml`](file:///C:/Users/Corey/.gemini/antigravity-ide/scratch/foursquare-christmas-photoshoot/src/pages/cml.astro)
4. **CML Day 2** – Cheyenne Medical Lodge • Nov 10 (Day 2) • [`/cml-day2`](file:///C:/Users/Corey/.gemini/antigravity-ide/scratch/foursquare-christmas-photoshoot/src/pages/cml-day2.astro)
5. **PML** – Princeton Medical Lodge (Princeton, TX) • Nov 12 • [`/pml`](file:///C:/Users/Corey/.gemini/antigravity-ide/scratch/foursquare-christmas-photoshoot/src/pages/pml.astro)
6. **FHR** – Farmersville Health & Rehab (Farmersville, TX) • Nov 13 • [`/fhr`](file:///C:/Users/Corey/.gemini/antigravity-ide/scratch/foursquare-christmas-photoshoot/src/pages/fhr.astro)
7. **LML** – Lexington Medical Lodge (Farmersville, TX) • Nov 17 • [`/lml`](file:///C:/Users/Corey/.gemini/antigravity-ide/scratch/foursquare-christmas-photoshoot/src/pages/lml.astro)
8. **TRAY** – Traymore at Park Cities (Dallas, TX) • Nov 24 • [`/tray`](file:///C:/Users/Corey/.gemini/antigravity-ide/scratch/foursquare-christmas-photoshoot/src/pages/tray.astro)
9. **MML** – Midland Medical Lodge (Midland, TX) • Nov 30 • [`/mml`](file:///C:/Users/Corey/.gemini/antigravity-ide/scratch/foursquare-christmas-photoshoot/src/pages/mml.astro)
10. **MMR** – Madison Medical Resort (Odessa, TX) • Dec 1 • [`/mmr`](file:///C:/Users/Corey/.gemini/antigravity-ide/scratch/foursquare-christmas-photoshoot/src/pages/mmr.astro)
11. **AML** – Ashton Medical Lodge (Midland, TX) • Dec 2 • [`/aml`](file:///C:/Users/Corey/.gemini/antigravity-ide/scratch/foursquare-christmas-photoshoot/src/pages/aml.astro)
12. **SML** – Sheridan Medical Lodge (Burleson, TX) • Dec 8 • [`/sml`](file:///C:/Users/Corey/.gemini/antigravity-ide/scratch/foursquare-christmas-photoshoot/src/pages/sml.astro)
13. **SCWF** – Senior Care Wichita Falls (Wichita Falls, TX) • Dec 9 • [`/scwf`](file:///C:/Users/Corey/.gemini/antigravity-ide/scratch/foursquare-christmas-photoshoot/src/pages/scwf.astro)

---

## 5. Development & Deployment Commands
```bash
# Start local development server (Astro + Tailwind + React)
npm run dev

# Build production static bundle (dist/)
npm run build

# Deploy directly to Netlify production
npx netlify deploy --prod --dir=dist
```
