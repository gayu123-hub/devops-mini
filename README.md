# MediCare – Smart Doctor Appointment System

A modern, responsive, single-page interactive healthcare application built with clean HTML5, CSS3, and modern JavaScript.

---

## 🌟 Key Features

### 1. Modern Healthcare UI & Aesthetics
- **Curated Medical Palette:** White, light blue, brand teal, cyan, and deep navy blue.
- **Typography:** Modern Google Fonts (`Plus Jakarta Sans` for body and `Outfit` for display headings).
- **Smooth Animations & Micro-interactions:** Glassmorphism navigation bar, hover lifts, pulse availability badges, and animated stats counters.
- **Accessibility:** High-contrast text, clear visual hierarchy, aria labels, and mobile-friendly touch targets.

### 2. Sticky Navigation Bar
- Dynamic brand logo with stethoscope badge.
- Navigation links with scroll-spy active indicators: *Home*, *Services*, *Find Doctors*, *My Appointments*, *About*, *Testimonials*, *Contact*.
- Real-time counter badge showing active confirmed appointments.
- Prominent "Book Appointment" CTA button.
- Mobile-responsive sliding drawer menu.

### 3. Hero Section
- Bold headline: *"Your Health, Our Priority"*.
- Engaging subtitle and dual CTA buttons.
- Animated live counter statistics: **50+ Verified Doctors**, **10+ Medical Specialities**, **1000+ Happy Patients**.
- Professional healthcare hero portrait with floating live availability indicator and rating cards.

### 4. Interactive Specialities Section
- 6 medical specialities: **Cardiology**, **Dermatology**, **Pediatrics**, **Neurology**, **Orthopedics**, **General Medicine**.
- Interactive cards with doctor count pills.
- **Click-to-Filter:** Clicking any speciality automatically scrolls to the doctor search section and filters the doctor directory.

### 5. Search & Filter Doctors
- **Search by doctor name, hospital, or qualification keyword** in real time.
- **Filter by Specialization** via dropdown.
- **Filter by Availability** pills (*All Availability*, *Available Today*, *Available Tomorrow*).
- **Sort options:** Highest Rated, Most Experienced, Fee (Low to High), Fee (High to Low).
- Real-time results count and informative empty state with a 1-click filter reset.

### 6. Doctor Directory Cards
- High-resolution verified doctor avatars with SVG fallback.
- Speciality badges, degrees, hospital affiliations, years of experience, and consultation fees.
- Rating stars and verified patient review counts.
- Available time slots chip preview with status.
- **"Profile" button:** Opens detailed modal with doctor biography, credentials, hospital affiliation, and languages.
- **"Book Now" button:** Opens the appointment booking modal with this doctor pre-selected.

### 7. Interactive 3-Step Appointment Booking Modal
- **Step 1: Doctor & Schedule**
  - Interactive medical speciality & doctor selection.
  - Date picker with past date prevention (minimum date locked to current date).
  - Dynamic time slot buttons with availability status (*Available*, *Selected*, *Booked*).
  - Real-time duplicate booking prevention: disables slots already booked for that doctor and date.
- **Step 2: Patient Information**
  - Full Name, Age (1–120 validation), Gender selection.
  - Phone number validation (8–18 digits/format) and email format validation.
  - Reason for visit.
- **Step 3: Booking Summary & Final Confirmation**
  - Complete review of doctor, clinic, date/time, patient info, and fee breakdown.
  - Confirmation button generates a unique Appointment ID (e.g., `#MED-849201`).
- **Instant Digital Appointment Pass Modal:**
  - Animated checkmark, unique appointment ID badge, hospital check-in details.
  - Print / Save Slip button (with dedicated `@media print` clean layout).

### 8. My Appointments (Persistent Patient Portal)
- Stored and persisted in `localStorage` (`medicare_appointments`).
- Preloaded with initial sample appointments for immediate demonstration.
- Status filters: **All**, **Upcoming (Confirmed)**, and **Cancelled**.
- View details / receipt pass modal.
- Interactive cancellation workflow with confirmation modal dialog.
- 1-click rebooking action.

### 9. Why Choose Us, Testimonials & Contact
- **4 Feature Cards:** Experienced Doctors, Easy Online Booking, Secure Patient Information, Quality Healthcare Services.
- **Patient Testimonials:** Realistic verified patient reviews with photos and star ratings.
- **Hospital Information:** Address, contact numbers, email, working hours, 24/7 trauma & cardiac hotline banner.
- **Working Contact Form:** Complete with field validation, animated loading spinner, and toast notifications.
- **Health Bulletin Newsletter:** Form with instant user feedback.

---

## 📁 File Structure

```
├── index.html           # Main semantic single-page layout
├── css/
│   └── styles.css       # Complete modern CSS design system & media queries
├── js/
│   ├── doctors.js       # Doctors, specialities, testimonials & initial sample data
│   └── app.js           # Core state management, booking logic, validation, & UI handlers
└── README.md            # Project documentation
```

---

## 🚀 Running the Project

Because the project is built with standard HTML5, CSS3, and ES6 JavaScript:
1. Double-click [index.html](file:///c:/Users/gayat/New%20folder%20(2)/index.html) to open directly in any modern browser (Chrome, Edge, Firefox, Safari).
2. Or serve via any local static server (e.g., VS Code Live Server, Python `python -m http.server 8000`, or Node `npx serve .`).
