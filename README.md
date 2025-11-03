# Employee Portal (Jahia JavaScript Module)

A production-style employee experience for Jahia built with server-rendered React.  
The module bundles reusable components, ready-to-install CND definitions, localized resources, and mock data so you can stand up a portal, demo experience, or jump-start a real rollout in minutes.

## Table of Contents

- [Highlights](#highlights)
- [Tech Stack](#tech-stack)
- [Repository Layout](#repository-layout)
- [Component Catalog](#component-catalog)
- [Templates & Layouts](#templates--layouts)
- [Content Definitions & Locales](#content-definitions--locales)
- [Mock Data](#mock-data)
- [Development Workflow](#development-workflow)
- [Available Yarn Scripts](#available-yarn-scripts)
- [Quality & Conventions](#quality--conventions)
- [Deploying to Jahia](#deploying-to-jahia)
- [Extending the Portal](#extending-the-portal)

## Highlights

- **SSR-first architecture** – every UI is declared via `jahiaComponent()` with optional client “islands” when interactivity is required.
- **Comprehensive component library** – navigation, HR dashboards, job postings, alerts, queries, knowledge resources, and more, all styled with the same visual language.
- **Ready-to-use authoring experience** – each component ships with its own `definition.cnd` file plus translated editor labels/tooltips (English & French).
- **Modern tooling** – Vite 7, TypeScript 5, React 19, CSS Modules, ESLint 9, and Prettier 3.
- **Deployment-friendly build** – `yarn build && yarn package` generates the Jahia module archive (`dist/package.tgz`) for installation or CI delivery.

## Tech Stack

- **Runtime**: React 19 + Jahia JavaScript Modules Library (SSR)
- **Language**: TypeScript 5 (strict mode)
- **Bundler**: Vite 7 (SSR + client manifests)
- **Styling**: CSS Modules with shared tokens and design primitives
- **i18n**: i18next JSON bundles for runtime copy + Jahia `.properties` resource bundles for Content Editor UI
- **Tooling**: Yarn 4 (Berry), Node.js 22+, ESLint 9, Prettier 3

## Repository Layout

```
├─ src/
│  ├─ components/
│  │  ├─ <ComponentName>/
│  │  │  ├─ default.server.tsx      # SSR entry (mandatory)
│  │  │  ├─ *.client.tsx            # Optional island(s) for hydration
│  │  │  ├─ component.module.css    # Component-scoped styles
│  │  │  ├─ definition.cnd          # Content type definition
│  │  │  └─ additional views        # e.g. list.server.tsx, fullPage.server.tsx
│  │  └─ shared/                    # Grid, Icons, HeadingSection, helpers
│  ├─ data/hrMockData.json          # Demo HR dataset
│  ├─ templates/                    # Page/layout templates
│  └─ global.d.ts                   # Ambient type declarations
├─ settings/
│  ├─ definition.cnd                # Global mixins / shared types
│  ├─ locales/<lang>.json           # Runtime translation strings (i18next)
│  └─ resources/employee-portal_<lang>.properties  # Content Editor bundles
├─ packages/design-system/          # Lightweight icon & form primitives (used by components)
├─ dist/                            # Build output (ignored until you run `yarn build`)
└─ README.md
```

## Component Catalog

Every component follows the same structure: SSR view(s), optional islands, module-scoped CSS, and content definition. The table below lists each component and the views shipped out of the box.

| Component | Views / Files | Notes |
|-----------|---------------|-------|
| **AlertContainer** | `default.server.tsx` | Wraps multiple alerts with layout + animation support. |
| **AlertsBanner** | `default.server.tsx`, `close.client.ts` | Timed alert banner with dismissal logic, severity levels, and expiry awareness. |
| **CafeteriaMenu** | `default.server.tsx`, `fullPage.server.tsx`, `component.module.css` | Weekly cafeteria planner with filters, full-page immersion, and item detail integration. |
| **CafeteriaMenuItem** | `component.module.css`, `definition.cnd` | Authoring definition for individual dishes rendered inside the menu views. |
| **ContributionModal** | `default.server.tsx` | Highlighted contribution CTA with configurable copy and link. |
| **EventCard** | `default.server.tsx`, `card.server.tsx`, `fullPage.server.tsx`, `cm.server.tsx` | Event teaser, card, full detail page, and Content Editor preview. |
| **Footer** | `default.server.tsx` | Portal footer with links and localized copy. |
| **GridRow** | `default.server.tsx` | Flexible grid layout component backing page sections or query output. |
| **Hero** | `default.server.tsx` | Large hero banner with optional CTA, subtitle, and background imagery. |
| **HrInsights** | `default.server.tsx` | HR analytics dashboard pulling from mock data (payslips, vacations, expenses). |
| **JcrQuery** | `default.server.tsx`, `inline.server.tsx`, `carousel.server.tsx`, `carousel.island.client.tsx`, `tilesGrid.server.tsx`, `default.module.css` | Generic query renderer with default grid, inline snippets, carousel (hydrated), and tile layouts. |
| **JobPosting** | `default.server.tsx`, `cm.server.tsx`, `list.server.tsx`, `fullPage.server.tsx`, `component.module.css`, `card.module.css`, `list.module.css`, `utils.ts` | Rich job posting (JSON-LD), Content Editor card, query list/teaser, and immersive full-page template. |
| **KBList** | `default.server.tsx` | Knowledge base category list pulling articles by query. |
| **KnowledgeBaseArticle** | `default.server.tsx`, `fullPage.server.tsx`, `cm.server.tsx` | Article view with rich content, metadata, and CM preview. |
| **Login** | `default.server.tsx`, `form.server.tsx`, `Login.client.tsx`, `LoginCard.client.tsx`, `utils.client.ts` | Collaborative login screen with persona pickers and actual form handling. |
| **MyCards** | `default.server.tsx`, `component.module.css` | Dashboard card container fed by Content Editor. |
| **NavBar** | `default.server.tsx`, `LanguageSwitcher.client.tsx`, `LanguageSwitcher.client.module.css` | Responsive global navigation with dropdowns and localized language switcher. |
| **NewsArticle** | `default.server.tsx`, `card.server.tsx`, `fullPage.server.tsx`, `cm.server.tsx` | News article family: teaser card, full article layout, and editorial preview. |
| **PolicyDetail** | `default.server.tsx`, `fullPage.server.tsx`, `cm.server.tsx` | Policy detail view including metadata, effective dates, and full-page layout. |
| **QuickLink** | `default.server.tsx`, `types.ts` | Single quick access link; often rendered via QuickLinkList. |
| **QuickLinkList** | `default.server.tsx` | Grouping component to render authored quick links. |
| **SearchBox** | `default.server.tsx`, `island.client.ts` | Hydrated search experience with accessible form semantics. |
| **TileLink** | `default.server.tsx`, `component.module.css` | Icon-centric tile used on dashboards or landing pages. |
| **Training** | `default.server.tsx`, `list.server.tsx`, `card.server.tsx`, `fullPage.server.tsx`, `cm.server.tsx`, `utils.ts` | Training promotion with card/list views, aggregator support, and rich detail layout. |
| **TwoColumnRow** | `default.server.tsx`, `component.module.css` | Editor-configurable dual-column section with droppable areas. |
| **UnomiProfileCard** | `default.server.tsx`, `island.client.tsx`, `component.module.css` | Personalized profile widget that hydrates client-side with Unomi data. |
| **UserDirectory** | `default.server.tsx`, `UserDirectory.client.tsx` | Hydrated user directory with search, empty/loading states, and mock data adapter. |

> Tip: every component folder also includes `definition.cnd` and localized resource keys for the Content Editor. When you add a new view, update the bundle to keep the authoring UI polished.

## Templates & Layouts

- `src/templates/Layout.tsx` – global shell that wires navigation, footers, alerts, and grid primitives.
- `src/templates/Page/` – page templates for `home`, `section`, `apps`, `login`, `basic`, etc., all rendered via SSR components.
- `src/templates/MainResource/` – wrapper to host resource-driven content (policies, news, job postings) with consistent chrome.
- `src/templates/css/` – shared styles for template-level UIs (e.g., alert modules).

## Content Definitions & Locales

- **Component-level CNDs** live alongside each component (`definition.cnd`) to keep schema and implementation coupled.
- **Global mixins & shared types** reside in `settings/definition.cnd`.
- **Editor resource bundles** (`settings/resources/employee-portal_[en|fr].properties`) translate node type names, field labels, and tooltips.
- **Runtime translations** (`settings/locales/[en|fr].json`) are consumed via `i18next` inside components.
- **Remember**: when you add fields, update both the component CND and the resource bundles so the authoring UI stays bilingual.

## Mock Data

- `src/data/hrMockData.json` contains demo content for the HR Insights module (payslips, vacations, expenses).
- Each dataset is keyed by Jahia user (Pam, Penny, Robin, root); add more users to expand demos.
- Dates are relative to “today” to keep dashboards relevant during demos and smoke tests.

## Development Workflow

1. **Prerequisites**
   - Node.js 22+
   - Yarn 4 (`corepack enable` is recommended)
   - Local Jahia runtime with the JavaScript Modules feature (for end-to-end testing)

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Run in watch mode**
   ```bash
   yarn dev
   ```
   This runs the SSR + client builds in watch mode, emitting files into `dist/` whenever you save.

4. **Iterate**
   - Add/Edit components under `src/components`.
   - Update CNDs and resource bundles alongside the component.
   - Use the JCR Query component or placeholders in templates to surface your changes quickly.

5. **Preview in Jahia**
   - Use `yarn package` (or `yarn build`) to produce `dist/package.tgz`.
   - Install the package into Jahia (admin UI or CLI).
   - Map templates/components in Page Builder or Content Editor and verify authoring behavior.

## Available Yarn Scripts

| Script | Description |
|--------|-------------|
| `yarn dev` | Run the Vite SSR build in watch mode (SSR + client output). |
| `yarn build` | Type-check then perform a production Vite build (SSR + client). |
| `yarn package` | Package the module into `dist/package.tgz` for manual deployment. |
| `yarn jahia-deploy` | Deploy using the Jahia CLI (configure `.env` and CLI credentials first). |
| `yarn lint` | Run ESLint across the repo. |
| `yarn format` | Format sources with Prettier. |
| `yarn clean` | Remove `dist/` output. |

## Quality & Conventions

- **TypeScript**: strict mode, SSR-friendly configuration in `tsconfig.json`.
- **Linting**: ESLint (`yarn lint`) with React + TypeScript rules; fix before packaging.
- **Formatting**: Prettier (`yarn format`) keeps code style consistent.
- **CSS Modules**: prefer descriptive class names, keep comments minimal and purposeful.
- **Client islands**: only hydrate when interactivity is required—SSR-first keeps the portal fast.
- **Structured data**: components like JobPosting and Training emit JSON-LD; keep schema updates in sync with utility helpers.

## Deploying to Jahia

1. Build & package:
   ```bash
   yarn build && yarn package
   ```
2. Upload `dist/package.tgz` to Jahia (Administration → Server settings → Modules) or via the Jahia CLI.
3. Activate the module and assign templates to the desired channels/sites.
4. Drop components from Content Editor or Page Builder to curate pages.
5. For rapid iteration, script `yarn build && yarn jahia-deploy` or wire the watch task to auto-deploy after builds.

## Extending the Portal

- **Add a component**: scaffold a folder under `src/components`, create `default.server.tsx`, styles, CND, and localized resource entries. Follow existing patterns for list/full-page/CM views as needed.
- **Introduce interactivity**: add `*.client.tsx` islands, import them from the SSR view via `AddResources` or `useEffect`.
- **Expand translations**: update `settings/locales/*.json` for runtime strings and `settings/resources/*.properties` for authoring labels.
- **Onboard new datasets**: mimic `hrMockData.json` when shipping additional mock services or sample data.
- **CI/CD**: integrate `yarn build`, run lint/format, and push `dist/package.tgz` to artifact storage before deploying to Jahia environments.

Have fun building! Contributions or internal customizations can follow the same module structure—just remember to keep component definitions, resource bundles, and SSR views in sync so editors receive a polished authoring experience.
