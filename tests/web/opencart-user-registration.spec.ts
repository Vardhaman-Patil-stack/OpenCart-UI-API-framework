/**
 * Test Case: User registration flow
 *
 * Tags: @master @sanity @regression @web
 *
 * Steps:
 * 1) Open the registration page
 * 2) Complete registration with dynamic customer data
 * 3) Verify the account-created confirmation
 * 4) Verify the My Account dashboard
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';

test('User registration flow @master @sanity @regression @web', async ({ homePage }) => {
    const firstName = RandomDataUtil.getFirstName();
    const lastName = RandomDataUtil.getLastName();
    const email = RandomDataUtil.getEmail().replace('@', `+${Date.now()}@`);
    const telephone = RandomDataUtil.getPhoneNumber();
    const password = RandomDataUtil.getPassword(12);

    let registrationPage!: Awaited<ReturnType<typeof homePage.openRegistration>>;

    await test.step('1) Open the registration page', async () => {
        registrationPage = await homePage.openRegistration();
        expect(await registrationPage.isRegistrationPageExists()).toBeTruthy();
    });

    await test.step('2) Complete customer registration', async () => {
        await registrationPage.completeRegistration(
            firstName,
            lastName,
            email,
            telephone,
            password
        );
    });

    await test.step('3) Verify the account-created confirmation', async () => {
        expect(await registrationPage.isRegistrationSuccessful()).toBeTruthy();
    });

    await test.step('4) Verify the My Account dashboard', async () => {
        const myAccountPage = await registrationPage.continueToAccount();
        expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();
    });

    console.log('✅ ✔️ User registration completed successfully!');
});
