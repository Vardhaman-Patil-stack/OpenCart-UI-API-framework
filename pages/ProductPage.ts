import { Locator, Page } from '@playwright/test';
import { CartPage } from './CartPage';

export class ProductPage {
    private readonly page: Page;

    // Locators
    private readonly heading: Locator;
    private readonly quantity: Locator;
    private readonly btnAddToCart: Locator;
    private readonly successAlert: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.heading = page.getByRole('heading', { level: 1 });
        this.quantity = page.getByRole('textbox', { name: 'Qty' });
        this.btnAddToCart = page.getByRole('button', { name: 'Add to Cart' });
        this.successAlert = page.getByText(/Success: You have added/i);
    }

    /**
     * Verifies that the product details page is displayed.
     * @param productName - Expected product name
     * @returns Promise<boolean> - True when the product heading is visible
     */
    async isProductPageExists(productName: string): Promise<boolean> {
        const heading = this.page.getByRole('heading', { name: productName, level: 1 });
        await heading.waitFor({ state: 'visible' });
        return await heading.isVisible();
    }

    /**
     * Sets quantity and adds the product to the cart.
     * @param quantity - Quantity to add
     * @returns Promise<void>
     */
    async addToCart(quantity: string): Promise<void> {
        await this.quantity.fill(quantity);
        await this.btnAddToCart.click();
    }

    /**
     * Verifies the product-added success message.
     * @returns Promise<boolean> - True when the success alert is visible
     */
    async isAddToCartSuccessful(): Promise<boolean> {
        await this.successAlert.waitFor({ state: 'visible' });
        return await this.successAlert.isVisible();
    }

    /**
     * Opens the shopping cart.
     * @returns Promise<CartPage> - The shopping cart page
     */
    async openCart(): Promise<CartPage> {
        await this.page.getByRole('link', { name: 'shopping cart', exact: true }).click();
        return new CartPage(this.page);
    }
}
