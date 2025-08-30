# EED CHECK

> Simplifying EU Energy Efficiency Directive compliance for public procurement.

---

## 🌱 Mission

EED CHECK exists to simplify compliance with the EU Energy Efficiency Directive in public procurement.

The EU Energy Efficiency Directive requires public procurement to consider energy efficiency criteria for certain product categories. This creates complexity for procurement professionals who must navigate technical specifications, Green Public Procurement (GPP) criteria, and sector-specific energy requirements.

This regulatory complexity makes energy efficiency compliance challenging and time-consuming. Organizations risk non-compliance or miss opportunities to contribute to EU sustainability goals.

EED CHECK makes energy efficiency compliance simple, automated, and reliable — helping you meet regulatory requirements while supporting environmental objectives.

---

## 🎯 What we're building

EED CHECK is a comprehensive platform that simplifies energy efficiency compliance throughout the procurement process.

### In the short term:

We offer focused tools to solve energy efficiency compliance, such as:

- **Automated EED assessment** (determining applicable requirements)
- **GPP criteria integration** (mandatory technical specifications)
- **Energy efficiency checklists** and validations
- **Interactive guides** for compliance evaluation
- **Documentation templates** for energy efficiency requirements

### In the long term:

Describe your procurement needs — and EED CHECK will automatically determine applicable energy efficiency requirements, generate compliant technical specifications, and guide you through the implementation process.

From initial assessment to contract execution and monitoring — EED CHECK covers the full energy efficiency compliance journey.

---

## 🏗️ Project status

This repository contains the early prototype built via [Lovable.dev](https://lovable.dev) and edited in [Cursor](https://cursor.sh). It may include some inconsistent or exploratory code, which we're now auditing.

We're currently:

- Refactoring the codebase for clarity and modularity
- Setting up a robust folder structure
- Aligning functionality with our roadmap
- Integrating Clerk for authentication
- Preparing Supabase for assessment data storage
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
- Supabase (PostgreSQL database for assessments and compliance data)

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

