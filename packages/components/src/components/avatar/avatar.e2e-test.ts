import { test } from '../../../config/playwright/setup';
import steps from '../../../config/playwright/setup/steps/accessibility';

test.beforeEach(async ({ componentsPage }) => {
  await componentsPage.mount({
    html: `
        <mdc-avatar alt="test"/>
      `,
  });
});

// TODO: fix e2e test
test.fixme('mdc-avatar', async ({ componentsPage }) => {
  const avatar = componentsPage.page.locator('mdc-avatar');

  // initial check for the avatar be visible on the screen:
  await avatar.waitFor();

  /**
   * ACCESSIBILITY
   */
  await test.step('accessibility', async () => {
    await steps.automaticA11yCheckStep(componentsPage);
  });

  /**
   * VISUAL REGRESSION
   */
  await test.step('visual-regression', async () => {
    await test.step('matches screenshot of element', async () => {
      await componentsPage.visualRegression.takeScreenshot('mdc-avatar', { element: avatar });
    });
  });

  /**
   * ATTRIBUTES
   */
  await test.step('attributes', async () => {
    await test.step('attribute X should be present on component by default', async () => {
      // TODO: add test here
    });
  });

  /**
   * INTERACTIONS
   */
  await test.step('interactions', async () => {
    await test.step('mouse/pointer', async () => {
      await test.step('component should fire callback x when clicking on it', async () => {
        // TODO: add test here
      });
    });

    await test.step('focus', async () => {
      await test.step('component should be focusable with tab', async () => {
        // TODO: add test here
      });

      // add additional tests here, like tabbing through several parts of the component
    });

    await test.step('keyboard', async () => {
      await test.step('component should fire callback x when pressing y', async () => {
        // TODO: add test here
      });
    });
  });
});
