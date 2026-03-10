# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PRMS Risk System — a full-stack web application for managing risks across CGIAR initiatives. Integrates with CLARISA (CGIAR initiative management system) for syncing program data.

## Repository Structure

```
risk/
├── back-end/    # NestJS API (port 3000)
├── front-end/   # Angular 15 SPA (port 4200 in dev)
├── docker-compose.yml
└── Jenkinsfile
```

## Development Commands

### Back-end (from `back-end/`)
```bash
npm run start:dev        # Watch mode (recommended for development)
npm run start            # Single run
npm run build            # Compile to dist/
npm run start:prod       # Run compiled production build
npm run lint             # ESLint with auto-fix
npm run format           # Prettier
npm run test             # Jest unit tests
npm run test:watch       # Jest in watch mode
npm run test:cov         # Coverage report
npm run test:e2e         # End-to-end tests

# Database migrations (builds first, then runs TypeORM CLI against dist/)
npm run migration:generate -- db/migrations/<MigrationName>
npm run migration:run
npm run migration:revert
```

### Front-end (from `front-end/`)
```bash
npm run start        # Dev server at localhost:4200 (uses 'local' environment config)
npm run build        # Production build
npm run build-dev    # Development build
npm run watch        # Watch mode dev build
npm run test         # Karma/Jasmine unit tests
```

## Environment Configuration

**Back-end** requires a `.env` file in `back-end/` with:
- `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME` — MySQL connection
- `JWT_SECRET`, `JWT_EXPIRES_IN` — Token signing
- `Cognito_CLIENT_ID`, `Cognito_CLIENT_SECRET`, `Cognito_TOKEN_URL`, `Cognito_USER_URL` — AWS Cognito OAuth2
- `SENDGRID_API_KEY` — Email service
- `CLARISA_USERNAME`, `CLARISA_PASSWORD` — External API integration
- `APP_PORT` (default 3000), `APP_Prefix` — Server config
- `FRONTEND` — Frontend URL for CORS

**Front-end** environments are in `front-end/src/environments/`:
- `environment.local.ts` — Used by `npm run start` (local dev)
- `environment.development.ts` — Used by `npm run build-dev`
- `environment.ts` (production) — Uses relative `/api` proxy path

## Architecture

### Back-end (NestJS 9 + TypeORM + MySQL)

**Module structure** — each feature is a NestJS module under `src/`:
- `auth/` — JWT + AWS Cognito OAuth2 strategies, guards (JwtAuthGuard, RolesGuard, AdminRolesGuard, WsJwtGuard, OpenGuard)
- `risk/` — Core risk CRUD
- `program/` — Initiative/program management; marked `@Global()`, imported by most other modules
- `users/` — User management (admin-only)
- `emails/` — SendGrid email notifications
- `dashboard/` — Analytics
- `events/` — WebSocket gateway (Socket.io) for real-time risk locking

**Database** — TypeORM with `synchronize: true` (auto-syncs schema). Entities live in `entities/` at the back-end root. Uses `SnakeNamingStrategy` for column names.

**Key Risk entity behavior**:
- `target_level` and `current_level` are computed columns (likelihood × impact)
- `flag` computed column is true when `current_level >= 16`

**Authorization pattern**:
- `@Roles('admin')` + `AdminRolesGuard` for admin-only endpoints
- `RolesGuard` for program endpoints: admins have full access; team members can only edit risks they own (checked via `ProgramRoles` join)
- AWS Cognito login auto-creates/updates users and issues 10-year JWTs

**DTOs** live in the `DTO/` directory at the back-end root.

**Swagger** is available at the API root (e.g., `http://localhost:3000/`).

### Front-end (Angular 15 + Angular Material)

**No NgRx** — state is managed via services, with `BehaviorSubject` for reactive values (see `LoadingService`). Most data flows directly from API responses.

**Service layers**:
- `src/app/services/` — Business logic and API services
- `src/app/shared-services/` — Specialized API services (`ApiRiskManagementService`, `ApiRiskReportService`, `ApiTeamMembersService`, etc.)
- All services extend `MainService`, which automatically attaches the JWT Bearer token from `localStorage` to every HTTP call

**HTTP interceptor** (`HttpRequestInterceptor`) tracks all in-flight requests and drives a global loading spinner via `LoadingService`.

**Routing**:
- `/admin` — Admin panel (AuthGuard + AdminGuard)
- `/home` — Risk management (AuthGuard); nested routes under `/home/:id/:initiativeId`
- `/dashboard` — User dashboard (AuthGuard)
- `/archive` — Archived data (AuthGuard)
- `/auth` — AWS Cognito OAuth2 callback

**Authentication flow**: AWS Cognito → OAuth2 code exchange → back-end issues JWT → stored in `localStorage` as `access_token`.

**Key libraries**: Angular Material (indigo-pink theme), Highcharts (analytics charts), TinyMCE (announcements/emails editor), ngx-socket-io (WebSocket), docxtemplater + jsPDF (document export), xlsx-js-style (Excel export), PizZip + file-saver (ZIP generation).

**Document exports** — Landscape PDF generation exists in two places that must be kept in sync:
- `Admin/admin-module/exports/exports.component.ts` — bulk ZIP export of all programs
- `risk-report-table/risk-report-table.component.ts` — per-program export

**jsPDF caveat**: `splitTextToSize()` wraps at ~half the specified width. Use manual word-wrapping with `doc.getTextWidth()` for reliable full-width text rendering.

## Docker / CI

- `docker-compose.yml` runs both services; frontend served via Nginx on `127.0.0.1:4220`
- `Jenkinsfile` builds Docker containers and sends Slack notifications
- Generated files (Word/PDF exports) are mounted at `/back-end/generated_files`
