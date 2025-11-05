# EED CHECK

> Simplifying EU Energy Efficiency Directive compliance for public procurement.

---

## 📋 Table of Contents

- [About the Project](#-about-the-project)
- [The Problem](#-the-problem)
- [The Solution](#-the-solution)
- [Features](#-features)
- [Project Status](#%EF%B8%8F-project-status)
- [For Developers](#-for-developers)
  - [Tech Stack](#tech-stack)
  - [Getting Started](#getting-started)
  - [Project Architecture](#project-architecture)
  - [Available Commands](#available-commands)
  - [Environment Configuration](#environment-configuration)

---

## 🌱 About the Project

**EED CHECK** is a digital platform designed to help public sector organizations comply with the **EU Energy Efficiency Directive (EED)** in their procurement processes.

The EU Energy Efficiency Directive mandates that public authorities consider energy efficiency criteria when purchasing certain products and services. This is part of the European Union's broader commitment to reducing energy consumption and achieving climate neutrality by 2050.

### Why This Matters

Public procurement represents approximately 14% of EU GDP — around €2 trillion annually. By ensuring that energy efficiency standards are met in public contracts, the EU aims to:

- **Reduce carbon emissions** and combat climate change
- **Lower operational costs** for public organizations through energy savings
- **Drive market transformation** by creating demand for energy-efficient products
- **Support innovation** in green technologies and sustainable practices

However, complying with EED requirements is complex. Procurement professionals must:
- Determine if EED applies to their specific purchase
- Identify relevant Green Public Procurement (GPP) criteria
- Integrate technical energy efficiency specifications
- Document compliance throughout the procurement lifecycle

**EED CHECK simplifies this process**, providing automated assessments, integrated GPP criteria, and compliance tools — making energy efficiency procurement accessible and reliable.

---

## 🔍 The Problem

Public procurement professionals face significant challenges when implementing energy efficiency requirements:

### Regulatory Complexity
- The EED applies to specific product categories based on CPV codes and contract values
- Requirements differ across sectors (IT equipment, lighting, office equipment, etc.)
- GPP criteria involve technical specifications that require specialized knowledge

### Time-Consuming Processes
- Manual assessment of EED applicability is error-prone
- Finding and integrating the correct GPP criteria requires extensive research
- Documenting compliance adds administrative burden to already complex procurement procedures

### Risk of Non-Compliance
- Misinterpreting EED thresholds or requirements can lead to non-compliant tenders
- Missing mandatory energy efficiency criteria may result in legal challenges or need to restart procurement
- Inadequate documentation makes audits and reviews difficult

### Limited Tools and Resources
- No centralized platform for EED compliance in procurement
- Existing resources are fragmented across multiple EU and national websites
- Little automation exists to streamline the compliance process

---

## ✅ The Solution

**EED CHECK** provides a comprehensive, user-friendly platform that automates and simplifies EED compliance:

### 🤖 Automated EED Assessment
Answer a few simple questions about your procurement (product category, contract value, duration) and instantly determine whether EED requirements apply — no manual threshold calculations needed.

### 📚 Integrated GPP Criteria
Access pre-configured Green Public Procurement criteria for all relevant product categories, with clear technical specifications ready to include in tender documents.

### ✓ Compliance Checklists
Step-by-step guidance through the compliance process, ensuring nothing is missed from initial assessment to contract award.

### 📄 Documentation Support
Generate compliant technical specifications and documentation that can be directly integrated into tender documents and procurement files.

### 🎯 Sector-Specific Tools
Specialized modules for different procurement sectors:
- IT equipment (computers, monitors, servers)
- Lighting systems
- Office equipment
- HVAC systems
- And more...

---

## 🎯 Features

### Current Features
- **EED Threshold Calculator**: Determine if your procurement triggers EED requirements
- **GPP Criteria Library**: Access energy efficiency criteria for multiple product categories
- **Interactive Assessment Tools**: Guided workflows for compliance evaluation
- **Stealth Mode**: Simplified interface for focused EED assessment
- **Multi-language Support**: Interface available in multiple EU languages (planned)

### Roadmap
- **AI-Powered Specification Generation**: Describe your needs in plain language and receive compliant technical specifications
- **Tender Document Templates**: Pre-built templates for energy-efficient procurement
- **Compliance Monitoring**: Track energy efficiency performance throughout contract execution
- **Integration with e-Procurement Systems**: Seamless connection with existing procurement platforms
- **Custom Organization Workflows**: Tailored compliance processes for specific organizational needs
- **Reporting and Analytics**: Insights into energy efficiency impact and savings

---

## 🏗️ Project Status

**Current Stage**: Active Development / Prototype Refinement

This repository contains an early-stage prototype initially built with [Lovable.dev](https://lovable.dev) and now being refactored for production readiness.

### Active Development Focus:
- ✅ Core EED assessment logic
- ✅ GPP criteria integration for key product categories
- ✅ Basic UI/UX implementation
- 🔄 Code refactoring for modularity and maintainability
- 🔄 Authentication system integration (Clerk)
- 🔄 Database setup (Supabase)
- 📋 Payment processing (Stripe - planned)
- 📋 Production deployment pipeline

**Note**: Some code may be experimental or require refactoring. We're actively cleaning up and standardizing the codebase.

---

## 👩‍💻 For Developers

### Tech Stack

**Core Technologies:**
- **React 18** - UI framework
- **TypeScript** - Type-safe development (relaxed config for prototype phase)
- **Vite** - Build tool and dev server
- **React Router v6** - Client-side routing

**UI & Styling:**
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Component library built on Radix UI primitives
- **Lucide React** - Icon library

**State & Data Management:**
- **TanStack Query (React Query)** - Server state management
- **React Hook Form** - Form handling
- **Zod** - Schema validation

**Authentication & Database:**
- **Clerk** - Authentication and user management (integration in progress)
- **Supabase** - PostgreSQL database for persistence (integration in progress)

**Development Tools:**
- **ESLint** - Linting
- **Vitest** - Testing framework (tests to be added)
- **Lovable** - Initial prototyping tool
- **Cursor** - AI-assisted development

**Deployment:**
- **Vercel** - Hosting and deployment

---

### Getting Started

#### Prerequisites
- Node.js 18+ and npm

#### Installation

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd tenderforce

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:8080`

#### Current Authentication Status

**⚠️ Important**: Clerk authentication is currently **disabled** to allow development without authentication setup.

The following files have Clerk imports/hooks commented out:
- `src/main.tsx`
- `src/hooks/useOrganizationData.ts`
- `src/hooks/useOrgUser.ts`
- `src/components/layout/UserDropdown.tsx`
- `src/components/TenderDashboard.tsx`

To re-enable authentication, you'll need to:
1. Obtain Clerk API keys
2. Add them to `.env.local`
3. Uncomment Clerk imports in the files listed above
4. Restart the dev server

---

### Project Architecture

```
src/
├── app/                    # Application configuration
│   └── routes.tsx         # Central routing with stealth mode support
├── components/            # Reusable UI components (shadcn/ui)
│   ├── layout/           # Layout components (Header, Footer, etc.)
│   └── ui/               # Base UI primitives
├── features/             # Feature modules
│   ├── auth/            # Authentication (Login, Register, Dashboard)
│   ├── tools/           # EED assessment and procurement tools
│   └── static/          # Static pages
├── pages/               # Page components
│   └── tools/          # Tool-specific pages
├── lib/                # Core utilities and configuration
├── utils/              # Shared utilities (mockApi, cpvLookup, etc.)
├── hooks/              # Custom React hooks
├── styles/             # Global styles
└── data/               # Static data files (GPP criteria, obligations)
```

#### Routing Architecture

The application supports two modes:

**1. Normal Mode**: Full procurement platform
- Default route: `/tools/sectorale-verplichtingencheck`
- Tool routes: `/tools/*`
- Auth routes: `/auth/*`

**2. Stealth Mode**: Simplified EED-only interface
- Default route: `/eed-check`
- Results: `/eed-results/:code`
- Uses `StealthLayout` for minimal UI

#### Key Technical Patterns

- **Component Architecture**: Functional components with hooks
- **Styling**: Tailwind CSS with CVA for component variants
- **Forms**: React Hook Form + Zod schemas
- **API Layer**: Currently using mock API (`utils/mockApi.ts`), transitioning to Supabase
- **Type Safety**: TypeScript with relaxed rules during prototype phase

---

### Available Commands

```bash
# Development
npm run dev          # Start dev server (http://localhost:8080)
npm run build        # Production build
npm run build:dev    # Development build
npm run preview      # Preview production build

# Code Quality
npm run lint         # Run ESLint

# Testing (framework configured, tests to be added)
npm run test         # Run tests in watch mode
npm run test:ui      # Open Vitest UI
npm run test:run     # Run tests once
```

---

### Environment Configuration

Create a `.env.local` file in the root directory:

```env
# Clerk Authentication (currently disabled)
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key

# Supabase (to be configured)
# VITE_SUPABASE_URL=your_supabase_url
# VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Stripe (to be configured)
# VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_key
```

**Note**: Authentication is currently disabled, so Clerk keys are optional for development.

---

### TypeScript Configuration

- Path alias `@/*` maps to `./src/*`
- TypeScript configured with relaxed rules (`noImplicitAny: false`, `strictNullChecks: false`)
- Strict typing will be enabled as code matures

---

### Contributing

We're currently in active refactoring. If you'd like to contribute:

1. Check existing issues or create a new one
2. Fork the repository
3. Create a feature branch
4. Follow the existing code style and patterns
5. Submit a pull request

---

### License

[License information to be added]

---

### Contact & Support

For questions or support, please [create an issue](https://github.com/your-repo/issues) or contact the development team.

---

**Built with ❤️ to support sustainable public procurement in the EU**

