# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

EED TOOL is a React/TypeScript application that helps organizations comply with EU Energy Efficiency Directive requirements in public procurement. The platform provides automated EED assessments, GPP criteria integration, and energy efficiency compliance tools.

## Essential Commands

### Development
```bash
npm install        # Install dependencies
npm run dev        # Start dev server at http://localhost:8080
npm run build      # Production build
npm run build:dev  # Development build
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

### TypeScript Configuration
- TypeScript is configured with relaxed rules (noImplicitAny: false, strictNullChecks: false)
- Path alias `@/*` maps to `./src/*`
- No tests are currently configured

## Architecture Overview

### Core Stack
- **Framework**: React 18 with Vite
- **Language**: TypeScript (with relaxed type checking)
- **Styling**: Tailwind CSS + shadcn/ui components
- **Routing**: React Router v6
- **State**: React Query (TanStack Query)
- **Forms**: React Hook Form + Zod validation
- **Authentication**: Clerk (currently disabled - see Authentication Status below)
- **Database**: Supabase (integration pending)

### Project Structure

```
src/
├── app/           # Main app configuration
│   └── routes.tsx # Central routing configuration with stealth mode support
├── components/    # Reusable UI components (shadcn/ui based)
├── features/      # Feature-specific modules
│   ├── auth/      # Authentication (Login, Register, Dashboard)
│   └── tools/     # EED assessment tools
├── pages/         # Page components
│   └── tools/     # Tool-specific pages
├── lib/           # Core utilities and helpers
├── utils/         # Shared utilities (mockApi, cpvLookup)
└── styles/        # Global styles
```

### Routing Architecture

The application has two routing modes controlled by stealth mode:

1. **Normal Mode**: Full application with all procurement tools
   - Default route: `/tools/sectorale-verplichtingencheck`
   - Tool routes under `/tools/*`
   - Auth routes under `/auth/*`

2. **Stealth Mode**: Simplified EED-only interface
   - Default route: `/eed-check`
   - Results at `/eed-results/:code`
   - Uses `StealthLayout` instead of regular `Layout`

Key route patterns:
- `/tools/*` - Procurement tools
- `/eed-check` - EED assessment (stealth mode primary)
- `/results/:code` - Assessment results
- `/auth/*` - Authentication pages

### Component Architecture

- **Layout Components**: `Layout` and `StealthLayout` provide app structure
- **UI Components**: Built on shadcn/ui with Radix UI primitives
- **Tool Components**: Each procurement tool has its own page component
- **Form Handling**: React Hook Form with Zod schemas for validation

### State Management

- **React Query**: For server state and API calls
- **Local State**: React hooks for component state
- **Mock API**: Currently using `utils/mockApi.ts` for simulated backend

### Key Features in Development

1. **EED Assessment Tool**: Main feature for Energy Efficiency Directive compliance
2. **GPP Criteria Integration**: Green Public Procurement criteria
3. **Multiple Procurement Tools**: Various compliance and assessment tools
4. **Stealth Mode**: Simplified interface for focused EED assessment
5. **Authentication**: Clerk integration (pending)
6. **Database**: Supabase for data persistence (pending)

### Authentication Status

**IMPORTANT: Clerk authentication is currently disabled** to allow development without authentication setup.

The following files have Clerk imports/hooks commented out:
- `src/main.tsx` - ClerkProvider commented out (lines 5, 9-58)
- `src/hooks/useOrganizationData.ts` - useOrganization hook disabled
- `src/hooks/useOrgUser.ts` - useUser and useOrganization hooks disabled
- `src/components/layout/UserDropdown.tsx` - Clerk hooks disabled, returns null for user
- `src/components/TenderDashboard.tsx` - useUser hook disabled

To re-enable Clerk authentication:
1. Add valid Clerk keys to `.env.local`
2. Uncomment the Clerk imports and providers in the files listed above
3. Restart the development server

### Environment Variables

Required in `.env.local` (when Clerk is enabled):
```
VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
```

Future additions will include Supabase and Stripe keys.

### Development Notes

- The codebase originated from Lovable.dev and is being refactored
- Currently transitioning from mock API to real backend services
- TypeScript is configured with relaxed type checking to accommodate prototype code
- No test suite is currently configured