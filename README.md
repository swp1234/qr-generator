# QR Code Generator

Browser-only QR generator for URL, text, WiFi, contact, email and phone payloads. It supports 12 locales, color/size controls, an in-tab five-item history and PNG download.

## Trust contract

- Inputs and recent history stay in tab memory; they are not persisted or sent in analytics.
- Analytics records only exact-once `start`, `generate`, `download` and successful neutral-share stages.
- Ad serving is suspended for the invalid-traffic incident that began 2026-09-03. The page has no ad loader, unit or request.
- The service worker uses only `qr-generator*` caches, same-origin successful responses and app-relative assets.

## Verification

Run `npm run verify:qr-generator-trust` from the Fire Project root. The verifier checks 12 locale journeys, mobile/desktop layout, QR generation/download, private telemetry, cache scope, advertising containment and injected defects.
