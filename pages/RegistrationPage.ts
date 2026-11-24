import { Locator, Page } from '@playwright/test';
import { MyAccountPage } from './MyAccountPage';

export class RegistrationPage {
    private readonly page: Page;

    // Locators
    private readonly heading: Locator;
    private readonly firstName: Locator;
    private readonly lastName: Locator;
    private readonly email: Locator;
    private readonly telephone: Locator;
    private readonly password: Locator;
    private readonly passwordConfirm: Locator;
    private readonly privacyPolicy: Locator;
    private readonly continueButton: Locator;
    private readonly successHeading: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.heading = page.getByRole('heading', { name: 'Register Account' });
        this.firstName = page.getByPlaceholder('First Name');
        this.lastName = page.getByPlaceholder('Last Name');
        this.email = page.getByPlaceholder('E-Mail');
        this.telephone = page.getByPlaceholder('Telephone');
        this.password = page.getByPlaceholder('Password', { exact: true });
        this.passwordConfirm = page.getByPlaceholder('Password Confirm', { exact: true });
        this.privacyPolicy = page.getByRole('checkbox');
        this.continueButton = page.getByRole('button', { name: 'Continue' });
        this.successHeading = page.getByRole('heading', { name: 'Your Account Has Been Created!' });
    }

    /**
     * Verifies that the registration page is displayed.
     * @returns Promise<boolean> - True when the registration heading is visible
     */
    async isRegistrationPageExists(): Promise<boolean> {
        await this.heading.waitFor({ state: 'visible' });
        return await this.heading.isVisible();
    }

    /**
     * Completes and submits customer registration.
     * @param firstName - Customer first name
     * @param lastName - Customer last name
     * @param email - Unique customer email
     * @param telephone - Customer telephone
     * @param password - Customer password
     * @returns Promise<MyAccountPage> - The account page after registration
     */
    async completeRegistration(
        firstName: string,
        lastName: string,
        email: string,
        telephone: string,
        password: string
    ): Promise<MyAccountPage> {
        await this.firstName.fill(firstName);
        await this.lastName.fill(lastName);
        await this.email.fill(email);
        await this.telephone.fill(telephone);
        await this.password.fill(password);
        await this.passwordConfirm.fill(password);
        await this.privacyPolicy.check();
        await this.continueButton.click();
        return new MyAccountPage(this.page);
    }

    /**
     * Verifies the account-created confirmation.
     * @returns Promise<boolean> - True when the success heading is visible
     */
    async isRegistrationSuccessful(): Promise<boolean> {
        await this.successHeading.waitFor({ state: 'visible' });
        return await this.successHeading.isVisible();
    }

    /**
     * Continues from the account-created confirmation to the account dashboard.
     * @returns Promise<MyAccountPage> - The account dashboard
     */
    async continueToAccount(): Promise<MyAccountPage> {
        await this.page.getByRole('link', { name: 'Continue' }).click();
        return new MyAccountPage(this.page);
    }
}
