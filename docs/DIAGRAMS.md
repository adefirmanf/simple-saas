# LinkShort - Visual Architecture Diagrams

Quick reference for all architecture diagrams. These diagrams can be rendered in any Markdown viewer that supports Mermaid.

---

## Quick Navigation
- [System Overview](#system-overview)
- [Database Schema](#database-schema)
- [Authentication Flow](#authentication-flow)
- [URL Shortening Flow](#url-shortening-flow)
- [Component Architecture](#component-architecture)
- [Tech Stack](#technology-stack)
- [Deployment](#deployment-architecture)
- [Security](#security-layers)

---

## System Overview

**High-level architecture showing all system layers and their interactions**

```mermaid
graph TB
    subgraph "Client Layer"
        A[Web Browser]
        B[Mobile Browser]
    end
    
    subgraph "Application Layer - Next.js 14"
        C[Next.js App Router]
        D[Server Components]
        E[Client Components]
        F[API Routes]
        G[Server Actions]
        H[Middleware]
    end
    
    subgraph "Authentication Layer"
        I[NextAuth.js v5]
        J[Credentials Provider]
        K[Session Management]
        L[JWT Tokens]
    end
    
    subgraph "Business Logic Layer"
        M[URL Shortening Service]
        N[Click Tracking Service]
        O[Analytics Service]
        P[User Management]
    end
    
    subgraph "Data Access Layer"
        Q[Prisma ORM]
        R[Database Models]
    end
    
    subgraph "Database Layer"
        S[(SQLite Database)]
    end
    
    subgraph "Security & Validation"
        T[Zod Schema Validation]
        U[bcryptjs Password Hashing]
        V[Route Protection]
    end
    
    A --> C
    B --> C
    C --> D
    C --> E
    C --> F
    C --> G
    C --> H
    
    H --> I
    I --> J
    I --> K
    I --> L
    
    G --> M
    G --> N
    G --> O
    G --> P
    
    M --> Q
    N --> Q
    O --> Q
    P --> Q
    
    Q --> R
    R --> S
    
    G --> T
    P --> U
    H --> V
```

---

## Database Schema

**Entity Relationship Diagram showing data models and relationships**

```mermaid
erDiagram
    USER ||--o{ URL : creates
    URL ||--o{ CLICK : tracks
    
    USER {
        string id PK "cuid"
        string email UK "unique"
        string password "hashed"
        string name "nullable"
        datetime createdAt
        datetime updatedAt
    }
    
    URL {
        string id PK "cuid"
        string shortCode UK "unique, 8-char"
        string longUrl "original URL"
        string userId FK
        datetime createdAt
        datetime updatedAt
    }
    
    CLICK {
        string id PK "cuid"
        string urlId FK
        datetime timestamp
        string userAgent "nullable"
        string referer "nullable"
    }
```

---

## Authentication Flow

**Complete authentication sequence including signup, login, and route protection**

```mermaid
sequenceDiagram
    participant U as User
    participant B as Browser
    participant M as Middleware
    participant A as NextAuth.js
    participant DB as Database
    participant D as Dashboard
    
    Note over U,D: Sign Up Flow
    U->>B: Submit signup form
    B->>DB: Check email uniqueness
    alt Email exists
        DB-->>B: Error: Email taken
        B-->>U: Display error
    else Email available
        DB->>DB: Hash password (bcryptjs)
        DB->>DB: Create user record
        DB-->>B: Success
        B-->>U: Redirect to login
    end
    
    Note over U,D: Login Flow
    U->>B: Submit login credentials
    B->>A: Authenticate request
    A->>DB: Find user by email
    DB-->>A: User record
    A->>A: Compare password hash
    alt Valid credentials
        A->>A: Generate JWT token
        A->>A: Create session
        A-->>B: Set session cookie
        B-->>U: Redirect to dashboard
    else Invalid credentials
        A-->>B: Authentication failed
        B-->>U: Display error
    end
    
    Note over U,D: Protected Route Access
    U->>B: Request dashboard page
    B->>M: Check route protection
    M->>A: Verify session
    alt Valid session
        A-->>M: Session valid
        M->>D: Allow access
        D-->>B: Render dashboard
        B-->>U: Display page
    else Invalid/expired session
        M-->>B: Unauthorized
        B-->>U: Redirect to login
    end
```

---

## URL Shortening Flow

**URL creation and access flow with click tracking**

```mermaid
sequenceDiagram
    participant U as User
    participant F as Form Component
    participant SA as Server Action
    participant V as Zod Validator
    participant N as Nanoid
    participant P as Prisma
    participant DB as Database
    participant R as Redirect Handler
    
    Note over U,DB: URL Creation Flow
    U->>F: Enter long URL
    F->>SA: Submit createUrl action
    SA->>V: Validate URL format
    alt Invalid URL
        V-->>F: Validation error
        F-->>U: Display error message
    else Valid URL
        V-->>SA: Validation passed
        SA->>N: Generate 8-char code
        N-->>SA: Unique short code
        SA->>P: Create URL record
        P->>DB: INSERT INTO urls
        DB-->>P: URL created
        P-->>SA: URL object with shortCode
        SA-->>F: Success response
        F-->>U: Display short URL + copy button
    end
    
    Note over U,DB: URL Access Flow
    U->>R: Visit short URL (/:shortCode)
    R->>P: Find URL by shortCode
    P->>DB: SELECT longUrl, id
    alt URL not found
        DB-->>R: No record
        R-->>U: 404 Not Found
    else URL found
        DB-->>P: URL record
        P-->>R: Long URL + URL ID
        R->>P: Create click record
        P->>DB: INSERT INTO clicks
        Note over P,DB: Track: userAgent, referer, timestamp
        DB-->>P: Click recorded
        R-->>U: 302 Redirect to longUrl
    end
```

---

## Component Architecture

**Application component structure and relationships**

```mermaid
graph LR
    subgraph "Frontend Components"
        A[Landing Page]
        B[Auth Pages]
        C[Dashboard Layout]
        D[URL Management]
        E[URL List]
        F[Create Form]
    end
    
    subgraph "Server Components"
        G[Dashboard Page]
        H[URL Stats]
        I[Recent URLs]
    end
    
    subgraph "Client Components"
        J[Login Form]
        K[Signup Form]
        L[Create URL Form]
        M[URL List Item]
        N[Copy Button]
    end
    
    subgraph "Server Actions"
        O[createUrl]
        P[deleteUrl]
        Q[signup]
    end
    
    subgraph "API Routes"
        R[NextAuth Handler]
    end
    
    A --> G
    B --> J
    B --> K
    C --> D
    D --> E
    D --> F
    
    G --> H
    G --> I
    
    F --> L
    E --> M
    M --> N
    
    L --> O
    M --> P
    K --> Q
    
    J --> R
```

---

## Technology Stack

**Complete technology stack with dependencies**

```mermaid
graph TB
    subgraph "Frontend Technologies"
        A[React 18]
        B[Next.js 14 App Router]
        C[TypeScript]
        D[Tailwind CSS]
        E[shadcn/ui Components]
        F[Lucide Icons]
    end
    
    subgraph "Backend Technologies"
        G[Next.js Server Actions]
        H[API Routes]
        I[NextAuth.js v5]
        J[Prisma ORM]
    end
    
    subgraph "Database & Storage"
        K[(SQLite)]
    end
    
    subgraph "Utilities & Libraries"
        L[Zod Validation]
        M[bcryptjs Hashing]
        N[nanoid ID Generator]
        O[clsx Utilities]
        P[tailwind-merge]
    end
    
    subgraph "Development Tools"
        Q[ESLint]
        R[TypeScript Compiler]
        S[PostCSS]
    end
    
    B --> A
    B --> G
    B --> H
    C --> B
    D --> B
    E --> B
    F --> B
    
    I --> H
    J --> G
    J --> K
    
    L --> G
    M --> I
    N --> G
    O --> B
    P --> B
    
    Q --> C
    R --> C
    S --> D
```

---

## Deployment Architecture

**Production and development deployment options**

```mermaid
graph TB
    subgraph "Production Environment"
        A[CDN - Static Assets]
        B[Edge Network]
        C[Next.js Server]
        D[Database Server]
    end
    
    subgraph "Development Environment"
        E[Local Dev Server]
        F[SQLite Dev DB]
    end
    
    subgraph "CI/CD Pipeline"
        G[GitHub Repository]
        H[Build Process]
        I[Type Checking]
        J[Linting]
        K[Deploy to Production]
    end
    
    G --> H
    H --> I
    H --> J
    I --> K
    J --> K
    K --> C
    
    C --> D
    C --> A
    B --> C
    
    E --> F
```

---

## Security Layers

**Multi-layered security approach**

```mermaid
graph TB
    subgraph "Security Layers"
        A[Input Validation - Zod]
        B[Authentication - NextAuth]
        C[Authorization - Middleware]
        D[Password Security - bcryptjs]
        E[Session Security - JWT]
        F[SQL Injection Protection - Prisma]
    end
    
    subgraph "Threats Mitigated"
        G[XSS Attacks]
        H[SQL Injection]
        I[CSRF Attacks]
        J[Brute Force]
        K[Session Hijacking]
    end
    
    A --> G
    F --> H
    E --> I
    D --> J
    E --> K
```

---

## Request Flow

**Detailed request/response flow through the system**

```mermaid
sequenceDiagram
    participant B as Browser
    participant M as Middleware
    participant SC as Server Component
    participant SA as Server Action
    participant P as Prisma
    participant DB as Database
    
    Note over B,DB: Page Load (Server Component)
    B->>M: GET /dashboard
    M->>M: Check authentication
    M->>SC: Render server component
    SC->>P: Fetch URLs with click counts
    P->>DB: SELECT with JOIN
    DB-->>P: URL data + analytics
    P-->>SC: Formatted data
    SC->>SC: Render to HTML
    SC-->>B: Hydrated page
    
    Note over B,DB: User Interaction (Server Action)
    B->>SA: POST createUrl (form data)
    SA->>SA: Validate with Zod
    SA->>P: Create URL record
    P->>DB: INSERT INTO urls
    DB-->>P: New URL record
    P-->>SA: Created URL
    SA-->>B: Revalidate path
    B->>B: Update UI optimistically
```

---

## Performance Optimizations

**System performance features and benefits**

```mermaid
graph LR
    subgraph "Performance Features"
        A[Server Components]
        B[Partial Prerendering]
        C[Image Optimization]
        D[Code Splitting]
        E[Database Indexing]
        F[Edge Caching]
    end
    
    subgraph "Benefits"
        G[Reduced Bundle Size]
        H[Faster Initial Load]
        I[Better SEO]
        J[Improved UX]
    end
    
    A --> G
    A --> H
    B --> H
    C --> H
    D --> G
    E --> J
    F --> H
    F --> I
```

---

## Data Flow Architecture

**How data flows through the application**

```mermaid
graph TD
    A[User Input] --> B{Input Validation}
    B -->|Valid| C[Server Action]
    B -->|Invalid| D[Error Message]
    C --> E[Business Logic]
    E --> F[Prisma ORM]
    F --> G[(Database)]
    G --> F
    F --> E
    E --> H[Response]
    H --> I[Revalidate UI]
    I --> J[Updated View]
    D --> J
```

---

## Feature Expansion Roadmap

**Planned architecture evolution**

```mermaid
graph TB
    subgraph "Phase 1: Core Features ✅"
        A[URL Shortening]
        B[Click Tracking]
        C[User Auth]
        D[Dashboard]
    end
    
    subgraph "Phase 2: Analytics"
        E[Geographic Data]
        F[Time Series]
        G[Device Analytics]
    end
    
    subgraph "Phase 3: Advanced"
        H[Custom URLs]
        I[QR Codes]
        J[Link Expiration]
    end
    
    subgraph "Phase 4: Enterprise"
        K[Team Workspaces]
        L[API Access]
        M[Webhooks]
    end
    
    A --> E
    B --> E
    C --> E
    D --> E
    
    E --> H
    F --> H
    G --> H
    
    H --> K
    I --> K
    J --> K
```

---

## File Structure

**Project directory organization**

```
simple-saas/
├── app/                        # Next.js App Router
│   ├── (auth)/                # Auth route group
│   │   ├── login/             # Login page
│   │   └── signup/            # Signup page
│   ├── dashboard/             # Protected dashboard
│   │   ├── urls/              # URL management
│   │   └── page.tsx           # Dashboard home
│   ├── [shortCode]/           # Dynamic redirect
│   ├── api/auth/              # NextAuth routes
│   └── layout.tsx             # Root layout
├── lib/                       # Shared libraries
│   ├── prisma.ts              # DB client
│   └── utils.ts               # Utilities
├── prisma/                    # Database
│   ├── schema.prisma          # Schema definition
│   └── migrations/            # Migration files
├── auth.ts                    # NextAuth setup
├── auth.config.ts             # Auth configuration
├── middleware.ts              # Route protection
└── package.json               # Dependencies
```

---

## API Endpoints

**Available endpoints and their purposes**

| Endpoint | Method | Purpose | Auth Required |
|----------|--------|---------|---------------|
| `/` | GET | Landing page | No |
| `/login` | GET | Login page | No |
| `/signup` | GET | Signup page | No |
| `/dashboard` | GET | Dashboard home | Yes |
| `/dashboard/urls` | GET | URL management | Yes |
| `/api/auth/[...nextauth]` | ALL | NextAuth handler | Mixed |
| `/[shortCode]` | GET | Redirect to long URL | No |

**Server Actions**

| Action | Purpose | Auth Required |
|--------|---------|---------------|
| `createUrl` | Create short URL | Yes |
| `deleteUrl` | Delete URL | Yes |
| `signup` | Register new user | No |

---

**These diagrams can be copied into presentations, documentation, or portfolio materials.**

**View full documentation**: [ARCHITECTURE.md](../ARCHITECTURE.md)
