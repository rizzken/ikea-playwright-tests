# Copilot vs hand-written: the "search and filter" test

## Goal

Find out how GitHub Copilot (chat, Ask mode) turns a manual-style test case into a Playwright + TypeScript test, and how much the wording of the test case affects the result. The reference is my own hand-written test `search and filter` (`tests/ikea.spec.ts`).

Scenario under test (IKEA Israel, Hebrew, RTL):

1. Open the home page
2. Click the search bar
3. Enter a product series name (FLISAT)
4. Perform the search
5. Open the "color" filter
6. Select the first color

## Setup

| | Round 1: plain test case | Round 2: extended test case |
|---|---|---|
| Model | MAI-Code-1.1-Flash | GPT-6 Luna |
| Mode | Ask | Ask |
| Files in context | `ikeaHome.ts`, `ikeaCatalog.ts` (existing page objects) | same |
| Test files in workspace | not removed at first, see "Contamination" below | removed |
| Expected result in the prompt | "the catalog page will show only items with the entered series name and of the picked color" | async refresh mentioned; header count must equal both the count under the selected color and the number of product cards |

Notes:
- The model dropdown had no model list for me, so the model was set to **Auto**. I recorded which model answered, but I did not choose it. **The two rounds therefore used different models.**
- Prompts: 
    * MAI-Code-1.1-Flash:
    Hello, I'm an experienced manual QA and this is my first attempt to write an autotest using Playwright with Typescript. The site is in Hebrew (right-to-left), in the context you have two page object files from my colleague - use them where suitable.  Could you please help me to write code for the following scenario:
        Open page https://www.ikea.com/il/he/
        Click the search bar
        Enter the name of a product series (FLISAT)
        Perform Search
        Open Filter by color dropdown
        Select the first color
    Expected result: the catalog page will show only items with the entered series name and of the picked color.

    * GPT-6 Luna:
    Hello, I'm an experienced manual QA and this is my first attempt to write an autotest using Playwright with Typescript. The site is in Hebrew (right-to-left), in the context you have two page object files from my colleague - use them where suitable.  Could you please help me to write code for the following scenario:
        Open page https://www.ikea.com/il/he/
        Click the search bar
        Enter the name of a product series (FLISAT)
        Perform Search
        Open Filter by color dropdown
        Select the first color
    Expected result: after the color is selected, the page updates asynchronously. Once it updates, the number in the results header should equal both the number shown under that color in the filter and the number of product cards displayed on the page.

## Results

| | Round 1 (MAI) | Round 2 (Luna) |
|---|---|---|
| Green on first run | no | yes |
| Fixes needed after first run | 2 (3 iterations in total) | 0 |
| Stability (`--repeat-each=10`, final version) | 10/10 | 10/10 |
| Used existing page object methods | yes | yes (did not use `scrollIntoColor`) |
| Comments in code | present in the first version, removed in later ones | two, near the end |

### Round 1: what happened

1. **First version failed.** The check "the picked color is in the product card text" cannot work: the color name in the filter does not match the wording in product names, and the string it built also contained the count under the color. Expected substring: "בז'9". (See the full code below)
2. **Second version failed** on a race: the header count was read right after the click, while the old results were still on screen.
3. **Third version passed.** The wait was solved with polling.

### Round 2: what happened

Passed on the first run, with the wait for the async update already in place.

### Contamination

When the old test files were still in the workspace, a new chat did not generate code from scratch: the model (MAI) found the existing test and offered a slightly tightened version of it. Workaround: move the test files out of the workspace and start a new chat. I count only the clean run.

## Compared with my hand-written test

| Criterion | My test | Copilot (final versions) |
|---|---|---|
| Readability for a beginner |  I find mine easier to follow | uses more JS tricks (regex, helper function, polling) |
| Readability for an experienced reviewer | Goes straight top-to-bottom, no comments | parseCount written as a separate function. Looks cleaner |
| Conciseness | Noisier: three separate throw guards before the assertions | Single expect.poll check, on failure both values are shown |
| Completeness of checks | UI checks of the search box, card count vs header before the filter, count under color vs header after the filter | count under color vs header **and** card count after the filter |
| Stability | 10/10 | 10/10 |

## Known limitations

- One scenario, one answer per model, one site. These are observations, not statistics.
- **Different models in the two rounds**, so the effect of the prompt and the effect of the model cannot be separated.
- 10/10 means "no failures in 10 runs", not "proven stable". The target is a live site and its content changes.
- Known gap in both versions: if the first color covers all items, the check passes even if the filter does nothing.
- My own test was written with guidance from an AI assistant in a dialogue, so this is not “human vs. AI” but “AI-guided human vs. AI generating code from a specification”.

## What I learned about writing the task

- A vague expected result ("only items of the picked color") became a check that does not match how the site represents color. A concrete, checkable expected result removed that problem in the next round.
- Mentioning that the page updates asynchronously was enough for the wait to appear in the code, without prescribing how to wait.
- A test case for a human tester can leave out waiting and "obvious" steps. For an AI the timing and the exact comparison have to be written down.
- Context matters as much as the prompt: existing tests in the workspace change what the model does.

----------------------------
The **code** of the first iteration of the "weak" prompt:
```typescript
import { test, expect } from '@playwright/test';
import { ikeaHomePage } from '../pages/ikeaHome';
import { ikeaCatalogPage } from '../pages/ikeaCatalog';

test('search FLISAT series and filter by first color', async ({ page }) => {
  const homePage = new ikeaHomePage(page);
  const catalogPage = new ikeaCatalogPage(page);

  // Open the IKEA homepage
  await homePage.goto();
  await homePage.acceptCookies();

  // Click search and enter product series
  await homePage.clickSearchInput();
  await homePage.fillSearchInput('FLISAT');
  await homePage.clickSearchButton();

  // Verify catalog is loaded
  await expect(catalogPage.itemsList).toBeVisible();
  await expect(catalogPage.itemsCountTable.first()).toBeVisible();

  // Open color filter and choose the first color
  await catalogPage.clickColorFilter();
  await catalogPage.scrollIntoColor();
  await expect(catalogPage.colorPickerFirst).toBeVisible();

  const firstColorName = (await catalogPage.colorPickerFirst.textContent())?.trim();
  await catalogPage.clickColorPicker();

  // Verify the filtered page still has results
  await expect(catalogPage.itemsCountTable.first()).toBeVisible();

  // Assert every product card still contains the entered series name
  const productTexts = await catalogPage.itemsCountTable.allTextContents();
  expect(productTexts.length).toBeGreaterThan(0);

  for (const text of productTexts) {
    const normalized = text.toUpperCase();
    expect(normalized).toContain('FLISAT');

    if (firstColorName) {
      expect(normalized).toContain(firstColorName.toUpperCase());
    }
  }
});
```