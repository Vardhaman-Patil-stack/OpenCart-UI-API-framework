import { Locator, Page } from '@playwright/test';
import { RegistrationPage } from './RegistrationPage';
import { LoginPage } from './LoginPage';
import { SearchPage } from './SearchPage';

export class HomePage {
    private readonly page: Page;

    // Locators
    private readonly myAccountLink: Locator;
    private readonly searchBox: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.myAccountLink = page.getByRole('link', { name: /My Account/i }).first();
        this.searchBox = page.getByRole('textbox', { name: 'Search' });
    }

    /**
     * Opens the registration page from the account menu.
     * @returns Promise<RegistrationPage> - The registration page
     */
    async openRegistration(): Promise<RegistrationPage> {
        await this.myAccountLink.click();
        await this.page.getByRole('link', { name: 'Register', exact: true }).first().click();
        return new RegistrationPage(this.page);
    }

    /**
     * Opens the login page from the account menu.
     * @returns Promise<LoginPage> - The login page
     */
    async openLogin(): Promise<LoginPage> {
        await this.myAccountLink.click();
        await this.page.getByRole('link', { name: 'Login', exact: true }).first().click();
        return new LoginPage(this.page);
    }

    /**
     * Searches for a product.
     * @param productName - Product name to search for
     * @returns Promise<SearchPage> - The search results page
     */
    async searchProduct(productName: string): Promise<SearchPage> {
        await this.searchBox.fill(productName);
        await this.searchBox.press('Enter');
        return new SearchPage(this.page);
    }
}
