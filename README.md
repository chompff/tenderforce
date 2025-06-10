# Tenderforce

> Turning Europe's procurement jungle into a usable path.

---

## 🛍️ Mission

Tenderforce exists to radically simplify public procurement.

Across Europe, governments use procurement not only to acquire goods and services but also to drive societal change — pushing sustainability, innovation, and inclusion through complex requirements. While the intent is noble, the result is a tangled web of procedures and legislation.

This legal jungle makes tenders so complex that full compliance becomes difficult. That creates risk — legal risk. In the Netherlands, many tenders are challenged in court (*kort geding*) by bidders exploiting minor flaws.

Tenderforce makes tendering simple, structured, and secure — helping you stay compliant without drowning in complexity.

---

## 🎯 What we're building

Tenderforce is a toolset and ultimately a platform that simplifies the full **aanbestedingsproces** (public procurement lifecycle).

### In the short term:

We offer 10–15 focused tools to solve concrete steps, such as:

- **Flow-based decision aids** (e.g. which procedure to choose)
- **Document generators** (e.g. award letters, rejection letters)
- **Checklists and validations**
- **Interactive guides** for evaluating compliance
- **Templates** for tender documents (PvE, Gunningsleidraad, Nota van Inlichtingen)

### In the long term:

Type what you want to tender — and Tenderforce will generate the required documentation, guide you through the legal requirements, and structure the review and award process.

From initial scoping to publishing, evaluating, and sending compliant *gunningsbrieven* and *afwijzingsbrieven* — Tenderforce covers the full journey.

---

## 🏗️ Project status

This repository contains the early prototype built via [Lovable.dev](https://lovable.dev) and edited in [Cursor](https://cursor.sh). It may include some inconsistent or exploratory code, which we're now auditing.

We're currently:

- Refactoring the codebase for clarity and modularity
- Setting up a robust folder structure
- Aligning functionality with our roadmap
- Integrating Clerk for authentication
- Preparing Supabase for tender storage
- Planning Stripe integration for billing and subscription management

---

## ⚙️ Tech stack

**Frontend & Dev Tools:**

- Vite
- TypeScript
- React
- Tailwind CSS
- PostCSS
- shadcn-ui
- Lovable
- Cursor

**Auth & Storage:**

- Clerk (authentication & user management)
- Supabase (PostgreSQL database for tenders and metadata)

**Billing:**

- Stripe (for handling subscriptions and payment plans)

**Deployment:**

- Vercel

---

## 🚀 Getting started

To run the project locally:

```bash
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>
npm install
npm run dev
```

Ensure you have a `.env.local` file with the following:

```env
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

> Note: Supabase and Stripe keys will be added once those services are integrated.

