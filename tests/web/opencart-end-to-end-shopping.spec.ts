/**
 * Test Case: End-to-end shopping flow
 *
 * Tags: @master @sanity @regression @e2e @web
 *
 * Steps:
 * 1) Register a unique customer
 * 2) Log out and log back in
 * 3) Search for MacBook
 * 4) Add the product to the cart
 * 5) Verify product, quantity, price, and total
 */

import { test, expect } from '../../fixtures/pageFixtures';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { Helper } from '../../utils/helper';
import { MyAccountPage } from '../../pages/MyAccountPage';

test('End-to-end shopping flow @master @sanity @regression @e2e @web', async ({ homePage }) => {
    const firstName = RandomDataUtil.getFirstName();
    const lastName = RandomDataUtil.getLastName();
    const email = RandomDataUtil.getEmail().replace('@', `+${Date.now()}@`);
    const telephone = RandomDataUtil.getPhoneNumber();
    const password = RandomDataUtil.getPassword(12);
    const { productName, productQuantity, totalPrice } = Helper.getProductDetails();

    let registrationPage!: Awaited<ReturnType<typeof homePage.openRegistration>>;
    let myAccountPage: MyAccountPage;

    await test.step('1) Register a unique customer', async () => {
        registrationPage = await homePage.openRegistration();
        await registrationPage.completeRegistration(
            firstName,
            lastName,
            email,
            telephone,
            password
        );
        expect(await registrationPage.isRegistrationSuccessful()).toBeTruthy();

        myAccountPage = await registrationPage.continueToAccount();
        expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();
    });

    await test.step('2) Log out and log back in', async () => {
        const logoutPage = await myAccountPage.logout();
        expect(await logoutPage.isLogoutPageExists()).toBeTruthy();
        const homeAfterLogout = await logoutPage.continueToHome();

        const loginPage = await homeAfterLogout.openLogin();
        expect(await loginPage.isLoginPageExists()).toBeTruthy();
        myAccountPage = await loginPage.login(email, password);
        expect(await myAccountPage.isMyAccountPageExists()).toBeTruthy();
    });

    await test.step('3) Search for and open the MacBook', async () => {
        const searchPage = await homePage.searchProduct(productName);
        expect(await searchPage.isSearchPageExists()).toBeTruthy();
        expect(await searchPage.isProductVisible(productName)).toBeTruthy();
        const productPage = await searchPage.openProduct(productName);
        expect(await productPage.isProductPageExists(productName)).toBeTruthy();

        await test.step('4) Add MacBook to the cart', async () => {
            await productPage.addToCart(productQuantity);
            expect(await productPage.isAddToCartSuccessful()).toBeTruthy();
        });

        await test.step('5) Verify cart product, quantity, price, and total', async () => {
            const cartPage = await productPage.openCart();
            expect(await cartPage.isCartPageExists()).toBeTruthy();
            expect(await cartPage.isProductInCart(productName)).toBeTruthy();
            expect(await cartPage.isQuantityCorrect(productName, productQuantity)).toBeTruthy();
            expect(await cartPage.isPriceCorrect(productName, totalPrice)).toBeTruthy();
            expect(await cartPage.isTotalCorrect(totalPrice)).toBeTruthy();
        });
    });

    console.log('✅ ✔️ End-to-end shopping flow completed successfully!');
});
