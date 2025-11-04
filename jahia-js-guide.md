# Jahia JavaScript Module Guide

This guide explains how to structure, implement, and ship features inside a Jahia
JavaScript module (JXM) such as the employee portal. Share it with development
agents so they can deliver features consistently.

---

## 1. Repository Layout

```
.
├── package.json              # Scripts, dependencies, Jahia metadata
├── module.properties         # Module bundle descriptor
├── src/
│   ├── components/           # Reusable feature components
│   │   └── <ComponentName>/
│   │       ├── definition.cnd    # Node type & mixin definitions
│   │       ├── default.server.tsx# SSR view(s)
│   │       ├── *.client.tsx      # Hydrated islands / client logic
│   │       ├── *.module.css      # CSS modules
│   │       └── types.ts          # Optional TS types
│   ├── templates/            # Layouts & page templates
│   │   ├── Layout.tsx        # Shared layout wrapper
│   │   ├── MainResource/     # Component templates
│   │   └── Page/             # Page-level templates
│   ├── data/, global.d.ts, types.d.ts …
├── settings/
│   ├── locales/*.json        # i18next translations (client)
│   ├── resources/*.properties# Resource bundles (server)
│   ├── content-editor-forms/ # JSON overrides for editor UIs
│   └── definition.cnd        # Global mixins/types
└── static/, dist/, etc.
```

Key conventions:

- Use TypeScript everywhere; JSX is compiled by Vite.
- Path alias `~/` resolves to `src/` (`tsconfig.json`).
- CSS Modules default to local scope; import shared tokens with `@value`.

---

## 2. Component Anatomy

Each component folder bundles everything the authoring experience needs.

### 2.1 `definition.cnd`

- Defines node types, mixins, and constraints (primary type `jempnt:<name>`).
- Use namespaced property definitions with editors in mind (`string`, `weakreference`, etc.).
- Provide pickers (e.g., `picker[type='image']`) and mixin inheritance.
- Versioning tip: changing a type requires a Jahia migration or content update.

### 2.2 Server Views (`*.server.tsx`)

- Export via `export default jahiaComponent({...}, (props) => <Component />);`.
- Register metadata: `componentType`, `nodeType`, `name`, `displayName`, `dataFetcher`.
- Fetch child areas using `<Area name="..." />` with `allowedNodeTypes`.
- Use `Render` to render nested nodes (`<Render content={child} />`).
- Access Jahia context via `useServerContext()` when needed (e.g., locale, site).
- Prefer semantic HTML and shared grid primitives from `~/components/shared`.

### 2.3 Client Islands (`*.client.tsx` / `.island.client.tsx`)

- Client files are hydrated via Jahia’s island system. They receive serialized props.
- Keep dependencies lightweight; avoid referencing browser APIs at import time (guard with `typeof window !== "undefined"`).
- Pair with CSS Modules for styling (`import classes from "./component.module.css";`).
- Expose interactive hooks (e.g., login modal) and coordinate with server view props.

### 2.4 Types & Utilities

- Store prop interfaces in `types.ts` to share between server & client.
- Common utilities (e.g., login fetcher) live beside component files.
- Use strict typing (`strict: true` in `tsconfig.json`) to avoid unsafe `any`.

---

## 3. Templates & Layouts

### 3.1 Layout (`src/templates/Layout.tsx`)

- Wraps every page with `<html>`, `<head>`, `<body>`.
- Handles SEO meta tags by reading current node properties via `getNodeProps`.
- Injects shared CSS via `<AddResources>` and renders the module-wide footer area.
- Accepts optional `head` fragments for per-template additions.

### 3.2 Page Templates (`src/templates/Page/*`)

- Register as `componentType: "template"` with `nodeType: "jnt:page"`.
- Compose the page using `<Layout>` and Jahia `<Area>` placeholders.
- Example pattern:

```tsx
jahiaComponent(
  { componentType: "template", nodeType: "jnt:page", name: "home", displayName: "Home" },
  ({ "jcr:title": title }) => (
    <Layout title={title}>
      <Render content={{ nodeType: "jempnt:navBar" }} />
      <main>
        <section>
          <Area name="alerts" allowedNodeTypes={["jempnt:alertContainer"]} />
          {/* ... */}
        </section>
      </main>
    </Layout>
  ),
);
```

### 3.3 Component Templates (`src/templates/MainResource/*`)

- Provide default renderings for components used as main resources (e.g., when a content item is the page root).
- Typically just wrap component server views inside `<Layout>`.

---

## 4. Settings & Localization

### 4.1 i18next Locales (`settings/locales/*.json`)

- JSON key/value pairs consumed by `i18next` on both server & client (`t("form.login.login")`).
- Always update **all** supported languages to avoid fallback issues.
- Keep keys semantic (e.g., `footer.resources`, `hrInsights.title`).

### 4.2 Resource Bundles (`settings/resources/*.properties`)

- Used by Jahia server-side rendering and content editor UI.
- Mirror the locale keys when a string must be available outside i18next.

### 4.3 Content Editor Forms

- JSON overrides in `settings/content-editor-forms/` customize the Jahia UI (fieldsets, validation messages).
- Tie overrides to node types via `fieldsets/*.json` or `jempnt_<type>.json`.

### 4.4 Global CND (`settings/definition.cnd`)

- Houses shared mixins (e.g., `jempmix:cardMetadata`).
- Reuse these mixins inside component-level CNDs to avoid duplication.

---

## 5. Styling

- All component styles live in `.module.css` files next to the component.
- Import shared grid variables with `@value breakpoints_md from "~/components/shared/Grid/variables.module.css";`.
- Use CSS Modules features (`composes`) to inherit grid classes.
- Keep naming consistent (`.root`, `.header`, `.card`); avoid global selectors.

---

## 6. Islands & Hydration Strategy

- For interactive widgets (login modal, search box), split logic:
  - `default.server.tsx` renders markup plus an island placeholder.
  - `*.client.tsx` handles state, fetches, and DOM event listeners.
- Use `useEffect` guards for DOM access; clean up event listeners (e.g., modal ESC key).
- Provide fallback UI for edit mode to show authors how it renders (`mode === "edit"` check).

---

## 7. Data & APIs

- Fetch data from Jahia GraphQL through `renderContext` or the provided URLs in props.
- Mock data for demos under `src/data/` (e.g., `hrMockData.json`).
- Keep server-side fetch logic synchronous; aim for serializable props.

---

## 8. Build, Test, Deploy

- `yarn dev` — Vite build in watch mode (for quick feedback).
- `yarn build` — Type-check (`tsc --noEmit`), bundle via Vite, then `yarn pack` into `dist/package.tgz`.
- `yarn lint` — ESLint (strict). Fix files you touch; acknowledge unrelated warnings in PR notes.
- `yarn watch:callback` — Build package & trigger deploy (project-specific script).

Deployment tips:

- Do not run destructive git commands in shared environments.
- Keep the working tree clean; never revert user changes you didn’t make.
- Mention unfixable lint errors in your summary if they originate elsewhere.

---

## 9. Workflow Checklist for New Features

1. **Define content model**
   - Update component `definition.cnd`.
   - Adjust `settings/definition.cnd` if a reusable mixin is needed.
2. **Implement server view**
   - Create/update `default.server.tsx`, `fullPage.server.tsx`, etc.
   - Wire Jahia areas, `Render` calls, and shared layout components.
3. **Add client interactivity**
   - Create `.client.tsx`/`.island.client.tsx`.
   - Register hydration entry per Jahia module configuration.
4. **Style**
   - Add/edit CSS Modules; import shared grid tokens where needed.
5. **Localization**
   - Update `settings/locales/en.json` and `fr.json` (or your supported languages).
   - Update resource bundles / editor forms if the UI needs matching labels.
6. **Templates**
   - If the feature impacts page structure, update relevant templates in `src/templates`.
7. **Testing**
   - Run `yarn lint`. If it fails for unrelated reasons, document that in your summary.
   - Optional: add smoke tests or scripts and clean up before committing.
8. **Document**
   - Summaries should cite files & line numbers.
   - Suggest next actions (tests, deploy) for the user.

---

## 10. Gotchas & Best Practices

- **Context checks**: Guard against missing `window` or Jahia context during SSR.
- **SEO**: Always populate `<title>`, `og:` tags via `Layout` so pages share consistent metadata.
- **Login flows**: Factor persona-specific behavior at the client level (e.g., redirect URLs per persona).
- **Areas in preview**: Some Jahia versions skip empty areas in preview; handle fallbacks gracefully.
- **Translations**: Keep keys flat and documented; avoid hard-coded strings in server/client components.
- **CSS tokens**: Use the shared grid system (Row/Col components) to maintain layout consistency.
- **Dependencies**: Keep `package.json` clean; avoid adding heavy libraries unless necessary.

---

By following this structure, coding assistants can add new components, templates, or behaviors
without breaking the authoring experience or deployment pipeline. Keep this guide updated as
the module evolves. </>
