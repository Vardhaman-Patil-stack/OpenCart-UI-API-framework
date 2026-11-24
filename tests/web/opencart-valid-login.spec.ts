/**
 * Test Case: Valid login flow
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Open the login page
 * 2) Log in with configured credentials
 * 3) Verify the My Account dashboard
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { Helper } from '../../utils/helper';

test('Valid login flow @master @sanity @regression @web', async ({ homePage }) => {
    const { email, password } = Helper.getLoginDetails();

    await test.step('1) Open the login page', async () => {
        const loginPage = await homePage.openLogin();
        expect(await loginPage.isLoginPageExists()).toBeTruthy();

        await test.step('2) Submit valid credentials', async () => {
            const myAccountPage = await loginPage.login(email, password);

            await test.step('3) Verify the My Account dashboard', async () => {
                expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();
            });
        });
    });

    console.log('✅ ✔️ Valid login completed successfully!');
});
