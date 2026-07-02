
<img width="1920" height="945" alt="HOME" src="https://github.com/user-attachments/assets/9606563d-3b7d-48da-81ba-b5f62b4911b0" />

<img width="1920" height="945" alt="HOUSE" src="https://github.com/user-attachments/assets/b5774a31-d09f-4687-abd9-3050368dd19f" />

---

# WhyBuilder

**A rental listings platform for Nairobi. Landlords pay. Renters browse. Every listing is verified before it goes live.**

---

## What this is

WhyBuilder is a subscription-based platform where Nairobi landlords can list rental properties. Renters browse verified listings without worrying about scams or fake postings.

Every property goes through an admin review before renters can see it. No listing goes live without being checked.

---

## Why this exists

Finding a rental in Nairobi is a trust problem. Most platforms let anyone post anything. Renters waste time on fake listings. Landlords with real properties get lost in the noise.

WhyBuilder solves that by verifying every listing before it's visible to renters.

---

## What it does

- Landlords submit properties with photos, price, location, and details
- Admin reviews each submission in a verification queue
- Approved listings appear on the public browse page
- Renters filter by area, price, noise level, and amenities
- Currency toggle: KES / USD
- Dark/light theme

---

## Tech Stack

**Backend:** Django + DRF, PostgreSQL, JWT auth  
**Frontend:** React + TypeScript, Vite, Tailwind CSS

---

## Who it's for

- **Landlords** with 1–20 units who currently list on WhatsApp or Facebook and want a professional, verified presence
- **Renters** who want to see real properties without wasting time on fakes

---

## Current Status

Working MVP. Pre-launch. Solo project.

**Done:**
- Property CRUD with landlord ownership
- JWT auth with logout (token blacklisting)
- Admin verification queue
- Currency conversion
- Dark/light theme

**Next:**
- Landlord subscription billing
- Admin dashboard expansion
- Production deployment

---

## Setup

**Backend:**
```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
