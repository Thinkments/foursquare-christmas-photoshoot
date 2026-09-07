# Foursquare Healthcare — Business Specification & E-E-A-T Standards

## 🏥 Corporate Overview & Purpose
**Client:** Foursquare Healthcare (Texas Regional Healthcare Network & Senior Rehabilitation Communities)  
**Initiative:** Annual Christmas & Holiday Resident Portrait Experience & Shift Scheduler  
**Parent Organization:** Foursquare Healthcare Network (Dallas–Fort Worth, Texas)  
**Program Purpose:** Dedicated holiday portrait booking and automated shift scheduling platform serving residents of Foursquare senior living, rehabilitation, and long-term care communities, their visiting families, and facility clinical staff.

---

## 🎯 The Core Business Problem & Operational Context

### The Previous Legacy System (Sign-Up Sheet at Reception):
Historically, photo shoot scheduling was handled via a physical paper sign-up sheet placed at the facility receptionist desk:
1. **15-Minute Rapid Slots:** The hired professional photographer needs to photograph families back-to-back in 15-minute increments.
2. **High No-Show & Confusion Rate:** Without automated SMS/email reminders, visiting family members frequently forget their scheduled time or get stuck in traffic.
3. **Manual Rescheduling Bottleneck:** When conflicts arise, family members must call the receptionist, who must manually erase/scratch out paper slots and rewrite names, leading to accidental double-bookings.
4. **Handoff Breakdown:** On the day of the shoot, the paper sheet often fails to reach the **Activity Coordinator** (who needs to prep residents in their rooms and coordinate wheelchair transport) and the **Photographer** (who needs the live shooting roster).

### The Automated Solution Architecture:
1. **Automated Notification Engine:** Dispatches instant confirmation, 24-hour reminder, and 2-hour SMS/email alert containing arrival instructions.
2. **Self-Service 1-Click Rescheduling:** Families can open their reservation pass on mobile, view only currently available open slots, and reschedule instantly without calling the receptionist.
3. **Activity Coordinator & Photographer Live Day-of Roster:** Real-time digital dashboard and printable run-sheet displaying resident name, room number, family contact, wheelchair/mobility needs, and photo shoot check-in status.
4. **Family Member Access & Privacy:** Secured booking flow designed for resident families (passcode/room verification), keeping resident information private.
5. **Platform Flexibility (Custom Engine + Squarespace/Acuity Support):** Production-ready built-in scheduler with local storage and database sync, plus native support for embedding or syncing with Squarespace Scheduling (Acuity Scheduling).

---

## 🏛️ E-E-A-T Authority & Healthcare Credentials
- **Licensing & Regulatory Compliance:** Facilities operate under Texas Health and Human Services Commission (HHSC) licensing standards for Skilled Nursing Facilities (SNF), Assisted Living, and Long-Term Rehabilitation.
- **Clinical Safety Protocols:** Infection control compliance (CDC and Texas HHS sanitization standards) for holiday props, HEPA air purification in studio rooms, and contactless check-in.
- **Universal Accessibility:** 100% ADA compliant photo studio staging, zero-threshold wheelchair entry, transfer-assist staging benches, and sensory-friendly/low-stimulation session slots for memory care residents.
- **Deliverables & Guarantees:** 48-hour digital proof delivery, high-resolution print releases, and hospital badge / holiday card formatting for all participating employees and families.

---

## 📍 Facility Locations & Studio Hubs

1. **Dallas Regional Medical Center & Rehab**
   - **Campus Address:** 1011 N Galloway Ave, Mesquite / Dallas, TX 75149
   - **Google Place ID:** `ChIJ7V6N26GZToYRFX_L3Z7R1XU`
   - **Studio Staging:** Executive Boardroom & Winter Conservatory (Ground Floor, West Wing)
   - **Studio Lead:** Director of Life Enrichment & Activity Coordinator

2. **Fort Worth Senior Living & Rehabilitation Center**
   - **Campus Address:** 2800 W 7th St, Fort Worth, TX 76107
   - **Google Place ID:** `ChIJg22Z16-GTYYR2xUv1vE8m6Q`
   - **Studio Staging:** Grand Fireside Hearth & Memory Care Garden Lounge
   - **Specialization:** Wheelchair-accessible family portraits & peaceful multi-generational staging

3. **Plano Specialty Hospital & Senior Rehab**
   - **Campus Address:** 3801 W 15th St, Plano, TX 75075
   - **Google Place ID:** `ChIJhX1Q0i8UTYYR9kU4lW7uE5U`
   - **Studio Staging:** Medical Arts Pavilion & Winter Garden Atrium

4. **Arlington Emergency Pavilion & Living Center**
   - **Campus Address:** 800 W Randol Mill Rd, Arlington, TX 76012
   - **Google Place ID:** `ChIJzQ1Y7r2UTYYR1vE9m4P2Z8Q`
   - **Studio Staging:** Community Education Suite & North Pole Workshop

---

## 👥 Audience Personas & Journey Mapping

### Persona 1: Resident Family Member (Linda, Daughter of Resident Harold — Room 204B)
- **Journey:** Linda receives an email/SMS link from the facility. She enters Harold's room number, picks a 15-minute slot on Saturday at 10:15 AM, and checks "Wheelchair transfer needed".
- **Reschedule Flow:** When Linda's daughter's flight is delayed, Linda clicks the "Manage Appointment" link in her SMS, sees Sunday at 11:30 AM is open, and switches slots in 10 seconds. Harold's room notification and the Activity Coordinator's sheet update automatically.

### Persona 2: Facility Activity Coordinator (Brenda, Life Enrichment Director)
- **Journey:** On shoot morning, Brenda opens the **Activity Coordinator Roster** on her tablet. She filters by "Today's Schedule" and sees 24 booked slots in order. She knows exactly which residents to help dress and transport to the fireside studio 10 minutes prior to their slot.

### Persona 3: Contract Professional Photographer (Marcus Photography)
- **Journey:** Marcus arrives at 8:30 AM, sets up his softboxes in the Fireside Hearth, and opens the Photographer Check-In screen. As families arrive, he taps "Checked In" and captures 15-minute back-to-back sets with zero lag or missing families.
