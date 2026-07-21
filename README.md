# EquipLink – Heavy Equipment Digital Marketplace

EquipLink is a professional, resume-focused, full-stack digital marketplace designed to connect heavy equipment owners (lessors) with contractors and customers (lessees) across India. It serves as a flagship Computer Science Engineering final-year project, demonstrating clean architecture, enterprise-grade monolithic design patterns, secure HttpOnly cookie-based authentication, containerization, and modern UI/UX workflows.

---

## 🏗️ Architectural Overview

EquipLink is built using a modern, decoupled monolithic architecture:

```
┌──────────────────────────────────────────────────────────┐
│                    CLIENT (Browser)                       │
│      Next.js 14+ (App Router) · React · TypeScript       │
│      Tailwind CSS · shadcn/ui · TanStack Query · Zod     │
└───────────────────────┬──────────────────────────────────┘
                        │ HTTPS (REST/JSON with HttpOnly Cookie)
┌───────────────────────▼──────────────────────────────────┐
│              BACKEND (Spring Boot 3 / Java 21)            │
│  Spring Security (JWT) · Spring Data JPA · Maven         │
│  Controllers → Services → Repositories → Entities        │
└───────────────────────┬──────────────────────────────────┘
                        │ JDBC / Connection Pool
┌───────────────────────▼──────────────────────────────────┐
│              DATABASE (Neon PostgreSQL)                   │
│  Users · Equipment · Bookings · Reviews · Wishlists       │
└──────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 14+ (App Router), React 18+, TypeScript, Tailwind CSS, shadcn/ui (Base-UI base), Axios, TanStack Query (React Query v5), React Hook Form, Zod, Leaflet, Apache ECharts
- **Backend**: Java 21 (LTS), Spring Boot 3.3.x, Spring Security, JWT (io.jsonwebtoken 0.12.x), Spring Data JPA, Hibernate, Maven, Lombok, MapStruct, Swagger/OpenAPI 3
- **Database**: PostgreSQL (Neon Serverless in cloud, Local Postgres for dev)
- **Deployment**: Frontend to Vercel, Backend to Render, Database to Neon
- **Containerization**: Docker & Docker Compose

---

## 📂 Repository Folder Structure

```
equiplink/
├── frontend/                     # Next.js App Router Frontend
│   ├── src/
│   │   ├── app/                 # Page routes and App Router layouts
│   │   ├── components/          # UI Components
│   │   │   ├── ui/              # shadcn/ui primitive primitives
│   │   │   ├── layout/          # Navbar, Footer, Sidebar
│   │   │   ├── common/          # SearchBar, Loader, ThemeToggle, Breadcrumb
│   │   │   └── ...
│   │   ├── features/            # Feature-specific modules (listings, bookings)
│   │   ├── hooks/               # Custom hooks
│   │   ├── services/            # Client API services
│   │   ├── contexts/            # Global contexts (AuthContext, etc.)
│   │   ├── lib/                 # Axios client, global utils
│   │   ├── types/               # TypeScript type definitions
│   │   └── utils/               # Shared helpers
│   ├── package.json
│   └── ...
├── backend/                      # Spring Boot 3 Monolith Backend
│   ├── src/main/java/com/equiplink/
│   │   ├── config/              # CORS, Security, Swagger configurations
│   │   ├── controller/          # REST Endpoint Controllers
│   │   ├── service/             # Business Logic interfaces & implementations
│   │   ├── repository/          # JPA Repositories
│   │   ├── entity/              # Database JPA entities
│   │   ├── dto/                 # Request/Response DTO records
│   │   ├── mapper/              # MapStruct Entity ↔ DTO mappers
│   │   ├── exception/           # GlobalExceptionHandlers & custom exceptions
│   │   ├── security/            # JWT Filters, UserDetails services
│   │   ├── constants/           # Global static Constants
│   │   └── ...                  # Feature domains (auth, equipment, booking, etc.)
│   ├── pom.xml
│   └── ...
├── database/                     # SQL migration scripts
├── docs/                         # Architecture docs and Swagger specs
├── assets/                       # Global logos and media
├── screenshots/                  # Readme visuals
├── postman/                      # Postman JSON collections
├── docker/                       # Dockerfiles
│   ├── Dockerfile.frontend
│   └── Dockerfile.backend
├── docker-compose.yml            # Local dev docker orchestrator
├── README.md
└── LICENSE
```

---

## 🚀 Getting Started

### Prerequisites
- **Java 21 JDK** installed and configured on your PATH.
- **Node.js v20+** and npm.
- **Maven 3.9+** (or use the provided mvn wrapper).
- **Docker Desktop** (optional, for compose-driven setups).

### Local Development Setup

#### 1. Database Setup
Ensure you have a PostgreSQL database running locally named `equiplink`.
Alternatively, run PostgreSQL in Docker:
```bash
docker compose up db -d
```

#### 2. Backend Setup
Navigate to the backend directory, configure environment variables if required, and run:
```bash
cd backend
mvn clean spring-boot:run
```
The server will start on [http://localhost:8080](http://localhost:8080).
- Swagger Docs UI is accessible at [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- API documentation metadata (OpenAPI 3 JSON) is at [http://localhost:8080/api-docs](http://localhost:8080/api-docs)

#### 3. Frontend Setup
Navigate to the frontend directory, install dependencies, and run in dev mode:
```bash
cd frontend
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the client app.

---

## 🐳 Docker Deployment

To spin up the entire application locally including the Next.js frontend, Spring Boot backend, and PostgreSQL database, run from the root:
```bash
docker compose up --build -d
```

Services will be mapped as follows:
- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:8080](http://localhost:8080)
- Database: `localhost:5432`

---

## ⚙️ Development Workflow & Coding Standards

1. **Clean Monolithic Architecture**: Maintain separation between Controllers (HTTP presentation layer), Services (Business Logic), Repositories (Data access layer), and Entities (Database relational model).
2. **REST Best Practices**: Always use request/response DTOs rather than exposing JPA entities directly. Use `BaseResponse` wrapper class for uniform JSON REST outputs.
3. **TypeScript Safety**: Synchronize type definitions in `frontend/src/types/index.ts` with Java DTOs to maintain end-to-end type safety.
4. **Code Styling**: Run Prettier and ESLint on the frontend before committing:
   ```bash
   cd frontend
   npm run lint
   ```
5. **Spring Profile Partitioning**: Use `dev` profile for local testing and `prod` profile for environment deployments.

---

## 🤖 AI Integration & Features

EquipLink integrates the **Google Gemini API (Free Tier)** to provide practical, non-intrusive AI assistance that enhances equipment listing quality for lessors.

### AI Features

1. **AI Equipment Description Generator**:
   - Generates professional titles, descriptions, key features, recommended usage, and safety notes based on Name, Brand, Model, Category, Year, Price, and Location.
   - Outputs markdown text that is fully editable before saving.
2. **AI Listing Quality Analyzer**:
   - Audits listings completeness and analyzes description quality, image count, and price realism.
   - Computes an overall score (0–100) and lists specific Strengths, Areas for Improvement, Suggestions, and Missing Information.
   - Offers an enhanced rewritten description suggestion that owners can apply with a single click.

### How Gemini Integration Works

```
┌─────────────────┐      PromptBuilder      ┌──────────────────┐
│  Owner Inputs   ├────────────────────────►│ Compiled Prompt  │
│ (Brand, Model)  │                         │  (JSON Request)  │
└─────────────────┘                         └────────┬─────────┘
                                                     │
                                                     ▼ GeminiClient
┌─────────────────┐      Jackson Parser     ┌──────────────────┐
│   Parsed DTO    │◄────────────────────────┤  Gemini API      │
│  Response DTO   │                         │  JSON Response   │
└─────────────────┘                         └──────────────────┘
```

- **Prompt Engineering**: The `PromptBuilder` formats machinery data and instructs Gemini to return a valid JSON object matching our exact schema definitions.
- **Client Execution**: `GeminiClient` makes a direct HTTP POST request to the Google Gemini models REST endpoint (`gemini-1.5-flash:generateContent`).
- **Response Handling**: The raw JSON output is parsed by the Jackson `ObjectMapper` directly into strongly typed DTO records, handling any code blocks or formatting anomalies gracefully.

### Configuration

Set the `GEMINI_API_KEY` environment variable on your system:
- **Windows (PowerShell)**:
  ```powershell
  $env:GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"
  ```
- **Linux/macOS**:
  ```bash
  export GEMINI_API_KEY="AIzaSyYourGeminiApiKeyHere"
  ```

*Note: If no API key is configured, the system will gracefully prompt with a user-friendly configuration alert without crashing.*

