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

const { test } = require('../../../pluginFixtures.js');
const { VISUAL_URL, MISSION_TIME } = require('../../../constants.js');
const percySnapshot = require('@percy/playwright');

//Declare the scope of the visual test
const inspectorPane = '.l-shell__pane-inspector';

test.describe('Visual - Controlled Clock', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(VISUAL_URL, { waitUntil: 'domcontentloaded' });
  });
  test.use({
    storageState: './e2e/test-data/overlay_plot_with_delay_storage.json',
    clockOptions: {
      now: MISSION_TIME,
      shouldAdvanceTime: true
    }
  });

  test('Inspector from overlay_plot_with_delay_storage @localStorage', async ({ page, theme }) => {
    //Expand the Inspector Pane
    await page.getByRole('button', { name: 'Inspect' }).click();

    await percySnapshot(page, `Inspector view of overlayPlot (theme: ${theme})`, {
      scope: inspectorPane
    });
    //Open Annotations Tab
    await page.getByRole('tab', { name: 'Annotations' }).click();

    await percySnapshot(page, `Inspector view of Annotations Tab (theme: ${theme})`, {
      scope: inspectorPane
    });
  });
});
