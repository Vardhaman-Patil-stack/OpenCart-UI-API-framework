import { Locator, Page } from '@playwright/test';
import { ProductPage } from './ProductPage';

export class SearchPage {
    private readonly page: Page;

    // Locators
    private readonly heading: Locator;

    constructor(page: Page) {
        this.page = page;

        // Initialize locators
        this.heading = page.getByRole('heading', { name: /Search -/ });
    }

    /**
     * Verifies that the search results page is displayed.
     * @returns Promise<boolean> - True when the search heading is visible
     */
    async isSearchPageExists(): Promise<boolean> {
        await this.heading.waitFor({ state: 'visible' });
        return await this.heading.isVisible();
    }

    /**
     * Verifies that a product is present in search results.
     * @param productName - Product name to find
     * @returns Promise<boolean> - True when the product link is visible
     */
    async isProductVisible(productName: string): Promise<boolean> {
        const product = this.page.getByRole('link', { name: productName, exact: true }).first();
        await product.waitFor({ state: 'visible' });
        return await product.isVisible();
    }

    /**
     * Opens a product from search results.
     * @param productName - Product name to open
     * @returns Promise<ProductPage> - The product details page
     */
    async openProduct(productName: string): Promise<ProductPage> {
        await this.page.getByRole('link', { name: productName, exact: true }).first().click();
        return new ProductPage(this.page);
    }
}
