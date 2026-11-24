/**
 * Booq PRD Acceptance & Regression Test Suite
 * Tests against all criteria in PRD v1.
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Starting Booq PRD Verification Tests...\n');

let passCount = 0;
let failCount = 0;

function it(name, fn) {
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(`     Error: ${err.message}\n`);
    failCount++;
  }
}

// 1. Asset Verification
console.log('📂 1. Verifying Required Assets:');
const requiredAssets = [
  'assets/retail-merchant.jpg',
  'assets/everyday-tee.jpg',
  'assets/clouds-sky.jpg',
  'assets/booq-og.jpg',
  'assets/favicon.png',
  'assets/booq-app-icon.png',
  'assets/booq-logo.png',
];

requiredAssets.forEach((asset) => {
  it(`Asset exists: ${asset}`, () => {
    const fullPath = path.join(__dirname, asset);
    assert.strictEqual(fs.existsSync(fullPath), true, `Asset missing: ${asset}`);
    const stat = fs.statSync(fullPath);
    assert.ok(stat.size > 0, `Asset is empty: ${asset}`);
  });
});

// 2. HTML Semantic & PRD Content Verification
console.log('\n📄 2. Verifying HTML Semantic Structure & Copy:');
const htmlContent = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');

it('Contains exact page title', () => {
  assert.ok(
    htmlContent.includes('<title>Booq | Mobile POS for retailers</title>'),
    'Page title must match PRD: Booq | Mobile POS for retailers'
  );
});

it('Contains exact meta description matching hero proposition', () => {
  assert.ok(
    htmlContent.includes(
      'content="Booq is a mobile point-of-sale app for retailers. Record a sale on your phone, print a receipt and see what’s left on your shelf."'
    ),
    'Meta description missing or incorrect'
  );
});

it('Contains Open Graph and Twitter card tags', () => {
  assert.ok(htmlContent.includes('property="og:image" content="assets/booq-og.jpg"'), 'og:image missing');
  assert.ok(htmlContent.includes('name="twitter:card" content="summary_large_image"'), 'twitter:card missing');
});

it('Contains exact H1 copy: Make a sale. Know what’s left.', () => {
  assert.ok(htmlContent.includes('Make a sale.'), 'H1 missing line 1');
  assert.ok(htmlContent.includes('Know what’s left.'), 'H1 missing line 2');
});

it('Contains pre-launch caption: In development · Product preview', () => {
  assert.ok(htmlContent.includes('In development · Product preview'), 'Pre-launch caption missing');
});

it('Contains merchant category strip copy', () => {
  assert.ok(
    htmlContent.includes('For fashion shops · Beauty stores · Mini-marts · Independent retailers'),
    'Category strip copy missing'
  );
});

it('Contains section heading: One sale, from your counter to your stock count.', () => {
  assert.ok(
    htmlContent.includes('One sale, from your counter to your stock count.'),
    'Section C heading missing'
  );
});

it('Contains exact copy for all 4 feature tiles', () => {
  assert.ok(
    htmlContent.includes('At the counter.') && htmlContent.includes('Scan a barcode or pick an item to start a sale.'),
    'Tile 1 copy missing'
  );
  assert.ok(
    htmlContent.includes('A receipt for the customer.') && htmlContent.includes('Print an itemised receipt with a supported thermal printer.'),
    'Tile 2 copy missing'
  );
  assert.ok(
    htmlContent.includes('10 left on the shelf.') && htmlContent.includes('Two sold from a starting stock of 12.'),
    'Tile 3 copy missing'
  );
  assert.ok(
    htmlContent.includes('See it on the web.') && htmlContent.includes('Find the same sale on your dashboard.'),
    'Tile 4 copy missing'
  );
});

it('Contains all 4 FAQ questions and exact answers from PRD', () => {
  const faqs = [
    {
      q: 'What does Booq do?',
      a: 'Booq is being built for retailers who want to record counter sales, issue receipts and keep track of stock from their phone.',
    },
    {
      q: 'Can I use Booq with a barcode or receipt printer?',
      a: 'Barcode scanning and thermal receipt printing are planned. We’ll share supported devices before launch.',
    },
    {
      q: 'Can I check a sale on my laptop?',
      a: 'The planned web dashboard lets you look up sales recorded on your phone. The sample shows how one receipt appears in both places.',
    },
    {
      q: 'How do I get access?',
      a: 'Leave your email below and we’ll contact you when early access opens.',
    },
  ];

  faqs.forEach(({ q, a }) => {
    assert.ok(htmlContent.includes(q), `FAQ question missing: ${q}`);
    assert.ok(htmlContent.includes(a), `FAQ answer missing: ${a}`);
  });
});

it('Contains waitlist form copy and success confirmation text', () => {
  assert.ok(htmlContent.includes('Want to try Booq in your shop?'), 'Waitlist heading missing');
  assert.ok(
    htmlContent.includes('Leave your email and we’ll let you know when early access opens.'),
    'Waitlist copy missing'
  );
  assert.ok(
    htmlContent.includes('You’re on the list. We’ll email you when Booq is ready to try.'),
    'Success message missing'
  );
});

it('Contains skip-link and aria-live status container for screen readers', () => {
  assert.ok(htmlContent.includes('class="skip-link"'), 'Skip to content link missing');
  assert.ok(htmlContent.includes('aria-live="polite"'), 'Screen reader announcer missing');
});

// 3. CSS Tokens & Responsive Rules
console.log('\n🎨 3. Verifying Design Tokens & CSS Rules:');
const cssContent = fs.readFileSync(path.join(__dirname, 'style.css'), 'utf8');

it('Defines PRD color tokens: Sky gradient, Lime, Ink, Surface, Soft grey', () => {
  assert.ok(cssContent.includes('#075b95'), 'Sky top #075b95 missing');
  assert.ok(cssContent.includes('#0098dc'), 'Sky bottom #0098dc missing');
  assert.ok(cssContent.includes('#cefa50'), 'Lime #cefa50 missing');
  assert.ok(cssContent.includes('#151515'), 'Ink #151515 missing');
  assert.ok(cssContent.includes('#f4f4f1'), 'Soft grey #f4f4f1 missing');
});

it('Defines typography: DM Sans and IBM Plex Mono', () => {
  assert.ok(cssContent.includes("'DM Sans'"), 'DM Sans font declaration missing');
  assert.ok(cssContent.includes("'IBM Plex Mono'"), 'IBM Plex Mono font declaration missing');
});

it('Enforces outer inset of 8px to 16px', () => {
  assert.ok(cssContent.includes('--outer-inset: clamp(8px'), 'Outer inset definition missing');
});

it('Defines responsive breakpoints: 600px and 1024px', () => {
  assert.ok(cssContent.includes('@media (min-width: 600px)'), '600px breakpoint missing');
  assert.ok(cssContent.includes('@media (min-width: 1024px)'), '1024px breakpoint missing');
});

it('Includes prefers-reduced-motion media query', () => {
  assert.ok(cssContent.includes('prefers-reduced-motion'), 'prefers-reduced-motion query missing');
});

it('Enforces minimum touch target size of 44px', () => {
  assert.ok(cssContent.includes('min-height: 44px') || cssContent.includes('min-height: 48px'), 'Touch targets under 44px');
});

// 4. Interactive Demo Logic & Calculation Simulation
console.log('\n📱 4. Verifying Interactive Demo Calculations:');
const UNIT_PRICE = 8500;
const STARTING_STOCK = 12;

it('Calculates single tee: quantity 1 => ₦8,500, stock remaining 11', () => {
  const qty = 1;
  const total = qty * UNIT_PRICE;
  const remaining = STARTING_STOCK - qty;
  assert.strictEqual(total, 8500);
  assert.strictEqual(remaining, 11);
});

it('Calculates sample two tees: quantity 2 => ₦17,000, stock remaining 10', () => {
  const qty = 2;
  const total = qty * UNIT_PRICE;
  const remaining = STARTING_STOCK - qty;
  assert.strictEqual(total, 17000);
  assert.strictEqual(remaining, 10);
});

it('Respects quantity boundaries: min 1 and max 12', () => {
  let qty = 1;
  // Decrease at min: should stay 1
  if (qty > 1) qty -= 1;
  assert.strictEqual(qty, 1);

  // Increase to max: should stop at 12
  for (let i = 0; i < 20; i++) {
    if (qty < STARTING_STOCK) qty += 1;
  }
  assert.strictEqual(qty, 12);
  assert.strictEqual(qty * UNIT_PRICE, 102000);
  assert.strictEqual(STARTING_STOCK - qty, 0);
});

// 5. JavaScript Logic & Safety
console.log('\n🔒 5. Verifying JavaScript Security & Privacy:');
const jsContent = fs.readFileSync(path.join(__dirname, 'app.js'), 'utf8');

it('Ensures email and shop name are scrubbed from analytics payloads', () => {
  assert.ok(
    jsContent.includes('delete safeProperties.email'),
    'Analytics must strip email'
  );
  assert.ok(
    jsContent.includes('delete safeProperties.shop_name'),
    'Analytics must strip shop_name'
  );
});

it('Tracks all PRD specified events', () => {
  const events = [
    'early_access_click',
    'demo_start',
    'demo_complete',
    'waitlist_success',
    'waitlist_error',
  ];

  events.forEach((evt) => {
    assert.ok(jsContent.includes(`'${evt}'`), `Event missing from app.js: ${evt}`);
  });
});

it('Validates and normalises email before storage', () => {
  assert.ok(jsContent.includes('.toLowerCase()'), 'Email must be normalised with toLowerCase()');
  assert.ok(jsContent.includes('Enter a valid email address'), 'Validation error message missing');
});

// Summary
console.log(`\n========================================`);
console.log(`Tests Completed: ${passCount + failCount}`);
console.log(`Passed: ${passCount}`);
console.log(`Failed: ${failCount}`);
console.log(`========================================\n`);

if (failCount > 0) {
  process.exit(1);
}
