import { test as base, expect, Page } from '@playwright/test';
import dotenv from 'dotenv';
import { HomePage } from '../pages/HomePage';
import { RegistrationPage } from '../pages/RegistrationPage';
import { LoginPage } from '../pages/LoginPage';
import { MyAccountPage } from '../pages/MyAccountPage';
import { LogoutPage } from '../pages/LogoutPage';
import { SearchPage } from '../pages/SearchPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';

dotenv.config();

const APP_URL = process.env.WEB_APP_URL || 'https://naveenautomationlabs.com/opencart/';

type PageFixtures = {
    homePage: HomePage;
    registrationPage: RegistrationPage;
    loginPage: LoginPage;
    myAccountPage: MyAccountPage;
    logoutPage: LogoutPage;
    searchPage: SearchPage;
    productPage: ProductPage;
    cartPage: CartPage;
};

export const test = base.extend<PageFixtures>({
    homePage: async ({ page }, use) => {
        await page.goto(APP_URL);
        await use(new HomePage(page));
    },
    registrationPage: async ({ page }, use) => {
        await use(new RegistrationPage(page));
    },
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },
    myAccountPage: async ({ page }, use) => {
        await use(new MyAccountPage(page));
    },
    logoutPage: async ({ page }, use) => {
        await use(new LogoutPage(page));
    },
    searchPage: async ({ page }, use) => {
        await use(new SearchPage(page));
    },
    productPage: async ({ page }, use) => {
        await use(new ProductPage(page));
    },
    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    }
});

test.afterEach(async ({ page, context }) => {
    if (!page.isClosed()) {
        await page.close();
    }
    await context.close();
});

export { expect };
