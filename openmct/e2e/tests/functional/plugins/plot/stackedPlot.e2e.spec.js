/*****************************************************************************
 * Open MCT, Copyright (c) 2014-2023, United States Government
 * as represented by the Administrator of the National Aeronautics and Space
 * Administration. All rights reserved.
 *
 * Open MCT is licensed under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the
 * License for the specific language governing permissions and limitations
 * under the License.
 *
 * Open MCT includes source code licensed under additional open source
 * licenses. See the Open Source Licenses file (LICENSES.md) included with
 * this source code distribution or the Licensing information page available
 * at runtime from the About dialog for additional information.
 *****************************************************************************/

/*
Tests to verify log plot functionality. Note this test suite if very much under active development and should not
necessarily be used for reference when writing new tests in this area.
*/

const { test, expect } = require('../../../../pluginFixtures');
const { createDomainObjectWithDefaults, waitForPlotsToRender } = require('../../../../appActions');

test.describe('Stacked Plot', () => {
  let stackedPlot;
  let swgA;
  let swgB;
  let swgC;

  test.beforeEach(async ({ page }) => {
    // Open a browser, navigate to the main page, and wait until all networkevents to resolve
    await page.goto('./', { waitUntil: 'domcontentloaded' });

    stackedPlot = await createDomainObjectWithDefaults(page, {
      type: 'Stacked Plot'
    });

    swgA = await createDomainObjectWithDefaults(page, {
      type: 'Sine Wave Generator',
      parent: stackedPlot.uuid
    });
    swgB = await createDomainObjectWithDefaults(page, {
      type: 'Sine Wave Generator',
      parent: stackedPlot.uuid
    });
    swgC = await createDomainObjectWithDefaults(page, {
      type: 'Sine Wave Generator',
      parent: stackedPlot.uuid
    });
  });

  test('Using the remove action removes the correct plot', async ({ page }) => {
    const swgAElementsPoolItem = page
      .locator('#inspector-elements-tree')
      .locator('.c-object-label', { hasText: swgA.name });
    const swgBElementsPoolItem = page
      .locator('#inspector-elements-tree')
      .locator('.c-object-label', { hasText: swgB.name });
    const swgCElementsPoolItem = page
      .locator('#inspector-elements-tree')
      .locator('.c-object-label', { hasText: swgC.name });

    await page.goto(stackedPlot.url);

    await page.click('button[title="Edit"]');

    await page.getByRole('tab', { name: 'Elements' }).click();

    await swgBElementsPoolItem.click({ button: 'right' });
    await page
      .getByRole('menuitem')
      .filter({ hasText: /Remove/ })
      .click();
    await page.getByRole('button').filter({ hasText: 'OK' }).click();

    await expect(page.locator('#inspector-elements-tree .js-elements-pool__item')).toHaveCount(2);

    // Confirm that the elements pool contains the items we expect
    await expect(swgAElementsPoolItem).toHaveCount(1);
    await expect(swgBElementsPoolItem).toHaveCount(0);
    await expect(swgCElementsPoolItem).toHaveCount(1);
  });

  test('Can reorder Stacked Plot items', async ({ page }) => {
    const swgAElementsPoolItem = page
      .locator('#inspector-elements-tree')
      .locator('.c-object-label', { hasText: swgA.name });
    const swgBElementsPoolItem = page
      .locator('#inspector-elements-tree')
      .locator('.c-object-label', { hasText: swgB.name });
    const swgCElementsPoolItem = page
      .locator('#inspector-elements-tree')
      .locator('.c-object-label', { hasText: swgC.name });

    await page.goto(stackedPlot.url);

    await page.click('button[title="Edit"]');

    await page.getByRole('tab', { name: 'Elements' }).click();

    const stackedPlotItem1 = page.locator('.c-plot--stacked-container').nth(0);
    const stackedPlotItem2 = page.locator('.c-plot--stacked-container').nth(1);
    const stackedPlotItem3 = page.locator('.c-plot--stacked-container').nth(2);

    // assert initial plot order - [swgA, swgB, swgC]
    await expect(stackedPlotItem1).toHaveAttribute('aria-label', `Stacked Plot Item ${swgA.name}`);
    await expect(stackedPlotItem2).toHaveAttribute('aria-label', `Stacked Plot Item ${swgB.name}`);
    await expect(stackedPlotItem3).toHaveAttribute('aria-label', `Stacked Plot Item ${swgC.name}`);

    // Drag and drop to reorder - [swgB, swgA, swgC]
    await swgBElementsPoolItem.dragTo(swgAElementsPoolItem);

    // assert plot order after reorder - [swgB, swgA, swgC]
    await expect(stackedPlotItem1).toHaveAttribute('aria-label', `Stacked Plot Item ${swgB.name}`);
    await expect(stackedPlotItem2).toHaveAttribute('aria-label', `Stacked Plot Item ${swgA.name}`);
    await expect(stackedPlotItem3).toHaveAttribute('aria-label', `Stacked Plot Item ${swgC.name}`);

    // Drag and drop to reorder - [swgB, swgC, swgA]
    await swgCElementsPoolItem.dragTo(swgAElementsPoolItem);

    // assert plot order after second reorder - [swgB, swgC, swgA]
    await expect(stackedPlotItem1).toHaveAttribute('aria-label', `Stacked Plot Item ${swgB.name}`);
    await expect(stackedPlotItem2).toHaveAttribute('aria-label', `Stacked Plot Item ${swgC.name}`);
    await expect(stackedPlotItem3).toHaveAttribute('aria-label', `Stacked Plot Item ${swgA.name}`);

    // collapse inspector
    await page.locator('.l-shell__pane-inspector .l-pane__collapse-button').click();

    // Save (exit edit mode)
    await page.locator('button[title="Save"]').click();
    await page.getByRole('listitem', { name: 'Save and Finish Editing' }).click();

    // assert plot order persists after save - [swgB, swgC, swgA]
    await expect(stackedPlotItem1).toHaveAttribute('aria-label', `Stacked Plot Item ${swgB.name}`);
    await expect(stackedPlotItem2).toHaveAttribute('aria-label', `Stacked Plot Item ${swgC.name}`);
    await expect(stackedPlotItem3).toHaveAttribute('aria-label', `Stacked Plot Item ${swgA.name}`);
  });

  test('Selecting a child plot while in browse and edit modes shows its properties in the inspector', async ({
    page
  }) => {
    await page.goto(stackedPlot.url);

    await page.getByRole('tab', { name: 'Config' }).click();

    // Click on the 1st plot
    await page.locator(`[aria-label="Stacked Plot Item ${swgA.name}"] canvas`).nth(1).click();

    // Assert that the inspector shows the Y Axis properties for swgA
    await expect(page.locator('[aria-label="Plot Series Properties"] >> h2')).toContainText(
      'Plot Series'
    );
    await expect(page.getByRole('heading', { name: 'Y Axis' })).toBeVisible();
    await expect(
      page.locator('[aria-label="Plot Series Properties"] .c-object-label')
    ).toContainText(swgA.name);

    // Click on the 2nd plot
    await page.locator(`[aria-label="Stacked Plot Item ${swgB.name}"] canvas`).nth(1).click();

    // Assert that the inspector shows the Y Axis properties for swgB
    await expect(page.locator('[aria-label="Plot Series Properties"] >> h2')).toContainText(
      'Plot Series'
    );
    await expect(page.getByRole('heading', { name: 'Y Axis' })).toBeVisible();
    await expect(
      page.locator('[aria-label="Plot Series Properties"] .c-object-label')
    ).toContainText(swgB.name);

    // Click on the 3rd plot
    await page.locator(`[aria-label="Stacked Plot Item ${swgC.name}"] canvas`).nth(1).click();

    // Assert that the inspector shows the Y Axis properties for swgC
    await expect(page.locator('[aria-label="Plot Series Properties"] >> h2')).toContainText(
      'Plot Series'
    );
    await expect(page.getByRole('heading', { name: 'Y Axis' })).toBeVisible();
    await expect(
      page.locator('[aria-label="Plot Series Properties"] .c-object-label')
    ).toContainText(swgC.name);

    // Go into edit mode
    await page.click('button[title="Edit"]');

    await page.getByRole('tab', { name: 'Config' }).click();

    // Click on canvas for the 1st plot
    await page.locator(`[aria-label="Stacked Plot Item ${swgA.name}"]`).click();

    // Assert that the inspector shows the Y Axis properties for swgA
    await expect(page.locator('[aria-label="Plot Series Properties"] >> h2')).toContainText(
      'Plot Series'
    );
    await expect(page.getByRole('heading', { name: 'Y Axis' })).toBeVisible();
    await expect(
      page.locator('[aria-label="Plot Series Properties"] .c-object-label')
    ).toContainText(swgA.name);

    //Click on canvas for the 2nd plot
    await page.locator(`[aria-label="Stacked Plot Item ${swgB.name}"]`).click();

    // Assert that the inspector shows the Y Axis properties for swgB
    await expect(page.locator('[aria-label="Plot Series Properties"] >> h2')).toContainText(
      'Plot Series'
    );
    await expect(page.getByRole('heading', { name: 'Y Axis' })).toBeVisible();
    await expect(
      page.locator('[aria-label="Plot Series Properties"] .c-object-label')
    ).toContainText(swgB.name);

    //Click on canvas for the 3rd plot
    await page.locator(`[aria-label="Stacked Plot Item ${swgC.name}"]`).click();

    // Assert that the inspector shows the Y Axis properties for swgC
    await expect(page.locator('[aria-label="Plot Series Properties"] >> h2')).toContainText(
      'Plot Series'
    );
    await expect(page.getByRole('heading', { name: 'Y Axis' })).toBeVisible();
    await expect(
      page.locator('[aria-label="Plot Series Properties"] .c-object-label')
    ).toContainText(swgC.name);
  });

  test('the legend toggles between aggregate and per child', async ({ page }) => {
    await page.goto(stackedPlot.url);

    // Go into edit mode
    await page.click('button[title="Edit"]');

    await page.getByRole('tab', { name: 'Config' }).click();

    let legendProperties = await page.locator('[aria-label="Legend Properties"]');
    await legendProperties.locator('[title="Display legends per sub plot."]~div input').uncheck();

    await assertAggregateLegendIsVisible(page);

    // Save (exit edit mode)
    await page.locator('button[title="Save"]').click();
    await page.getByRole('listitem', { name: 'Save and Finish Editing' }).click();

    await assertAggregateLegendIsVisible(page);

    await page.reload();

    await assertAggregateLegendIsVisible(page);
  });
});

/**
 * Asserts that aggregate stacked plot legend is visible
 * @param {import('@playwright/test').Page} page
 */
async function assertAggregateLegendIsVisible(page) {
  // Wait for plot series data to load
  await waitForPlotsToRender(page);
  // Wait for plot legend to be shown
  await page.waitForSelector('.js-stacked-plot-legend', { state: 'attached' });
  // There should be 3 legend items
  expect(
    await page
      .locator('.js-stacked-plot-legend .c-plot-legend__wrapper div.plot-legend-item')
      .count()
  ).toBe(3);
}
