# Booq Landing Page

Mobile-first marketing page for **Booq**, introducing the app to Nigerian retail merchants, demonstrating how a sale connects counter checkout, thermal receipts, shelf stock, and web sales history, and capturing early-access requests.

Built in strict compliance with **Product Requirements Document (PRD v1)**.

---

## 🚀 Quick Start

The landing page is self-contained with semantic HTML5, modern CSS, and vanilla JavaScript. No complex build step or npm dependency is required.

### Option 1: Open Directly in Any Browser
Open `index.html` directly in your browser of choice.

### Option 2: Local Static Server (Node)
```bash
node server.js
```
Then navigate to `http://localhost:3000/`.

### Run Verification Test Suite
```bash
npm test
# or
node test.js
```

---

## 🎨 Design Tokens & Art Direction

- **Sky Gradient**: `#075B95` to `#0098DC` (rounded panel with 8–16px outer inset white frame)
- **Lime Accent**: `#CEFA50` (primary CTA buttons with circular arrow)
- **Ink Text**: `#151515` (high contrast, WCAG AAA compliant against lime)
- **Soft Grey**: `#F4F4F1`
- **Surface**: `#FFFFFF`
- **Typography**: 
  - Headlines & Body: `DM Sans`
  - Receipt Figures & Micro-labels: `IBM Plex Mono`

---

## 🧩 Key PRD Features Implemented

1. **Section A — Hero & Navigation**:
   - Booq wordmark and accessible responsive navigation (desktop links + mobile drawer with `aria-expanded` and keyboard navigation).
   - Headline: *“Make a sale. Know what’s left.”*
   - Subtitle: *“Booq is a mobile point-of-sale app for retailers. Record a sale on your phone, print a receipt and see what’s left on your shelf.”*
   - Floating 3D Arc of 6 miniature Booq screens (barcode label, item card, cart, centre thermal receipt `#BQ-0104`, stock deduction, and dashboard sales feed) backed by photographic cumulus clouds.
   - Pre-launch badge: *“In development · Product preview”*.

2. **Section B — Merchant Category Strip**:
   - Restrained row: *“For fashion shops · Beauty stores · Mini-marts · Independent retailers”*.

3. **Section C — Product Introduction & Feature Grid**:
   - Section heading: *“One sale, from your counter to your stock count.”*
   - Asymmetric 3-column silhouette (stacked on mobile):
     - **Tile 1 (Photographic)**: Nigerian retail setting with merchant holding phone near Everyday Tee (`₦8,500`).
     - **Tile 2 (Thermal Receipt)**: Itemised receipt BQ-0104 for 2 tees (`₦17,000`).
     - **Tile 3 (Lime Stock Movement)**: Large 10 on shelf (Starting 12 → Sold 2).
     - **Tile 4 (Ink Dashboard)**: Live web sales row with receipt BQ-0104.

4. **Section D — Interactive POS Demo**:
   - Step 1: Tap *“Simulate scan”* → Everyday Tee (Black / M) added at `₦8,500` (qty 1, stock 12).
   - Step 2: Tap *“+”* → Quantity updates to 2, total becomes `₦17,000`.
   - Step 3: Tap *“Record sample sale”* → Locks cart, renders receipt `#BQ-0104`, updates stock from 12 to 10, and appends to web history.
   - Step 4: Tap *“Reset demo”* → Restores starting stock of 12 and returns focus to scan.
   - Live announcements for screen readers via `aria-live="polite"`.
   - `<noscript>` fallback for script-less environments.

5. **Section E — FAQs Accordion**:
   - Semantic `<button aria-expanded="...">` accordion covering Booq's capabilities, thermal printers, web dashboard sync, and early access.

6. **Section F — Early Access Waitlist & Privacy**:
   - Required email input with persistent label and validation (*“Enter a valid email address”*).
   - Optional shop name.
   - Duplicate normalization and storage in localStorage.
   - State handling: *“Joining…”* → *“You’re on the list. We’ll email you when Booq is ready to try.”*
   - Privacy Policy accessible dialog modal.
   - **Zero PII in Analytics**: Custom event tracking strictly scrubs emails before dispatching events (`early_access_click`, `demo_start`, `demo_complete`, `waitlist_success`, `waitlist_error`).

---

## ♿ Accessibility & Performance

- **WCAG AA / AAA Contrast**: Strong contrast on sky gradient and 15:1 contrast on lime buttons with `#151515` ink text.
- **Minimum Touch Targets**: All interactive controls are at least 44px in height.
- **Motion Sensitivity**: Respects `prefers-reduced-motion` to disable animations.
- **Semantic HTML**: Landmarks (`<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<footer>`) with skip link.
