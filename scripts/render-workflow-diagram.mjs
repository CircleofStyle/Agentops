#!/usr/bin/env node
/**
 * Render workflow diagram SVG to PNG for email-safe embedding.
 * Requires Playwright chromium (npx playwright install chromium).
 *
 * Usage: node scripts/render-workflow-diagram.mjs public/workflow-diagrams/quote-follow-up-workflow.svg
 */
import path from 'path';
import { createRequire } from 'module';

const svgPath = process.argv[2];
if (!svgPath) {
  console.error('Usage: node scripts/render-workflow-diagram.mjs <path-to.svg>');
  process.exit(1);
}

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  console.error('Playwright not found. Run: npx playwright install chromium');
  process.exit(1);
}

const absSvg = path.resolve(svgPath);
const outPath = absSvg.replace(/\.svg$/i, '.png');

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 560, height: 420 } });
await page.goto(`file://${absSvg}`);
await page.screenshot({ path: outPath, type: 'png' });
await browser.close();

console.log(`Wrote ${outPath}`);
