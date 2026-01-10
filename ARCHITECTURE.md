# LinkShort - Architecture Design Documentation

## Portfolio Project: URL Shortener SaaS Platform

This document provides comprehensive architecture diagrams and design documentation for the LinkShort URL shortener platform, demonstrating a production-ready SaaS application built with modern web technologies.

---

## 1. System Architecture Overview

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
    
    style A fill:#e1f5ff
    style B fill:#e1f5ff
    style C fill:#fff4e1
    style S fill:#ffe1e1
    style I fill:#e1ffe1
```

### Description
The system follows a modern layered architecture pattern:
- **Client Layer**: Responsive web interface accessible from any browser
- **Application Layer**: Next.js 14 with App Router providing server-side rendering and routing
- **Authentication Layer**: Secure authentication using NextAuth.js with JWT tokens
- **Business Logic Layer**: Core services for URL management, tracking, and analytics
- **Data Access Layer**: Type-safe database queries with Prisma ORM
- **Database Layer**: SQLite for data persistence
- **Security Layer**: Input validation with Zod and password hashing with bcryptjs

---

## 2. Database Schema Architecture

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

### Database Design Principles
- **User Model**: Stores authenticated users with secure password hashing
- **URL Model**: Manages shortened URLs with unique 8-character codes (nanoid)
- **Click Model**: Tracks every click with metadata for analytics
- **Relationships**: 
  - One user can create many URLs (1:N)
  - One URL can have many clicks (1:N)
  - Cascade deletion ensures data integrity
- **Indexes**: Optimized foreign key lookups for userId and urlId

---

## 3. Authentication Flow

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

### Authentication Features
- **Credential-based authentication** using email and password
- **Password security** with bcryptjs hashing
- **Session management** with NextAuth.js v5
- **JWT tokens** for stateless authentication
- **Route protection** via middleware
- **Automatic redirects** for authenticated users

---

## 4. URL Shortening Flow

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

### URL Shortening Features
- **8-character unique codes** generated using nanoid library
- **URL validation** with Zod schema validation
- **Server Actions** for type-safe mutations
- **Automatic click tracking** with metadata capture
- **Real-time analytics** for each shortened URL
- **One-click copy** to clipboard functionality

---

## 5. Application Layer Architecture

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
    
    style A fill:#e1f5ff
    style G fill:#fff4e1
    style J fill:#ffe1f5
    style O fill:#e1ffe1
    style R fill:#f5e1ff
```

### Component Architecture
- **Server Components**: Data fetching and rendering (Dashboard stats, URL lists)
- **Client Components**: Interactive UI elements (Forms, buttons, modals)
- **Server Actions**: Type-safe server mutations (createUrl, deleteUrl, signup)
- **API Routes**: NextAuth authentication endpoints
- **Layout System**: Nested layouts with dashboard sidebar navigation

---

## 6. Technology Stack Visualization

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
    
    style B fill:#000000,color:#ffffff
    style C fill:#3178c6,color:#ffffff
    style D fill:#06b6d4,color:#ffffff
    style K fill:#003b57,color:#ffffff
    style I fill:#000000,color:#ffffff
```

### Technology Choices & Rationale

#### Frontend
- **Next.js 14**: App Router for modern React architecture, server components, and optimized performance
- **TypeScript**: Type safety and enhanced developer experience
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **shadcn/ui**: High-quality, accessible component library

#### Backend
- **Server Actions**: Type-safe mutations without API endpoints
- **NextAuth.js v5**: Industry-standard authentication solution
- **Prisma**: Type-safe ORM with excellent TypeScript integration

#### Database
- **SQLite**: Lightweight, serverless database perfect for SaaS applications

#### Security & Validation
- **Zod**: Runtime type validation for forms and API inputs
- **bcryptjs**: Secure password hashing
- **nanoid**: Cryptographically secure unique ID generation

---

## 7. Deployment Architecture

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
    
    style C fill:#000000,color:#ffffff
    style G fill:#24292e,color:#ffffff
    style K fill:#10b981,color:#ffffff
```

### Deployment Options

#### Recommended: Vercel (Optimized for Next.js)
- **Edge Network**: Global CDN for static assets
- **Serverless Functions**: Auto-scaling Next.js server
- **Database**: Can integrate with Vercel Postgres, PlanetScale, or Supabase
- **Zero Configuration**: Deploy with `vercel` CLI or GitHub integration

#### Alternative: Traditional Hosting
- **VPS/Cloud Server**: AWS EC2, DigitalOcean, Linode
- **Node.js Runtime**: Production server with `npm start`
- **Process Manager**: PM2 for reliability
- **Reverse Proxy**: Nginx for SSL and load balancing
- **Database**: SQLite file or migrate to PostgreSQL/MySQL

---

## 8. Request/Response Flow

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

## 9. Security Architecture

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
    
    style A fill:#10b981,color:#ffffff
    style B fill:#10b981,color:#ffffff
    style C fill:#10b981,color:#ffffff
    style D fill:#10b981,color:#ffffff
    style E fill:#10b981,color:#ffffff
    style F fill:#10b981,color:#ffffff
```

### Security Features
- **Input Validation**: All user inputs validated with Zod schemas
- **SQL Injection Prevention**: Parameterized queries via Prisma ORM
- **Password Security**: bcryptjs with salt rounds for secure hashing
- **Session Management**: HTTP-only cookies with JWT tokens
- **Route Protection**: Middleware-based authentication checks
- **CSRF Protection**: Built-in NextAuth.js CSRF tokens

---

## 10. Performance Optimizations

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
    
    style A fill:#0ea5e9
    style B fill:#0ea5e9
    style C fill:#0ea5e9
    style D fill:#0ea5e9
    style E fill:#0ea5e9
    style F fill:#0ea5e9
```

### Optimization Strategies
- **Server Components**: Zero JavaScript for static content
- **Database Indexes**: Fast lookups on userId and urlId
- **Code Splitting**: Automatic route-based splitting
- **Static Generation**: Pre-rendered pages where possible
- **Edge Deployment**: Reduced latency with global distribution

---

## Key Features Summary

### Core Functionality
✅ **URL Shortening**: Generate short, memorable links with 8-character codes  
✅ **Click Tracking**: Real-time analytics with user agent and referrer data  
✅ **User Dashboard**: Clean, modern interface for URL management  
✅ **Authentication**: Secure signup/login with session management  
✅ **Analytics**: Track total clicks per URL with timestamps  
✅ **Copy to Clipboard**: One-click URL copying functionality  

### Technical Highlights
🚀 **Modern Stack**: Next.js 14, TypeScript, Tailwind CSS, Prisma  
🔒 **Security First**: Password hashing, JWT tokens, input validation  
⚡ **Performance**: Server components, edge deployment, optimized queries  
🎨 **Professional UI**: shadcn/ui components with responsive design  
🧪 **Type Safety**: Full TypeScript coverage with Zod validation  
📊 **Scalable**: Modular architecture ready for feature expansion  

---

## Future Enhancements

### Phase 1: Enhanced Analytics
- Detailed click analytics dashboard
- Geographic data visualization
- Time-series click graphs
- Device and browser breakdowns

### Phase 2: Advanced Features
- Custom short URLs (vanity URLs)
- QR code generation
- Link expiration dates
- Password-protected links

### Phase 3: Team Features
- Multi-user workspaces
- Team collaboration
- Role-based access control
- Shared link collections

### Phase 4: Enterprise Features
- API for programmatic access
- Webhooks for click events
- White-label options
- Advanced security features

---

## Architecture Design Principles

1. **Separation of Concerns**: Clear boundaries between layers
2. **Type Safety**: TypeScript throughout the application
3. **Security by Design**: Multiple security layers and validations
4. **Scalability**: Modular architecture supports growth
5. **Developer Experience**: Modern tooling and best practices
6. **Performance First**: Optimized rendering and data fetching
7. **Maintainability**: Clean code with consistent patterns

---

## Conclusion

This architecture demonstrates a production-ready SaaS application built with modern web technologies. The system is designed to be:

- **Secure**: Multiple security layers protect user data
- **Scalable**: Architecture supports growth and feature additions
- **Performant**: Optimized for speed and user experience
- **Maintainable**: Clean, typed code with clear patterns
- **Professional**: Industry-standard tools and practices

The LinkShort platform showcases expertise in full-stack development, modern React patterns, authentication systems, database design, and cloud deployment strategies.

---

**Author**: Software Engineer Portfolio Project  
**Technologies**: Next.js 14, TypeScript, React, Prisma, NextAuth.js, Tailwind CSS  
**Repository**: [github.com/adefirmanf/simple-saas](https://github.com/adefirmanf/simple-saas)  
**License**: MIT
