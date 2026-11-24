import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import Ajv from 'ajv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { DataProvider } from '../../utils/DataReader';

dotenv.config();

test.describe('FakeStore Carts API Tests', () => {
    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const CART_ID = Number(process.env.CART_ID || 1);
    const USER_ID = Number(process.env.USER_ID || 1);
    const LIMIT = Number(process.env.LIMIT || 3);

    test('Get all carts @master @sanity @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_CARTS}`);
        expect(response.status()).toBe(200);

        const carts = await response.json();
        expect(Array.isArray(carts)).toBeTruthy();
        expect(carts.length).toBeGreaterThan(0);
    });

    test('Get cart by ID @master @sanity @api', async ({ request }) => {
        const route = Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID));
        const response = await request.get(`${BASE_URL}${route}`);
        expect(response.status()).toBe(200);

        const cart = await response.json();
        expect(cart.id).toBe(CART_ID);
        expect(typeof cart.userId).toBe('number');
        expect(Array.isArray(cart.products)).toBeTruthy();
    });

    test('Get carts by date range @master @api', async ({ request }) => {
        const startDate = process.env.START_DATE || '2019-10-10';
        const endDate = process.env.END_DATE || '2020-10-10';
        const route = Routes.GET_CARTS_BY_DATE_RANGE
            .replace('{startdate}', startDate)
            .replace('{enddate}', endDate);
        const response = await request.get(`${BASE_URL}${route}`);
        expect(response.status()).toBe(200);

        const carts = await response.json();
        expect(Array.isArray(carts)).toBeTruthy();
        for (const cart of carts) {
            expect(new Date(cart.date).getTime()).toBeGreaterThanOrEqual(new Date(startDate).getTime());
            expect(new Date(cart.date).getTime()).toBeLessThanOrEqual(new Date(endDate).getTime());
        }
    });

    test('Get user cart @master @api', async ({ request }) => {
        const route = Routes.GET_USER_CART.replace('{userId}', String(USER_ID));
        const response = await request.get(`${BASE_URL}${route}`);
        expect(response.status()).toBe(200);

        const carts = await response.json();
        expect(Array.isArray(carts)).toBeTruthy();
        for (const cart of carts) {
            expect(cart.userId).toBe(USER_ID);
        }
    });

    test('Get carts with limit @master @api', async ({ request }) => {
        const route = Routes.GET_CARTS_WITH_LIMIT.replace('{limit}', String(LIMIT));
        const response = await request.get(`${BASE_URL}${route}`);
        expect(response.status()).toBe(200);

        const carts = await response.json();
        expect(Array.isArray(carts)).toBeTruthy();
        expect(carts.length).toBe(LIMIT);
    });

    test('Sort carts ascending @master @api', async ({ request }) => {
        const route = Routes.GET_CARTS_SORTED.replace('{order}', 'asc');
        const response = await request.get(`${BASE_URL}${route}`);
        expect(response.status()).toBe(200);

        const carts = await response.json();
        const ids = carts.map((cart: { id: number }) => cart.id);
        expect(ids).toEqual([...ids].sort((a, b) => a - b));
    });

    test('Sort carts descending @master @api', async ({ request }) => {
        const route = Routes.GET_CARTS_SORTED.replace('{order}', 'desc');
        const response = await request.get(`${BASE_URL}${route}`);
        expect(response.status()).toBe(200);

        const carts = await response.json();
        const ids = carts.map((cart: { id: number }) => cart.id);
        expect(ids).toEqual([...ids].sort((a, b) => b - a));
    });

    test('Create cart @master @regression @api', async ({ request }) => {
        const payload = RandomDataUtil.generateCartPayload(USER_ID);
        const response = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, { data: payload });
        expect(response.status()).toBe(201);

        const created = await response.json();
        expect(created.id).toBeTruthy();
        expect(created.userId).toBe(payload.userId);
        expect(created.products).toEqual(payload.products);
    });

    test('Update cart @master @regression @api', async ({ request }) => {
        const payload = RandomDataUtil.generateUpdatedCartPayload(USER_ID);
        payload.products[0].quantity = 2;
        const route = Routes.UPDATE_CART.replace('{id}', String(CART_ID));
        const response = await request.put(`${BASE_URL}${route}`, { data: payload });
        expect(response.status()).toBe(200);

        const updated = await response.json();
        expect(updated.id).toBe(CART_ID);
        expect(updated.userId).toBe(payload.userId);
        expect(updated.products).toEqual(payload.products);
    });

    test('Delete cart @master @regression @api', async ({ request }) => {
        const route = Routes.DELETE_CART.replace('{id}', String(CART_ID));
        const response = await request.delete(`${BASE_URL}${route}`);
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body).toBeTruthy();
    });

    test('Validate cart response schema @master @api', async ({ request }) => {
        const route = Routes.GET_CART_BY_ID.replace('{id}', String(CART_ID));
        const response = await request.get(`${BASE_URL}${route}`);
        expect(response.status()).toBe(200);

        const body = await response.json();
        const schema = DataProvider.readJson('./api/schemas/cart_api_schema.json');
        const ajv = new Ajv({ allErrors: true });
        const isValid = ajv.validate(schema, body);

        expect(isValid, JSON.stringify(ajv.errors, null, 2)).toBeTruthy();
    });
});
