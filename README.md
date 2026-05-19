# Biryani House Dordrecht Digital Platform Redesign

Enterprise product specification for rebuilding `biryanihousedordrecht.com` into a production-grade restaurant ordering platform.

## Contents

- [Full Product Specification](docs/product-specification.md)

## Verified Public Audit Sources

- Existing homepage: https://biryanihousedordrecht.com/
- Online ordering page: https://biryanihousedordrecht.com/online-order/
- Table booking page: https://biryanihousedordrecht.com/table-booking/

## Scope

This project defines the product, UX, design system, frontend, backend, POS integration, operations, analytics, SEO, performance, DevOps, and implementation roadmap required to ship a modern restaurant ordering platform.

Backend/POS details are not publicly exposed, so integration architecture is intentionally vendor-neutral and designed around adapter contracts, webhooks, queues, retries, reconciliation, and operational fallbacks.

## Design System

The reusable React design system lives in `src/design-system`.

```tsx
import { Button, MenuItemCard, TextInput } from "./src/design-system";
```

Run the component demo locally:

```bash
npm install
npm run dev
```

Build verification:

```bash
npm run build
```
