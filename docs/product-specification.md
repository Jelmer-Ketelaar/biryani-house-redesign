# Biryani House Dordrecht Digital Platform Redesign Specification

Version: 1.0  
Date: 2026-05-19  
Target: https://biryanihousedordrecht.com/

## 0. Evidence And Assumptions

### Public Evidence

| Area | Observed evidence | Source |
|---|---|---|
| Homepage positioning | "Het Beste Indiase Restaurant in Dordrecht", delivery/takeaway messaging, buffet, catering, address, phone, email | https://biryanihousedordrecht.com/ |
| Navigation | Home, Order Online, Table Booking, Contact Us, About Us, Blog, language toggle | https://biryanihousedordrecht.com/ |
| Ordering | Online menu with categories, item prices, sold-out states, cart total, checkout, delivery time selector | https://biryanihousedordrecht.com/online-order/ |
| Reservation | Occasion selector, guest count, date, time, buffet or a la carte | https://biryanihousedordrecht.com/table-booking/ |
| Localization | Mixed Dutch and English labels appear across Dutch pages | https://biryanihousedordrecht.com/ |
| Operations | Opening hours shown as every day 14:00-22:00; buffet time slots 17:30-19:30 and 19:30-22:00 | https://biryanihousedordrecht.com/ |

### Key Assumptions

| Assumption | Why | Risk | Validation step |
|---|---|---|---|
| Existing site is WordPress or WordPress-like | Public markup and footer indicate agency-built content site with embedded ordering widgets | Moderate | Confirm CMS, hosting, plugin stack, and POS vendor during discovery |
| External POS/order management remains source of operational truth | Requirement states restaurant already uses external POS/order system | High | Identify POS API capabilities, webhook support, menu sync limits, auth model |
| Payments may be handled by current order/POS provider | Public checkout internals are not visible | High | Confirm PSP, payout flow, refund API, PCI scope |
| Staff need low-technical admin | Requirement explicitly states minimal technical knowledge | Low | Run staff workflow interviews and shadow service |

## 1. Current Platform Audit

### Executive Audit Summary

The current platform has useful raw ingredients: local SEO copy, clear restaurant details, a public menu, online ordering, table booking, buffet positioning, and external review links. The conversion problem is that the experience behaves like a content site with ordering attached, rather than a purpose-built commerce system. Mobile ordering, trust signals, localization, menu comprehension, upsells, account/reorder behavior, operational feedback, and structured measurement are not yet treated as first-class product surfaces.

### Prioritized Findings

| Finding | Severity | Business impact | Effort | Recommendation | Why | Tradeoffs | Alternative | Complexity | Technical impact |
|---|---:|---:|---:|---|---|---|---|---|---|
| Ordering is not the dominant first-screen task | Critical | High lost orders | Medium | Make homepage and menu-first mobile layout prioritize "Order delivery", "Order pickup", and "Reserve table" | Restaurant traffic is intent-heavy; users usually want food, location, hours, or booking | Less editorial brand storytelling above the fold | Keep current homepage and add sticky CTA only | M | Requires new IA, CTA routing, availability state |
| Mixed Dutch/English UI | High | Trust loss, comprehension friction | Low-Med | Implement full i18n with Dutch default and English parity | Mixed labels make the platform feel unfinished | More translation management overhead | Dutch-only MVP | M | Requires locale routing, translated menu data, structured slugs |
| Menu lacks decision support | High | Lower AOV, slower browsing | Medium | Add category navigation, photos, dietary tags, spice level, popular badges, bundles, and modifiers | Users scan quickly and need confidence before adding | More menu data maintenance | Keep text menu with better categories | M | Requires menu taxonomy and POS mapping |
| Cart/checkout confidence appears minimal publicly | High | Cart abandonment | Medium | Add clear fees, ETA, minimum order, address validation, payment trust, allergy note handling | Hidden cost and uncertainty are major abandonment drivers | More checkout logic to maintain | Use POS checkout as iframe | H | Requires order quote API and validation |
| Real-time status not visible | High | Support calls, anxiety | Medium | Provide order tracking with status timestamps and customer notifications | Reduces calls and increases trust | POS must expose or accept status events | Email-only updates | M-H | Webhooks, polling fallback, notifications |
| Sold-out items remain noisy | Medium | Frustration | Low | Move sold-out items below available items or hide with toggle | Customers should not scan unavailable food first | Less transparency if hidden | Badge only | S | Availability-aware menu rendering |
| Review trust is underused | Medium | Lower first-order conversion | Low | Show Google/Tripadvisor rating, review count, excerpts, hygiene/payment/secure-order trust row | Local restaurant trust drives first purchase | Needs ongoing rating freshness | Static testimonials | S | Review ingestion or manual CMS fields |
| Reservation flow lacks completion clarity | Medium | Lost bookings | Medium | Add dedicated booking confirmation, contact capture, capacity rules, and reminder workflow | Current public form only exposes selection inputs | Requires table inventory model or POS/table tool integration | Link to phone/WhatsApp only | M | Booking service or external reservation adapter |
| SEO pages are broad and duplicated | Medium | Missed local demand | Medium | Build local landing pages and schema for restaurant, menu, buffet, catering, delivery, takeaway | Captures high-intent searches like "biryani Dordrecht bezorgen" | Must avoid thin/duplicated pages | Blog-only SEO | M | Structured content model and canonical policy |
| Operational admin unclear | High | Staff workaround risk | High | Build staff dashboard for orders, menu availability, promotions, refunds, support, and alerts | Staff need control without developer access | More product surface area | Manage everything in POS only | H | Admin RBAC, audit log, POS adapter |

### UX And Conversion Teardown

| Area | Current issue | Root cause | Proposed fix | Business impact |
|---|---|---|---|---|
| First impression | Site emphasizes generic restaurant copy before actionable ordering state | Content-first template | Availability-aware hero: open/closed, ETA, delivery/pickup toggle, top dishes | Higher order starts |
| Menu browsing | Long list with inconsistent descriptions and duplicated drink categories | POS/menu data rendered without product UX layer | Menu taxonomy, item cards, sticky category rail, search, filters | Higher add-to-cart rate |
| Item detail | Public text does not show robust modifier/allergy UX | Product data likely under-modeled | Modifier groups, allergy warnings, spice options, notes, recommended add-ons | Higher AOV, safer orders |
| Cart | Cart exists but weak persuasive structure | Basic e-commerce widget | Smart cart: progress to delivery minimum, upsells, fee transparency, checkout confidence | Lower abandonment |
| Checkout | Unknown/opaque payment and confirmation behavior | External system hidden | Native quote/order/payment orchestration with POS handoff | More measurable funnel |
| Mobile | Long content, small repeated nav, mixed language | Desktop content stacked on mobile | Mobile app-like shell with bottom cart and thumb-zone CTAs | Higher mobile conversion |

### Technical Audit

Publicly visible architecture suggests a CMS-driven site with embedded menu/order components. Exact backend, database, POS, and payment internals are not exposed and must be confirmed.

| Dimension | Risk indicator | Recommendation |
|---|---|---|
| Frontend maintainability | Long HTML output, repeated nav/footer, content/widget coupling | Replace with typed component architecture and CMS-backed content |
| Backend maintainability | Unknown order orchestration layer | Introduce backend-for-frontend and POS adapter layer |
| Performance | Image-heavy restaurant site likely without strict budgets | Use edge-rendered pages, optimized images, minimal client JS |
| Scalability | Single-location assumptions | Model location, service area, hours, menu availability, tax/fees as first-class entities |
| Observability | Public site exposes no operational feedback | Add logs, metrics, tracing, order reconciliation dashboards |

## 2. Product Strategy

### Target Segments

| Segment | Need | Psychology | Product response | KPI |
|---|---|---|---|---|
| Local delivery customer | Fast dinner decision | Wants certainty, speed, good value | ETA-first menu, popular items, bundles, stored address | Delivery conversion |
| Takeaway customer | Reliable pickup time | Avoid waiting | Pickup scheduler, ready-time notifications | Pickup order completion |
| Family/group order | Variety and portions | Needs confidence for multiple people | Meal deals, serving guidance, spice/dietary tags | AOV |
| Buffet diner | Book a table | Wants price, times, capacity clarity | Buffet landing page, reservation slots, reminder | Reservation conversion |
| Catering lead | Event feeding solution | Needs trust and responsiveness | Catering quote flow, packages, lead capture, follow-up SLA | Qualified leads |
| Returning customer | Repeat favorite | Wants speed | Reorder, loyalty, saved payment/address | Repeat rate |

### Positioning

Core proposition: Authentic South Asian food in Dordrecht, ordered with the confidence, speed, and polish of a modern delivery app.

| Strategy | Why | Tradeoffs | Alternative | Complexity | Business impact | Technical impact |
|---|---|---|---|---|---|---|
| Lead with "Order in under 60 seconds" for returning users | Returning users convert fastest when friction is removed | Requires accounts and order history | Guest-only checkout | M | High repeat conversion | Auth, profiles, reorder API |
| Position buffet and catering as separate missions | Delivery and reservation users have different intent | More pages to maintain | Single homepage section | S-M | Better SEO and lead quality | CMS content types |
| Use food photography as trust proof | Cuisine is visual and unfamiliar items need context | Requires professional asset process | Stock imagery | M | Higher menu confidence | DAM/image pipeline |
| Add operational transparency | ETA, fees, open status, sold-out state reduce doubt | Requires reliable data sync | Static hours only | M-H | Lower abandonment/support | Availability engine |

### Customer Journey Map

| Stage | User question | Current friction | New platform response | Measurement |
|---|---|---|---|---|
| Discover | "Is this good and near me?" | Review links are external and understated | Local SEO pages, ratings, photos, schema | Organic CTR, landing conversion |
| Decide | "What should I order?" | Long text menu | Popular dishes, filters, bundles, recommendations | Item detail views, add rate |
| Commit | "What will it cost and when arrives?" | Fees/ETA not prominent | Quote before checkout, delivery zone validation | Checkout start rate |
| Pay | "Can I trust this?" | Trust signals sparse | Secure payment, clear cancellation/refund policy | Payment completion |
| Wait | "Where is my food?" | Real-time state unclear | Order tracker, SMS/email/WhatsApp updates | Support contact rate |
| Return | "Can I order again quickly?" | No visible account/reorder | Reorder from history, loyalty credit | Repeat purchase rate |

## 3. Information Architecture

### Sitemap

```text
/
├── /menu
│   ├── /menu/biryani
│   ├── /menu/curry
│   ├── /menu/tandoori-grill
│   ├── /menu/vegetarian
│   ├── /menu/breads-rice
│   ├── /menu/desserts
│   └── /menu/drinks
├── /order
│   ├── /order/delivery
│   ├── /order/takeaway
│   ├── /order/checkout
│   └── /order/track/[orderId]
├── /buffet
├── /reserve
├── /catering
├── /loyalty
├── /account
│   ├── /account/orders
│   ├── /account/addresses
│   └── /account/rewards
├── /locations/dordrecht
├── /blog
├── /contact
├── /about
└── /legal
    ├── /privacy
    ├── /terms
    └── /allergens
```

### URL And SEO Hierarchy

| Recommendation | Why | Tradeoffs | Alternative | Complexity | Business impact | Technical impact |
|---|---|---|---|---|---|---|
| Use `/menu/[category]/[item]` canonical item URLs | Menu items can rank for local long-tail searches | More pages and schema to manage | Menu-only page | M | SEO traffic and shareability | Slug generation, canonical tags |
| Use `/order` as transactional app route | Separates SEO content from app state | Requires routing discipline | One menu page does all | M | Cleaner funnel tracking | App shell route |
| Use locale prefixes `/nl` and `/en` | Avoid mixed-language indexing | Slightly longer URLs | Cookie-based language only | M | Better SEO and UX | i18n routing, hreflang |
| Build `/buffet`, `/catering`, `/reserve` as intent pages | These are separate revenue lines | Content maintenance | Homepage sections only | S | Higher reservation/catering leads | CMS templates |

### Menu Taxonomy

| Level | Examples | Required metadata |
|---|---|---|
| Category | Biryani, Curry, Grill, Vegetarian, Breads, Drinks | Sort order, availability, image, SEO copy |
| Item | Chicken Biryani, Butter Chicken, Garlic Naan | Price, description, photo, spice, allergens, dietary flags |
| Modifier group | Spice level, protein, side, drink, extras | Required/optional, min/max, price delta |
| Bundle | Family biryani set, dinner for two | Components, substitutions, savings |
| Availability | Sold out, lunch only, buffet only | Time window, channel, location |

## 4. Full UX Redesign

### Global UX Principles

| Principle | Why | Tradeoff | Impact |
|---|---|---|---|
| Task-first navigation | Most visitors want order, reserve, call, directions | Less space for generic content | Higher intent completion |
| Progressive checkout | Ask only what is needed when needed | More state handling | Lower form fatigue |
| Availability everywhere | Prevents disappointment | Requires accurate data | Fewer failed orders |
| Mobile thumb ergonomics | Food ordering is mobile-heavy | Needs dedicated mobile layout | Higher mobile conversion |

### Homepage Wireframe

```text
[Sticky top bar: open status | ETA | language | account]
[Hero: Biryani House Dordrecht]
  [Delivery] [Pickup] [Reserve]
  Address/postcode input
  Popular actions: Order now, Buffet booking, Catering quote
[Popular dishes carousel]
[Why order direct: best price, loyalty, secure payment, live updates]
[Menu preview by category]
[Buffet section with time slots]
[Reviews + rating proof]
[Location, hours, map, contact]
```

| UX decision | Why | Tradeoffs | Alternative | Complexity | Business impact | Technical impact |
|---|---|---|---|---|---|---|
| Open/closed and ETA in hero | Users decide immediately whether ordering is viable | Requires operations data | Static hours below fold | M | Higher order starts | Hours and quote API |
| Postcode validation before browsing delivery | Avoids late checkout failure | Some users dislike early input | Validate at checkout | M | Lower abandonment | Service area API |
| Popular dishes above full menu | Reduces choice overload | Could bias against full catalog | Category-only entry | S | Faster add-to-cart | Merchandising fields |

### Menu Browsing Flow

```text
Entry -> choose delivery/pickup -> menu loads with availability
     -> category rail/search/filter
     -> item card -> item detail
     -> modifier selection -> add to cart
     -> cart upsell -> checkout
```

| Element | Reasoning | Mobile optimization | Accessibility | Edge cases |
|---|---|---|---|---|
| Sticky category rail | Keeps large menu navigable | Horizontal chips under header | Roving tabindex, visible focus | Category sold out |
| Item cards | Fast scanning with image, name, price, badges | Two-line max title, price persistent | Alt text, semantic buttons | Missing images use branded fallback |
| Filters | Vegetarian, spicy, gluten, popular | Bottom sheet filters | Checkbox controls | All filters empty state |
| Sold-out handling | Reduce frustration | Disabled card below available items | Announce unavailable state | POS sync lag |

### Item Customization

```text
[Photo]
[Name, price, spice/dietary/allergens]
[Required modifiers]
[Optional extras]
[Chef recommendations]
[Quantity stepper]
[Add to cart sticky button]
```

| Decision | Why | Tradeoffs | Alternative | Complexity | Business impact | Technical impact |
|---|---|---|---|---|---|---|
| Required modifier validation inline | Prevents invalid POS orders | More setup per item | Free-text notes | M | Fewer kitchen errors | Modifier schema |
| Allergy warning before add | Food safety and trust | Needs accurate allergen data | Legal page only | M | Risk reduction | Allergen metadata |
| Contextual upsells | Increase AOV without friction | Can feel aggressive if overdone | Cart-only upsells | M | Higher AOV | Recommendation rules |

### Checkout Flow

```text
Cart -> service method -> address/pickup time -> contact -> payment -> POS confirmation -> success/tracking
```

| Step | Conversion goal | Implementation notes | Edge cases |
|---|---|---|---|
| Cart | Confirm value and next step | Minimum order progress, promo input, upsells | Item becomes unavailable |
| Service | Delivery/pickup/scheduled | Quote ETA and fees | Closed hours, capacity full |
| Address | Validate deliverability | Postcode + geocode + zone rules | Borderline address |
| Contact | Guest or account | Email/phone required for updates | Duplicate account |
| Payment | Complete securely | PSP-hosted elements or redirect | Payment authorized but POS fails |
| Confirmation | Trust and tracking | Order id, ETA, status timeline | Delayed POS ack |

### Order Tracking State Flow

```text
Draft
 -> PaymentPending
 -> PaymentAuthorized
 -> SubmittedToPOS
 -> AcceptedByRestaurant
 -> Preparing
 -> ReadyForPickup / OutForDelivery
 -> Completed
 -> Refunded / Cancelled
```

| State | User message | Staff action | System action |
|---|---|---|---|
| SubmittedToPOS | "Sending to kitchen" | None unless timeout | Retry/idempotency |
| AcceptedByRestaurant | "Restaurant confirmed" | Accept in POS/admin | Notify customer |
| Preparing | "Being prepared" | Kitchen updates | Update tracker |
| ReadyForPickup | "Ready to collect" | Mark ready | SMS/email |
| OutForDelivery | "On the way" | Driver/status update | ETA update |

### Account, Reorder, Promotions, Loyalty

| Flow | UX recommendation | Why | Complexity | Business impact |
|---|---|---|---|---|
| Account creation | Optional after first order | Guest checkout protects conversion | M | Higher completion |
| Reorder | "Order again" from previous orders | Returning customers want speed | M | Higher repeat rate |
| Promotions | Auto-apply eligible offers before coupon field | Reduces coupon frustration | M | Higher conversion |
| Loyalty | Points or stamp-card model | Simple restaurant-friendly retention | M | Higher repeat frequency |

## 5. Design System

### Brand Direction

Premium, warm, food-led, direct, local. Avoid generic curry-house visual clutter. Use deep charcoal text, saffron/gold accents, fresh green success states, restrained red for spice/alerts, and strong food photography.

### Tokens

```css
:root {
  --color-bg: #fffaf2;
  --color-surface: #ffffff;
  --color-text: #211a16;
  --color-muted: #6f6258;
  --color-brand: #b33a1c;
  --color-brand-strong: #8f2d16;
  --color-accent: #d89a1f;
  --color-success: #217a4d;
  --color-warning: #c77700;
  --color-danger: #b3261e;
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --radius-sm: 4px;
  --radius-md: 8px;
  --shadow-1: 0 1px 2px rgb(0 0 0 / 12%);
  --shadow-2: 0 8px 24px rgb(0 0 0 / 14%);
}
```

### Typography

| Token | Size | Line height | Use |
|---|---:|---:|---|
| display | 44 | 52 | Homepage hero only |
| h1 | 32 | 40 | Page titles |
| h2 | 24 | 32 | Sections |
| h3 | 20 | 28 | Cards/modals |
| body | 16 | 24 | Main text |
| small | 14 | 20 | Metadata |
| caption | 12 | 16 | Badges/legal |

### Component Library

| Component | Required states | Accessibility | Performance |
|---|---|---|---|
| Button | default, hover, focus, loading, disabled | 44px min target, visible focus | No layout shift on loading |
| Item card | available, sold-out, popular, selected | Semantic article + button | Lazy image |
| Modifier group | valid, invalid, disabled | Fieldset/legend | Client validation only after data load |
| Cart drawer | empty, active, validating, error | Focus trap on mobile | Virtualize long carts if needed |
| Toast/alert | info, success, warning, error | ARIA live region | Auto-dismiss only non-critical |
| Time slot picker | available, full, closed | Keyboard grid | Server-confirmed slots |

### Motion

| Motion | Rule | Why |
|---|---|---|
| Page transitions | 120-180ms fade/slide max | Feels responsive without delay |
| Cart add | Short confirmation animation | Reinforces action |
| Skeletons | Use only for app data | Avoid spinner anxiety |
| Reduced motion | Respect `prefers-reduced-motion` | Accessibility |

## 6. Frontend Engineering

### Recommended Stack

| Layer | Recommendation | Why | Tradeoffs | Alternative | Complexity | Business impact | Technical impact |
|---|---|---|---|---|---|---|---|
| Framework | Next.js App Router with TypeScript | Strong SSR/ISR, i18n, SEO, ecosystem | Requires React expertise | Nuxt, Remix, Astro + islands | M | Faster SEO-commerce build | Component + route conventions |
| Styling | CSS modules or Tailwind with tokens | Fast consistent UI | Tailwind can become noisy | Vanilla CSS only | S-M | Design velocity | Tokenized styles |
| State | Server state via TanStack Query; cart via Zustand or reducer | Separates remote data from local cart | Two mental models | Redux Toolkit | M | Reliable ordering UX | Cache invalidation discipline |
| Forms | React Hook Form + Zod | Typed validation | Schema maintenance | Native forms only | S-M | Fewer checkout errors | Shared schemas |
| Localization | `next-intl` or equivalent | Locale routes and typed messages | Translation workflow | Custom i18n | M | Trust and SEO | Message catalog |
| Testing | Playwright + Vitest | Covers checkout flows and units | Test maintenance | Cypress | M | Lower production risk | CI browser runs |

### Rendering Strategy

| Route type | Strategy | Why |
|---|---|---|
| Homepage, SEO pages | ISR with short revalidation | Fast static delivery with content freshness |
| Menu category pages | ISR + on-demand revalidate after menu sync | SEO plus current prices/availability |
| Ordering app | SSR shell + client interactivity | Accurate availability and cart state |
| Checkout | Dynamic server rendering | Avoid stale fees, times, auth/payment state |
| Order tracking | Dynamic/polling/SSE | Real-time status |

### Frontend Architecture

```text
apps/web
├── app/[locale]
│   ├── (marketing)
│   ├── (ordering)
│   └── account
├── components
│   ├── design-system
│   ├── menu
│   ├── cart
│   ├── checkout
│   └── account
├── features
│   ├── ordering
│   ├── loyalty
│   ├── reservations
│   └── analytics
├── lib
│   ├── api-client
│   ├── i18n
│   ├── tracking
│   └── validation
└── tests
```

## 7. Backend Engineering

### Domain Architecture

```text
Backend for Frontend API
├── Identity
├── Menu Catalog
├── Availability & Hours
├── Cart & Order Quote
├── Orders
├── Payments
├── POS Integration
├── Promotions
├── Loyalty
├── Reservations
├── Notifications
├── Admin
└── Analytics Events
```

### Service Boundaries

| Service | Responsibility | Source of truth |
|---|---|---|
| Menu Catalog | Normalized menu, modifiers, translations, SEO slugs | POS or admin, depending vendor capability |
| Availability | Opening hours, capacity, delivery zones, sold-out | POS/admin |
| Order Quote | Fees, discounts, minimums, ETA | Platform |
| Orders | Platform order lifecycle and idempotency | Platform with POS mirror |
| Payments | Payment intent, capture, refunds | PSP |
| POS Adapter | Vendor-specific sync and status mapping | External POS |
| Notifications | Email/SMS/WhatsApp messages | Platform |

### Database Strategy

Use PostgreSQL for transactional data, Redis for short-lived carts/rate limits/locks, object storage for images, and a warehouse/event sink for analytics.

```text
locations(id, name, address, timezone, phone, email)
service_areas(id, location_id, polygon/postcodes, min_order, delivery_fee)
opening_hours(id, location_id, day, open_time, close_time, service_type)
menu_categories(id, location_id, name, slug, sort_order)
menu_items(id, category_id, pos_item_id, name, description, price, active)
item_translations(id, item_id, locale, name, description, slug)
modifier_groups(id, item_id, name, min_select, max_select, required)
modifiers(id, group_id, pos_modifier_id, name, price_delta)
customers(id, email, phone, name, created_at)
addresses(id, customer_id, label, postcode, street, city, geo)
orders(id, location_id, customer_id, status, service_type, total, pos_order_id)
order_items(id, order_id, item_id, quantity, unit_price, notes)
payments(id, order_id, provider, intent_id, status, amount)
promotions(id, code, rules_json, starts_at, ends_at)
loyalty_accounts(id, customer_id, points_balance)
webhook_events(id, provider, event_id, payload, processed_at)
integration_jobs(id, type, status, attempts, next_run_at)
audit_logs(id, actor_id, action, target_type, target_id, diff_json)
```

### API Examples

```http
POST /api/order-quotes
Content-Type: application/json

{
  "locationId": "dordrecht",
  "serviceType": "delivery",
  "postcode": "3311 VP",
  "scheduledFor": "2026-05-19T18:30:00+02:00",
  "items": [
    {
      "itemId": "chicken-biryani",
      "quantity": 2,
      "modifiers": [{"id": "spice-medium"}]
    }
  ],
  "promotionCode": "WELCOME10"
}
```

```json
{
  "quoteId": "quote_123",
  "validUntil": "2026-05-19T16:04:00+02:00",
  "subtotal": 29.98,
  "deliveryFee": 3.50,
  "discount": 3.00,
  "total": 30.48,
  "etaMinutes": 45,
  "warnings": []
}
```

### Security And Reliability

| Area | Recommendation | Why | Complexity |
|---|---|---|---|
| Auth | Passwordless email/SMS magic links plus OAuth optional | Low-friction accounts | M |
| Admin RBAC | Roles: owner, manager, staff, support, analyst | Prevent accidental destructive changes | M |
| Idempotency | Required for checkout/order submit/refund | Avoid duplicate orders | M |
| Rate limiting | Per IP/user/endpoint | Protect checkout and auth | S |
| Webhook verification | HMAC signatures and replay protection | Prevent forged POS/PSP updates | M |
| Audit logs | All admin changes and refunds | Operational accountability | M |
| Observability | Structured logs, traces, metrics | Faster incident response | M |

## 8. POS / Order System Integration

### Architecture

```text
Web/App
  -> Platform API
    -> Order Quote
    -> Payment Provider
    -> Order Orchestrator
      -> Queue
        -> POS Adapter
          -> External POS
External POS
  -> Webhook Receiver
    -> Event Store
    -> Order State Machine
    -> Notifications
    -> Admin Dashboard
```

### Order Submission Sequence

```text
Customer -> API: create quote
API -> Availability: validate service area/time/items
API -> PSP: create payment intent
Customer -> PSP: authorize payment
PSP -> API: payment_authorized webhook
API -> Orders: create order PaymentAuthorized
API -> Queue: submit_to_pos job
Queue -> POS Adapter: create order idempotency_key
POS -> Adapter: accepted/rejected
Adapter -> Orders: update status
Orders -> Notifications: send confirmation or failure
```

### Integration Recommendations

| Recommendation | Why | Tradeoffs | Alternative | Complexity | Business impact | Technical impact |
|---|---|---|---|---|---|---|
| Use a vendor adapter interface | POS vendors change; platform should not | More abstraction upfront | Direct POS calls everywhere | M | Future-proofing | Cleaner boundaries |
| Platform order id before POS id | Needed for idempotency and customer tracking | Must reconcile if POS fails | POS id only | M | Prevents duplicate/ghost orders | Local order store |
| Queue all POS writes | POS APIs can be slow/down | Slight async delay | Synchronous checkout only | M | More reliable checkout | Worker + retry |
| Capture payment after POS acceptance when possible | Avoids refunding rejected orders | PSP/POS timing complexity | Capture before POS submit | H | Fewer refund issues | Payment state machine |
| Reconcile every 15 minutes | Finds missed webhooks/status drift | Requires POS read API | Manual checks only | M | Operational confidence | Scheduled jobs |

### Retry Strategy

| Failure | Retry | Customer state | Staff state |
|---|---|---|---|
| POS timeout | Exponential backoff: 10s, 30s, 2m, 5m | "Confirming with restaurant" | Alert after 2 minutes |
| POS rejects item | Stop retry, request substitution/refund | "Restaurant cannot accept item" | Staff action required |
| Payment webhook delayed | Poll PSP for intent | "Payment processing" | No action unless timeout |
| Notification failure | Retry channel, fallback email/SMS | Tracker still works | Alert only after repeated failure |

### Menu Sync

```text
Nightly full import
 + hourly incremental sync where supported
 + manual "sync now"
 + POS webhook ingestion where supported
 + conflict UI for renamed/removed/modifier-changed items
```

## 9. Performance Engineering

### Budgets

| Metric | Target mobile 4G | Hard ceiling |
|---|---:|---:|
| LCP | < 2.0s | 2.5s |
| INP | < 150ms | 200ms |
| CLS | < 0.05 | 0.1 |
| TTFB | < 300ms cached, < 800ms dynamic | 1s |
| JS initial route | < 120KB gzip | 170KB |
| Images above fold | < 250KB total | 400KB |
| Font files | <= 2 files | 3 files |

### Strategy

| Recommendation | Why | Tradeoffs | Alternative | Complexity | Impact |
|---|---|---|---|---|---|
| CDN edge caching for marketing/menu pages | Fast local loads | Cache invalidation needed | Origin-only | M | Higher SEO/conversion |
| Serve AVIF/WebP responsive images | Food images drive conversion but are heavy | Asset pipeline complexity | JPEG only | M | Better LCP |
| Use system font or one variable font | Reduces render blocking | Less brand uniqueness | Multiple web fonts | S | Faster first render |
| Partial hydration/client islands | Menu pages do not need full JS | More architecture discipline | SPA | M | Lower JS/INP |
| Preload hero image only | Avoid resource contention | Requires route-specific metadata | Lazy everything | S | Better LCP |

## 10. Analytics & Experimentation

### KPI Framework

| KPI | Definition | Primary owner |
|---|---|---|
| Order conversion rate | Completed orders / order sessions | Product |
| Checkout completion | Paid orders / checkout starts | Product/Engineering |
| AOV | Revenue / completed orders | Operations |
| Reorder rate | Customers with repeat order in 30 days | CRM |
| Cart abandonment | Carts without checkout completion | Product |
| Support contact rate | Support contacts / orders | Operations |
| Organic conversion | Orders from organic sessions | SEO |

### Event Tracking Plan

| Event | Required properties |
|---|---|
| `menu_viewed` | locale, service_type, location_id, source |
| `category_viewed` | category_id, category_name |
| `item_viewed` | item_id, price, category_id, availability |
| `item_added` | item_id, quantity, modifiers_count, upsell_source |
| `cart_viewed` | item_count, subtotal, min_order_remaining |
| `checkout_started` | service_type, subtotal |
| `delivery_address_validated` | postcode_prefix, deliverable, fee |
| `payment_started` | provider, total |
| `order_completed` | order_id, total, service_type, discount, eta |
| `order_failed` | stage, reason_code |
| `promotion_applied` | code, discount |
| `reorder_clicked` | previous_order_age_days |

### Experimentation

| Test | Hypothesis | Guardrail |
|---|---|---|
| Popular dish rail vs category-first | Popular items reduce choice overload | AOV, bounce |
| Auto-applied promo vs coupon field | Visible discount improves checkout completion | Margin |
| Bundle recommendation in cart | Bundles increase AOV | Checkout abandonment |
| Account prompt after payment vs before | Post-order signup avoids checkout friction | Account creation rate |

## 11. Operations & Admin

### Staff Dashboard

```text
Today
├── Live orders
├── Delayed orders
├── Refunds/action needed
├── Sold-out controls
├── Menu sync health
├── Reservation list
├── Promotions
└── Alerts
```

### Operational Workflows

| Workflow | Staff UX | System behavior | Why |
|---|---|---|---|
| Mark item sold out | Toggle item until next day/custom time | Pushes availability to web, blocks checkout | Avoid bad orders |
| Delay order | Choose +10/+20/+30 min and reason | Notifies customer, updates tracker | Reduces calls |
| Refund | Select items/full order, reason | Calls PSP/POS if supported, audit log | Controlled finance flow |
| Reservation view | Timeline by time slot | Capacity warnings and contact info | Simple service prep |
| Promotion setup | Template-based offers | Validates margin/time/channel | Staff-safe marketing |

## 12. Deployment & DevOps

### Infrastructure

| Layer | Recommendation | Why | Tradeoffs |
|---|---|---|---|
| Web hosting | Vercel/Netlify/Cloudflare Pages for frontend | Edge performance and simple deploys | Vendor platform coupling |
| API | Containerized Node/NestJS or lightweight Fastify on managed platform | Explicit backend control | More ops than serverless-only |
| DB | Managed PostgreSQL | Reliability/backups | Cost |
| Queue | Managed Redis/BullMQ or cloud queue | POS retries and background jobs | Worker complexity |
| Observability | Sentry + OpenTelemetry + uptime checks | Production visibility | Setup overhead |
| Secrets | Managed secret store | Prevent leaks | Environment management |

### Environments

```text
local -> preview -> staging -> production
```

| Environment | Purpose | Data |
|---|---|---|
| Local | Developer iteration | Seeded fake POS/PSP |
| Preview | PR validation | Isolated test data |
| Staging | Staff/UAT and POS sandbox | POS sandbox, PSP test |
| Production | Live orders | Real POS/PSP |

### CI/CD

```text
PR opened
 -> lint/typecheck/unit tests
 -> build
 -> Playwright critical flows
 -> preview deployment
 -> approval for production
 -> deploy
 -> smoke tests
 -> monitor error rate/order failures
```

### Rollback

| Failure | Rollback |
|---|---|
| Frontend regression | Instant previous deployment rollback |
| API regression | Blue/green or canary rollback |
| DB migration issue | Backward-compatible migrations only; roll-forward preferred |
| POS integration failure | Disable direct ordering, route to phone/POS fallback banner |

## 13. Implementation Roadmap

### MVP Scope

| Workstream | Scope | Complexity | Risk |
|---|---|---:|---|
| Discovery | POS/PSP/vendor API audit, staff workflow interviews, menu data cleanup | M | POS limitations |
| Web foundation | Next.js app, i18n, design system, SEO pages | M | Content migration |
| Menu/order | Menu browsing, cart, delivery/pickup, scheduled orders, checkout | H | POS/payment edge cases |
| Integration | POS adapter, webhook receiver, queue retries, reconciliation | H | Vendor reliability |
| Admin | Live orders, item availability, alerts | M | Staff adoption |
| Analytics | Funnel events, dashboard, error tracking | M | Event quality |

### Phase 2

| Feature | Why | Complexity |
|---|---|---:|
| Loyalty | Improve repeat purchase | M |
| Account profiles/reorder | Speed up repeat orders | M |
| Advanced promotions | Drive AOV and off-peak demand | M |
| Catering quote CRM | Capture higher-value leads | M |
| Reservation capacity management | Reduce manual booking friction | M |

### Future Roadmap

| Feature | Trigger |
|---|---|
| Multi-location support | Second branch planned |
| Driver dispatch integration | Delivery volume warrants |
| Kitchen display system | POS does not cover kitchen flow well |
| Native app/PWA install prompts | Repeat user volume justifies |
| AI-assisted menu recommendations | Enough behavioral data exists |

### Suggested Timeline

| Phase | Duration | Exit criteria |
|---|---:|---|
| Discovery and integration proof | 2 weeks | POS/PSP contracts proven in sandbox |
| UX/design system | 2-3 weeks | Approved responsive prototypes |
| MVP build | 6-8 weeks | End-to-end order through POS sandbox |
| Staff UAT | 1-2 weeks | Staff can operate without developer help |
| Launch hardening | 1 week | Load, rollback, monitoring, runbooks complete |
| Production rollout | 1 week | Phased traffic and successful real orders |

## 14. Final Executive Summary

The rebuild should move Biryani House from a content website with ordering attached to a true direct-ordering commerce platform. The highest-value change is not visual polish alone; it is operationally reliable ordering with fast mobile browsing, transparent ETA/fees, real-time order states, strong menu merchandising, and staff-safe administration.

Expected impact ranges, assuming normal restaurant traffic and successful POS integration:

| Area | Expected improvement |
|---|---|
| Order conversion | 15-35% lift from faster mobile ordering, clearer CTAs, and lower checkout uncertainty |
| Average order value | 8-18% lift from bundles, modifiers, cart upsells, and loyalty incentives |
| Support calls | 20-40% reduction from tracking, notifications, and ETA clarity |
| SEO | More qualified local traffic through structured menu/location/buffet/catering pages |
| Operations | Fewer failed orders through availability sync, retries, alerts, and reconciliation |
| Scalability | Multi-location readiness through location-aware menu, hours, service zones, and POS adapters |

The first implementation priority is a POS/payment proof of concept. If that is reliable, the rest of the platform can be built around it with confidence. If the POS has limited APIs, the architecture still works by using a hybrid model: platform-native customer experience, queued POS submission where possible, and staff/admin fallbacks for unsupported workflows.
