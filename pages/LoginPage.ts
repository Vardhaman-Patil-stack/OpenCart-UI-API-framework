import { Locator, Page } from '@playwright/test';
import { MyAccountPage } from './MyAccountPage';

export class LoginPage {
    private readonly page: Page;

    // Locators
    private readonly heading: Locator;
    private readonly email: Locator;
    private readonly password: Locator;
    private readonly loginButton: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.heading = page.getByRole('heading', { name: 'Returning Customer' });
        this.email = page.getByRole('textbox', { name: 'E-Mail Address' });
        this.password = page.getByRole('textbox', { name: 'Password' });
        this.loginButton = page.getByRole('button', { name: 'Login' });
    }

    /**
     * Verifies that the login page is displayed.
     * @returns Promise<boolean> - True when the login heading is visible
     */
    async isLoginPageExists(): Promise<boolean> {
        return await this.heading.isVisible();
    }

    /**
     * Logs in with the supplied credentials.
     * @param email - Customer email
     * @param password - Customer password
     * @returns Promise<MyAccountPage> - The account page after login
     */
    async login(email: string, password: string): Promise<MyAccountPage> {
        await this.email.fill(email);
        await this.password.fill(password);
        await this.loginButton.click();
        return new MyAccountPage(this.page);
    }
}
