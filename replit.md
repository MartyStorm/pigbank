# PigBank - High-Risk Payment Processor

## Overview

PigBank is a modern fintech web application for high-risk payment processing and gateway services. The platform provides comprehensive payment processing capabilities including transaction management, fraud detection, invoicing, payouts, and various payment methods (cards, ACH, crypto, checks). Built with a clean, professional interface inspired by modern fintech platforms like Stripe and Bankful, it emphasizes security, trust, and ease of use for merchants.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Technology Stack

**Frontend:**
- React with TypeScript for type-safe component development
- Vite as the build tool and dev server
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query for server state management and API caching
- Tailwind CSS with custom theme variables for styling
- shadcn/ui component library (Radix UI primitives) for accessible UI components
- Recharts for data visualization and analytics dashboards
- Framer Motion for animations

**Backend:**
- Node.js with Express framework
- TypeScript for type safety across the entire stack
- Drizzle ORM for database operations
- PostgreSQL as the primary database
- Session-based authentication using express-session with PostgreSQL session store

**Build & Development:**
- ESBuild for server bundling with selective dependency bundling
- Custom Vite plugins for meta image handling and Replit-specific features
- Shared TypeScript code between client and server (`shared/` directory)

### Application Architecture

**Monorepo Structure:**
The application follows a monorepo pattern with three main directories:
- `client/` - React frontend application
- `server/` - Express backend API
- `shared/` - Shared TypeScript schemas and types (primarily Drizzle database schemas)

**Path Aliases:**
- `@/` maps to `client/src/`
- `@shared/` maps to `shared/`
- `@assets/` maps to `attached_assets/`

### Database Design

**Schema Architecture:**
Drizzle ORM with PostgreSQL dialect, schema defined in `shared/schema.ts`:

- **users** - User accounts with profile information (required for Replit Auth)
- **sessions** - Express session storage (required for Replit Auth, uses connect-pg-simple)
- **transactions** - Payment transaction records with status, risk assessment, and AVS data
- **customers** - Customer profiles with aggregate transaction data
- **invoices** - Invoice records with customer and payment details
- **invoiceItems** - Line items for invoices
- **payouts** - Merchant payout records with status tracking

Key design decisions:
- Uses `gen_random_uuid()` for primary keys
- Decimal types for monetary amounts (precision: 10-12, scale: 2)
- Timestamps with `defaultNow()` for audit trails
- Zod schema validation via drizzle-zod for type-safe API validation

### Authentication & Authorization

**Replit Auth Integration:**
- OpenID Connect (OIDC) based authentication via Replit's identity provider
- Passport.js strategy for OIDC integration
- Session-based authentication with PostgreSQL-backed session store (connect-pg-simple)
- Protected routes using `isAuthenticated` middleware
- User session management with refresh token support
- Mandatory `users` and `sessions` tables for auth functionality

**Security Features:**
- HTTP-only, secure cookies for session management
- 7-day session TTL
- CSRF protection through session validation
- Environment-based secrets management

### API Architecture

**RESTful API Design:**
All API routes prefixed with `/api/` and protected by authentication:
- `/api/auth/user` - Current user information
- `/api/transactions` - Transaction CRUD operations with pagination and search
- `/api/customers` - Customer management
- `/api/invoices` - Invoice creation and management with line items
- `/api/payouts` - Payout tracking

**Request/Response Patterns:**
- JSON request bodies with Zod validation
- Structured error responses with HTTP status codes
- Query parameters for filtering, pagination, and search
- Credential-based requests (`credentials: "include"`) for session cookies

**Data Validation:**
- Zod schemas derived from Drizzle table definitions
- Runtime validation on API endpoints
- Type-safe validation with TypeScript integration

### Frontend Architecture

**State Management:**
- TanStack Query for server state (caching, refetching, optimistic updates)
- React hooks for local component state
- Custom hooks (`useAuth`, `useIsMobile`, `useToast`) for shared logic
- Query client configured with infinite stale time and disabled auto-refetch

**Component Architecture:**
- Atomic design with shadcn/ui base components
- Compound components for complex UI patterns (tables, forms, dialogs)
- Layout components (Sidebar, Header, Layout wrapper)
- Page-level components in `pages/` directory
- Responsive design with mobile-first approach

**Routing Strategy:**
- Wouter for declarative routing
- Protected route pattern checking authentication status
- Landing page for unauthenticated users
- Catch-all 404 page

**UI/UX Design Principles:**
- Dark sidebar with light content area (dual-theme support)
- Green (#73cb43) as primary brand color with dark gray accents
- Professional fintech aesthetics with minimal shadows and rounded corners
- Responsive breakpoints for mobile, tablet, and desktop
- Accessible components via Radix UI primitives

### Build & Deployment

**Build Process:**
1. Client build via Vite → `dist/public/`
2. Server build via ESBuild → `dist/index.cjs`
3. Selective dependency bundling (allowlist in `script/build.ts`) to reduce cold start times
4. External dependencies remain unbundled for faster rebuilds

**Development Workflow:**
- Concurrent dev servers: Vite dev server (port 5000) + Express API server
- Hot module replacement (HMR) for frontend changes
- TypeScript type checking without emit
- Custom Vite plugins for runtime error overlays and development banners (Replit-specific)

**Production Optimization:**
- Static file serving from `dist/public/`
- Single-page application fallback to `index.html`
- Bundled server reduces syscalls for improved cold start performance

## External Dependencies

### Cloud Services & Hosting
- **Replit** - Development environment and hosting platform with OIDC authentication
- **Neon Database** (@neondatabase/serverless) - Serverless PostgreSQL database provider

### Payment Processing (Planned/Referenced)
- Stripe integration capabilities (referenced in seed data and UI)
- Multi-payment method support: Cards, ACH, Crypto, eChecks

### UI & Component Libraries
- **shadcn/ui** - Accessible component library built on Radix UI
- **Radix UI** - Unstyled, accessible UI primitives (20+ component packages)
- **Tailwind CSS** - Utility-first CSS framework with custom theme
- **Lucide React** - Icon library

### Development Tools
- **Drizzle Kit** - Database migrations and schema management
- **Vite** - Fast build tool and dev server with React plugin
- **TypeScript** - Type safety across full stack

### Data & Visualization
- **Recharts** - Composable charting library for React
- **date-fns** - Date utility library for formatting and manipulation

### Form & Validation
- **React Hook Form** - Performant form state management
- **Zod** - TypeScript-first schema validation
- **@hookform/resolvers** - Zod resolver for React Hook Form integration

### Authentication & Session
- **Passport.js** - Authentication middleware with OIDC strategy
- **openid-client** - OpenID Connect certified client library
- **express-session** - Session middleware for Express
- **connect-pg-simple** - PostgreSQL session store

### Utility Libraries
- **nanoid** - Unique ID generation
- **memoizee** - Function memoization for OIDC config caching
- **clsx** / **tailwind-merge** - Conditional CSS class composition

## Notification System

The application has a notification service (`server/notifications.ts`) ready for email and SMS notifications.

**Current Status: Demo Mode** - Email and SMS functions simulate successful sends and log to console. To enable real sending, uncomment the production checks in `isEmailConfigured()` and `isSMSConfigured()` and add the required API keys.

### To Enable Email Notifications:
Add one of these secrets:
- `SENDGRID_API_KEY` - SendGrid API key
- `SENDGRID_FROM_EMAIL` - Sender email address (optional, defaults to noreply@pigbank.com)
OR
- `RESEND_API_KEY` - Resend API key  
- `RESEND_FROM_EMAIL` - Sender email address

### To Enable SMS Notifications:
Add these secrets:
- `TWILIO_ACCOUNT_SID` - Twilio Account SID
- `TWILIO_AUTH_TOKEN` - Twilio Auth Token
- `TWILIO_PHONE_NUMBER` - Twilio phone number to send from

The notification service includes pre-built templates for:
- Application submitted
- Application approved
- Action required
- Chargeback alerts