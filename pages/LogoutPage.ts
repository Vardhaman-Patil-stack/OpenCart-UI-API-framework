import { Locator, Page } from '@playwright/test';
import { HomePage } from './HomePage';

export class LogoutPage {
    private readonly page: Page;

    // Locators
    private readonly heading: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.heading = page.getByRole('heading', { name: 'Account Logout' });
    }

    /**
     * Verifies that logout completed.
     * @returns Promise<boolean> - True when the logout heading is visible
     */
    async isLogoutPageExists(): Promise<boolean> {
        return await this.heading.isVisible();
    }

    /**
     * Continues to the homepage.
     * @returns Promise<HomePage> - The homepage
     */
    async continueToHome(): Promise<HomePage> {
        await this.page.getByRole('link', { name: 'Continue' }).click();
        return new HomePage(this.page);
    }
}
