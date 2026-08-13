# IKEA Playwright Test Automation

A Playwright + TypeScript E2E test automation portfolio project for [ikea.com/il/he](https://www.ikea.com/il/he/), built to practice test design, the Page Object Model, and CI/CD - with a focus on real-world adaptation, since the target site changed several times during development.

## What's covered

1. **Search & filter** - searches the catalog for a product series, filters results by color, and double-verifies the result count via both the on-page counter text and the actual number of product cards rendered.
2. **Catalog navigation (carousel)** - navigates through the category carousel to a nested category, opens a specific product, and verifies the product name matches between the listing card and the product page (handling invisible Unicode direction characters in the Hebrew text).
3. **Product color variants** - on a product with color swatches, reads the alt text of a variant image, navigates directly to that variant's product page, and verifies the page header matches the swatch's alt text.

## Stack

- [Playwright](https://playwright.dev/) + TypeScript
- Page Object Model
- GitHub Actions (CI)

## Running locally

```bash
npm install
npx playwright install
npx playwright test
```

## CI/CD

Tests run automatically via GitHub Actions on every push. The pipeline installs dependencies and browsers, runs the test suite, zips the Playwright HTML report, and emails it - even if a test fails, so failures are visible without needing to check GitHub manually.

## In progress

- A fourth test scenario (favorites) - being built with GitHub Copilot as an experiment, then rewritten by hand, to compare the two approaches
