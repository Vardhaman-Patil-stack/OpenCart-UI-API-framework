import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import Ajv from 'ajv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { DataProvider } from '../../utils/DataReader';

dotenv.config();

test.describe('FakeStore Products API Tests', () => {
    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const PRODUCT_ID = Number(process.env.PRODUCT_ID || 1);
    const LIMIT = Number(process.env.LIMIT || 3);

    test('Get all products @master @sanity @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_PRODUCTS}`);
        expect(response.status()).toBe(200);

        const products = await response.json();
        expect(Array.isArray(products)).toBeTruthy();
        expect(products.length).toBeGreaterThan(0);

        for (const product of products.slice(0, 5)) {
            expect(typeof product.id).toBe('number');
            expect(typeof product.title).toBe('string');
            expect(typeof product.price).toBe('number');
            expect(typeof product.category).toBe('string');
            expect(typeof product.image).toBe('string');
        }
    });

    test('Get product by ID @master @sanity @api', async ({ request }) => {
        const route = Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID));
        const response = await request.get(`${BASE_URL}${route}`);
        expect(response.status()).toBe(200);

        const product = await response.json();
        expect(product.id).toBe(PRODUCT_ID);
        expect(typeof product.title).toBe('string');
        expect(typeof product.price).toBe('number');
        expect(typeof product.category).toBe('string');
        expect(typeof product.image).toBe('string');
    });

    test('Get products with limit @master @api', async ({ request }) => {
        const route = Routes.GET_PRODUCTS_WITH_LIMIT.replace('{limit}', String(LIMIT));
        const response = await request.get(`${BASE_URL}${route}`);
        expect(response.status()).toBe(200);

        const products = await response.json();
        expect(Array.isArray(products)).toBeTruthy();
        expect(products.length).toBe(LIMIT);
    });

    test('Sort products ascending @master @api', async ({ request }) => {
        const route = Routes.GET_PRODUCTS_SORTED.replace('{order}', 'asc');
        const response = await request.get(`${BASE_URL}${route}`);
        expect(response.status()).toBe(200);

        const products = await response.json();
        const ids = products.map((product: { id: number }) => product.id);
        expect(ids).toEqual([...ids].sort((a, b) => a - b));
    });

    test('Sort products descending @master @api', async ({ request }) => {
        const route = Routes.GET_PRODUCTS_SORTED.replace('{order}', 'desc');
        const response = await request.get(`${BASE_URL}${route}`);
        expect(response.status()).toBe(200);

        const products = await response.json();
        const ids = products.map((product: { id: number }) => product.id);
        expect(ids).toEqual([...ids].sort((a, b) => b - a));
    });

    test('Get all product categories @master @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CATEGORIES}`);
        expect(response.status()).toBe(200);

        const categories = await response.json();
        expect(Array.isArray(categories)).toBeTruthy();
        expect(categories.length).toBeGreaterThan(0);
    });

    test('Get products by category @master @api', async ({ request }) => {
        const category = 'electronics';
        const route = Routes.GET_PRODUCTS_BY_CATEGORY.replace('{category}', category);
        const response = await request.get(`${BASE_URL}${route}`);
        expect(response.status()).toBe(200);

        const products = await response.json();
        expect(Array.isArray(products)).toBeTruthy();
        expect(products.length).toBeGreaterThan(0);
        for (const product of products) {
            expect(product.category).toBe(category);
        }
    });

    test('Create product @master @regression @api', async ({ request }) => {
        const payload = RandomDataUtil.generateProductPayload();
        const response = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, { data: payload });
        expect(response.status()).toBe(201);

        const created = await response.json();
        expect(created.id).toBeTruthy();
        expect(created.title).toBe(payload.title);
        expect(created.price).toBe(payload.price);
        expect(created.description).toBe(payload.description);
        expect(created.category).toBe(payload.category);
        expect(created.image).toBe(payload.image);
    });

    test('Update product @master @regression @api', async ({ request }) => {
        const payload = RandomDataUtil.generateUpdatedProductPayload();
        const route = Routes.UPDATE_PRODUCT.replace('{id}', String(PRODUCT_ID));
        const response = await request.put(`${BASE_URL}${route}`, { data: payload });
        expect(response.status()).toBe(200);

        const updated = await response.json();
        expect(updated.id).toBe(PRODUCT_ID);
        expect(updated.title).toBe(payload.title);
        expect(updated.price).toBe(payload.price);
        expect(updated.description).toBe(payload.description);
        expect(updated.category).toBe(payload.category);
        expect(updated.image).toBe(payload.image);
    });

    test('Delete product @master @regression @api', async ({ request }) => {
        const route = Routes.DELETE_PRODUCT.replace('{id}', String(PRODUCT_ID));
        const response = await request.delete(`${BASE_URL}${route}`);
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body).toBeTruthy();
    });

    test('Validate product response schema @master @api', async ({ request }) => {
        const route = Routes.GET_PRODUCT_BY_ID.replace('{id}', String(PRODUCT_ID));
        const response = await request.get(`${BASE_URL}${route}`);
        expect(response.status()).toBe(200);

        const body = await response.json();
        const schema = DataProvider.readJson('./api/schemas/product_api_schema.json');
        const ajv = new Ajv({ allErrors: true });
        const isValid = ajv.validate(schema, body);

        expect(isValid, JSON.stringify(ajv.errors, null, 2)).toBeTruthy();
    });
});
