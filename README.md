# Employee Portal — Jahia JavaScript Module (SSR)

Hydrogen-style SSR components for an Employee Portal. One directory per component.
- SSR via `default.server.tsx` using `jahiaComponent()`
- Optional hydration via `island.client.tsx`
- Global CND in `/settings/definition.cnd`
- Component-local CND in each component folder (no namespace declaration)
- CND resource bundles named after the module in `/settings/resources/employee-portal_[en|fr].properties`
- Locales in `/settings/locales/[en|fr].json`

## Dev
- `pnpm i && pnpm dev` (or `npm/yarn` equivalents)
- Ensure your Jahia runtime loads this module and maps routes/templates as needed.
