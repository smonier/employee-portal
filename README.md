# Employee Portal — Jahia JavaScript Module

A full-featured employee experience built as a Jahia JavaScript (SSR) module. The project ships reusable, server-rendered React components, optional islands for client hydration, ready-to-use CND definitions, localized resource bundles, and mock HR data for rapid prototyping.

## Table of contents

- [Features](#features)
- [Technology stack](#technology-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Available scripts](#available-scripts)
- [Component library](#component-library)
- [Templates & layout](#templates--layout)
- [Content definitions & i18n](#content-definitions--i18n)
- [Mock data](#mock-data)
- [Quality & conventions](#quality--conventions)
- [Deploying to Jahia](#deploying-to-jahia)

## Features

- **Server-side rendered UI** powered by `jahiaComponent()` with optional island hydration for interactive widgets.
- **Comprehensive component set** covering navigation, alerts, search, knowledge bases, policies, hero banners, event cards, quick links, carousel/tiles layouts, and more.
- **HR Insights dashboard** that filters payslips, vacations, and expenses per logged-in user using localized copy and mock HR datasets.
- **Responsive layouts and theming** via CSS modules and shared design tokens; modern light look & feel throughout the portal.
- **Internationalization** with English/French resources for component strings, tooltips, and content definitions.
- **Structured content definitions (CND)** scoped at the component level plus a global definition file for shared types.
- **Build & packaging pipeline** based on Vite + TypeScript with outputs ready for Jahia deployment.

## Technology stack

- **Runtime:** React 19 with Jahia JavaScript Modules Library
- **Bundler:** Vite 7 (SSR build + client assets)
- **Language:** TypeScript 5
- **Styling:** CSS Modules, modern-normalize, shared design-system primitives
- **i18n:** i18next + Jahia resource bundles (`.properties` / `.json`)
- **Tooling:** ESLint 9, Prettier 3, Yarn 4, Node 22+

## Project structure

```
src/
  components/
    AlertsBanner/             # Alert banner with dismiss & types
    HrInsights/               # HR data tables (payslips, vacations, expenses)
    JcrQuery/                 # Query-driven cards, carousel, tiles layouts
    NavBar/                   # Global navigation with dropdowns
    QuickLink/                # Individual quick link cards
    SearchBox/                # Hydrated search box island
    TwoColumnRow/             # Flexible grid/row layouts
    ...                       # Additional feature components
    shared/                   # Common UI primitives (Grid, Icons, HeadingSection)
  data/
    hrMockData.json           # Mock HR dataset keyed by user
  templates/
    Layout.tsx                # Portal shell (header, footer injection)
    Page/                     # Home, section, login, basic templates
    MainResource/             # Wrapper for resource-driven pages
settings/
  definition.cnd              # Global content definitions
  resources/                  # Resource bundles (en/fr)
  locales/                    # JSON locale overrides
static/                       # Static assets served by Jahia
```

## Getting started

1. **Prerequisites**
   - Node.js ≥ 22
   - Yarn ≥ 4 (project uses Yarn modern releases)
   - A Jahia runtime with the Jahia JavaScript Modules feature enabled

2. **Install dependencies**
   ```bash
   yarn install
   ```

3. **Run in watch/SSR mode**
   ```bash
   yarn dev
   ```
   This runs the Vite build in watch mode to continuously emit the SSR bundle (`dist/server`) and client assets (`dist/client`).

4. **Connect to Jahia**
   - Deploy the generated bundle to your Jahia runtime (see [Deploying to Jahia](#deploying-to-jahia)).
   - Map templates/components within Jahia (page templates, resource types, etc.) as needed.

## Available scripts

| Script          | Description                                                                 |
|-----------------|-----------------------------------------------------------------------------|
| `yarn dev`      | Build in watch mode; regenerates SSR bundle and assets on every change.     |
| `yarn build`    | Type-check, run a production Vite build, then package the module.           |
| `yarn package`  | Produce `dist/package.tgz` for manual deployment.                           |
| `yarn deploy`   | Run `jahia-deploy` (requires local Jahia CLI configuration).                |
| `yarn lint`     | Run ESLint on the entire codebase.                                          |
| `yarn format`   | Format files with Prettier.                                                 |
| `yarn clean`    | Remove the `dist/` directory.                                               |

## Component library

Each component lives in `src/components/<Name>` and typically provides:

- `default.server.tsx` — the SSR entry (registered via `jahiaComponent()`).
- Optional `*.client.tsx|ts` island for hydration.
- `component.module.css` for locally-scoped styles.
- `definition.cnd` and resource bundle entries for content editor integration.

Highlighted components:

- **AlertsBanner** – Timed alerts with close interaction and expiry handling.
- **AlertContainer** – Groups alert banners and manages layout.
- **HrInsights** – Displays payslips, vacation summaries, or expenses per user with localized metrics.
- **JcrQuery** – Reusable query-driven views (default grid, carousel with hydration, tiles).
- **NavBar** – Global navigation embedded in the layout, pulling icons from the shared set.
- **QuickLink / QuickLinkList** – Editor-managed shortcuts surfaced on the home page.
- **SearchBox** – Hydrated search island with auto-complete.
- **EventCard / NewsArticle / PolicyDetail / KnowledgeBaseArticle** – Detail and card views for typical intranet content.
- **TwoColumnRow** – Flexible content layout supporting configurable column widths and rich text.
- **UnomiProfileCard** – Personalized profile widget with client-side data fetching.

Shared utilities (icons, grid system, typography helpers) are available under `src/components/shared`.

## Templates & layout

- **Layout.tsx** centralizes the global chrome (nav, footer, alerts) and is used by every template.
- **Page templates** include home, section, login, and basic variants located under `src/templates/Page/`.
- **MainResource** wraps resource-driven views with consistent layout and optional child rendering.
- Templates leverage the same component patterns (server-rendered React with optional islands) to keep page logic consistent.

## Content definitions & i18n

- Global definitions live in `settings/definition.cnd`; component-specific definitions reside alongside each component in `definition.cnd`.
- Resource bundles for editor-facing labels/tooltips are stored in `settings/resources/employee-portal_[en|fr].properties`.
- Front-end translations use `settings/locales/[en|fr].json` and are consumed via `i18next` (e.g., HrInsights table labels).
- When adding new content types, mirror the existing pattern: update the component `definition.cnd`, provide localized keys, and sync the resource bundles.

## Mock data

- `src/data/hrMockData.json` contains mock HR records (payslips, vacations, expenses) for the demo users Pam, Penny, Robin, and root.
- The HrInsights component filters data by the logged-in Jahia username; add new entries in the JSON file to extend the experience for additional users.
- Dates are generated relative to the current day to keep sample data fresh during demos.

## Quality & conventions

- TypeScript strictness and `tsconfig.json` align with SSR rendering requirements.
- ESLint + TypeScript ESLint cover React best practices; run `yarn lint` before committing.
- Prettier enforces formatting (`yarn format`).
- CSS modules default to ASCII naming; comments are minimal and purposeful.
- Islands should remain focused—avoid broad hydration when simple SSR suffices.

## Deploying to Jahia

1. Build and package the module:
   ```bash
   yarn build
   ```
2. Upload `dist/package.tgz` to Jahia (via the Administration UI or CLI).
3. Install and activate the module.
4. Assign templates to channels/page types and add components through Content Editor.

For rapid iteration in a local Jahia environment, run `yarn watch` (alias of `yarn dev`) and configure `watch:callback` to package and deploy automatically once your local `jahia-deploy` is set up.
