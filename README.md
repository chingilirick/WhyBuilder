# WhyBuilder

<img width="1920" height="945" alt="HOME" src="https://github.com/user-attachments/assets/9606563d-3b7d-48da-81ba-b5f62b4911b0" />
**Decision infrastructure for the Nairobi rental market.**

<img width="1920" height="945" alt="HOUSE" src="https://github.com/user-attachments/assets/6377b209-c0d6-433b-a190-dede402ba85d" />
---

## Problem Statement

Finding a rental home in Nairobi is a trust problem disguised as a search problem.

Existing listing platforms optimize for volume — as many photos and price tags as possible — but they don't answer the questions that actually determine whether a renter moves in with confidence:

- Is this listing real, or is the landlord unreachable/unverified?
- Is the area safe and quiet enough for how I actually live?
- Will I waste a viewing trip on a property that was never available?

The result is a market where renters over-view, under-trust, and frequently get burned by stale or fabricated listings — and where legitimate landlords have no reliable way to signal that they're the real deal.

## Project Definition

WhyBuilder is a **landlord-first, verification-driven rental listings platform** for Nairobi. Every property listed is reviewed by an administrator before it goes live to renters — no listing reaches the public browse page without passing through a verification queue.

**What WhyBuilder is:**
- A trust layer between landlords and renters, enforced by an actual backend verification workflow (not a cosmetic badge)
- A subscription-based platform for landlords, who are the paying customer
- A focused MVP: one core loop — list, verify, browse — done properly

**What WhyBuilder deliberately is not:**
- Not a renter-matching or lifestyle-quiz product. Earlier iterations explored decision-quiz and lifestyle-matching features; these were cut in favor of a narrower, more defensible niche: verified listings, not personality-matched housing.
- Not a general classifieds board. Every listing has an owning landlord account and a real moderation step.

This scope narrowing was a deliberate product decision, not a missing feature — the platform is built to do one thing (verified rental discovery) well, rather than many things adequately.

## Core Features

- **Verified listing pipeline** — landlords submit properties; an administrator reviews and approves or rejects each one via a dedicated verification queue before it's publicly visible
- **Role-based access** — distinct renter, landlord, and administrator account types, each with their own permitted actions enforced at the API level (not just hidden in the UI)
- **JWT authentication** — token-based auth with refresh token blacklisting on logout
- **Landlord dashboard** — manage submitted listings and track their verification status
- **Live currency conversion** — KES/USD toggle using a live exchange rate (fetched and cached hourly), not a hardcoded static rate
- **Property filtering** — by area, price range, noise level, and amenities
- **Dark/light theme** — full theme system with persisted user preference

## Tech Stack

**Backend**
- Django 6.0 + Django REST Framework
- PostgreSQL
- JWT authentication via `djangorestframework-simplejwt`, with token blacklisting
- `django-filter` for property search/filtering

**Frontend**
- React 19 + TypeScript
- Vite
- Tailwind CSS v4, with a custom CSS-variable-based theme system (light/dark)
- React Router v7

## Architecture

```
whybuilder/
├── properties/         Django app — listings, verification workflow, permissions
├── users/               Django app — authentication, JWT issuance, account types
├── frontend/             React + TypeScript application
│   ├── src/app/
│   │   ├── pages/         Route-level views (Home, Browse, AdminDashboard, etc.)
│   │   ├── components/    Shared UI (Header, Footer, ProtectedRoute, etc.)
│   │   └── routes.tsx      Route definitions and role-based route guards
│   └── src/lib/            API client, auth helpers, typed request layer
└── whybuilder_api/       Django project settings and root URL configuration
```

**Access control**: property update/delete endpoints are restricted to the owning landlord or an administrator (`IsLandlordOwner` / `IsAdministrator` permission classes) — not just gated by "is logged in."

## Getting Started

### Backend

```bash
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Create a `.env` file in the project root (see `whybuilder_api/settings.py.example` for the required variables):

```
SECRET_KEY=your-generated-secret-key
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
DB_PASSWORD=your-db-password
```

Generate a secret key:

```bash
python3 -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
```

Then:

```bash
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

## Project Status

WhyBuilder is an actively developed, pre-launch MVP. Current focus areas:

- [x] Core listing CRUD with landlord ownership enforcement
- [x] JWT authentication with secure logout (token blacklisting)
- [x] Admin verification queue (approve/reject pending listings)
- [x] Live currency conversion
- [ ] Admin dashboard expansion (landlord management, verification history)
- [ ] Landlord subscription billing
- [ ] Production deployment (WSGI/ASGI server, managed Postgres, static file hosting)

This is a solo-developer project, built and iterated on in the open as a portfolio piece and a genuine product attempt.

## License

Copyright © 2026 Ricky Chingili. All rights reserved.

This repository is made public for portfolio and demonstration purposes. You're welcome to read the code and reach out with questions. Reproduction, modification, or commercial use of this code or the WhyBuilder product concept is not permitted without prior written permission.

If you'd like to use, adapt, or build on any part of this project, get in touch — I'm generally open to it, I just want to have that conversation first.

---

*People don't struggle to find housing. They struggle to decide confidently.*
