import { Locator, Page } from '@playwright/test';

export class CartPage {
    private readonly page: Page;

    // Locators
    private readonly heading: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.heading = page.getByRole('heading', { name: /Shopping Cart/ });
    }

    /**
     * Verifies that the shopping cart page is displayed.
     * @returns Promise<boolean> - True when the cart heading is visible
     */
    async isCartPageExists(): Promise<boolean> {
        return await this.heading.isVisible();
    }

    /**
     * Verifies that the requested product is in the cart.
     * @param productName - Expected product name
     * @returns Promise<boolean> - True when the product row is visible
     */
    async isProductInCart(productName: string): Promise<boolean> {
        return await this.page.getByRole('row').filter({ hasText: productName }).isVisible();
    }

    /**
     * Verifies the cart quantity for a product.
     * @param productName - Product name
     * @param quantity - Expected quantity
     * @returns Promise<boolean> - True when quantity matches
     */
    async isQuantityCorrect(productName: string, quantity: string): Promise<boolean> {
        const row = this.page.getByRole('row').filter({ hasText: productName });
        return await row.getByRole('textbox').inputValue() === quantity;
    }

    /**
     * Verifies the unit and line prices for a product.
     * @param productName - Product name
     * @param price - Expected price
     * @returns Promise<boolean> - True when both prices match
     */
    async isPriceCorrect(productName: string, price: string): Promise<boolean> {
        const row = this.page.getByRole('row').filter({ hasText: productName });
        const rowText = await row.innerText();
        return rowText.includes(price);
    }

    /**
     * Verifies the cart total.
     * @param total - Expected total
     * @returns Promise<boolean> - True when the total matches
     */
    async isTotalCorrect(total: string): Promise<boolean> {
        const totalRow = this.page.getByRole('row').filter({ hasText: /^\s*Total:/ });
        return (await totalRow.innerText()).includes(total);
    }
}
