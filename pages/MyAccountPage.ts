import { Locator, Page } from '@playwright/test';
import { LogoutPage } from './LogoutPage';

export class MyAccountPage {
    private readonly page: Page;

    // Locators
    private readonly heading: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.heading = page.getByRole('heading', { name: 'My Account', level: 2 });
    }

    /**
     * Verifies that the My Account dashboard is displayed.
     * @returns Promise<boolean> - True when the account heading is visible
     */
    async isMyAccountPageExists(): Promise<boolean> {
        return await this.heading.isVisible();
    }

    /**
     * Logs out through the account sidebar.
     * @returns Promise<LogoutPage> - The logout confirmation page
     */
    async logout(): Promise<LogoutPage> {
        await this.page.getByRole('link', { name: 'Logout', exact: true }).click();
        return new LogoutPage(this.page);
    }
}
