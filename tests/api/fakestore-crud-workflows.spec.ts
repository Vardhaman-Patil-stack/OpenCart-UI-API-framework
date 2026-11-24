import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';

dotenv.config();

test.describe.serial('FakeStore API CRUD Workflows', () => {
    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const USER_ID = Number(process.env.USER_ID || 1);

    test('Product CRUD workflow @master @e2e @api', async ({ request }) => {
        const createPayload = RandomDataUtil.generateProductPayload();
        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_PRODUCT}`, {
            data: createPayload
        });
        expect(createResponse.status()).toBe(201);

        const created = await createResponse.json();
        expect(created.id).toBeTruthy();
        const productId = created.id;

        const updatePayload = RandomDataUtil.generateUpdatedProductPayload();
        const updateRoute = Routes.UPDATE_PRODUCT.replace('{id}', String(productId));
        const updateResponse = await request.put(`${BASE_URL}${updateRoute}`, {
            data: updatePayload
        });
        expect(updateResponse.status()).toBe(200);

        const updated = await updateResponse.json();
        expect(updated.id).toBe(productId);
        expect(updated.title).toBe(updatePayload.title);
        expect(updated.price).toBe(updatePayload.price);

        const deleteRoute = Routes.DELETE_PRODUCT.replace('{id}', String(productId));
        const deleteResponse = await request.delete(`${BASE_URL}${deleteRoute}`);
        expect(deleteResponse.status()).toBe(200);
    });

    test('User CRUD workflow @master @e2e @api', async ({ request }) => {
        const createPayload = RandomDataUtil.generateUserPayload();
        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, {
            data: createPayload
        });
        expect(createResponse.status()).toBe(201);

        const created = await createResponse.json();
        expect(created.id).toBeTruthy();
        const userId = created.id;

        const updatePayload = RandomDataUtil.generateUserUpdatePayload();
        const updateRoute = Routes.UPDATE_USER.replace('{id}', String(userId));
        const updateResponse = await request.put(`${BASE_URL}${updateRoute}`, {
            data: updatePayload
        });
        expect(updateResponse.status()).toBe(200);

        const updated = await updateResponse.json();
        expect(updated.email).toBe(updatePayload.email);
        expect(updated.username).toBe(updatePayload.username);

        const deleteRoute = Routes.DELETE_USER.replace('{id}', String(userId));
        const deleteResponse = await request.delete(`${BASE_URL}${deleteRoute}`);
        expect(deleteResponse.status()).toBe(200);
    });

    test('Cart CRUD workflow @master @e2e @api', async ({ request }) => {
        const createPayload = RandomDataUtil.generateCartPayload(USER_ID);
        const createResponse = await request.post(`${BASE_URL}${Routes.CREATE_CART}`, {
            data: createPayload
        });
        expect(createResponse.status()).toBe(201);

        const created = await createResponse.json();
        expect(created.id).toBeTruthy();
        expect(created.userId).toBe(createPayload.userId);
        expect(created.products).toEqual(createPayload.products);
        const cartId = created.id;

        const updatePayload = RandomDataUtil.generateUpdatedCartPayload(USER_ID);
        updatePayload.products[0].quantity = 5;
        const updateRoute = Routes.UPDATE_CART.replace('{id}', String(cartId));
        const updateResponse = await request.put(`${BASE_URL}${updateRoute}`, {
            data: updatePayload
        });
        expect(updateResponse.status()).toBe(200);

        const updated = await updateResponse.json();
        expect(updated.id).toBe(cartId);
        expect(updated.userId).toBe(updatePayload.userId);
        expect(updated.products).toEqual(updatePayload.products);

        const deleteRoute = Routes.DELETE_CART.replace('{id}', String(cartId));
        const deleteResponse = await request.delete(`${BASE_URL}${deleteRoute}`);
        expect(deleteResponse.status()).toBe(200);
    });
});
