import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import Ajv from 'ajv';
import { Routes } from '../../api/endpoints/routes';
import { RandomDataUtil } from '../../utils/dataGenerator';
import { DataProvider } from '../../utils/DataReader';

dotenv.config();

test.describe('FakeStore Users API Tests', () => {
    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;
    const USER_ID = Number(process.env.USER_ID || 1);
    const LIMIT = Number(process.env.LIMIT || 3);

    test('Get all users @master @sanity @api', async ({ request }) => {
        const response = await request.get(`${BASE_URL}${Routes.GET_ALL_USERS}`);
        expect(response.status()).toBe(200);

        const users = await response.json();
        expect(Array.isArray(users)).toBeTruthy();
        expect(users.length).toBeGreaterThan(0);
    });

    test('Get user by ID @master @sanity @api', async ({ request }) => {
        const route = Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID));
        const response = await request.get(`${BASE_URL}${route}`);
        expect(response.status()).toBe(200);

        const user = await response.json();
        expect(user.id).toBe(USER_ID);
        expect(typeof user.email).toBe('string');
        expect(typeof user.username).toBe('string');
    });

    test('Get users with limit @master @api', async ({ request }) => {
        const route = Routes.GET_USERS_WITH_LIMIT.replace('{limit}', String(LIMIT));
        const response = await request.get(`${BASE_URL}${route}`);
        expect(response.status()).toBe(200);

        const users = await response.json();
        expect(Array.isArray(users)).toBeTruthy();
        expect(users.length).toBe(LIMIT);
    });

    test('Sort users ascending @master @api', async ({ request }) => {
        const route = Routes.GET_USERS_SORTED.replace('{order}', 'asc');
        const response = await request.get(`${BASE_URL}${route}`);
        expect(response.status()).toBe(200);

        const users = await response.json();
        const ids = users.map((user: { id: number }) => user.id);
        expect(ids).toEqual([...ids].sort((a, b) => a - b));
    });

    test('Sort users descending @master @api', async ({ request }) => {
        const route = Routes.GET_USERS_SORTED.replace('{order}', 'desc');
        const response = await request.get(`${BASE_URL}${route}`);
        expect(response.status()).toBe(200);

        const users = await response.json();
        const ids = users.map((user: { id: number }) => user.id);
        expect(ids).toEqual([...ids].sort((a, b) => b - a));
    });

    test('Create user @master @regression @api', async ({ request }) => {
        const payload = RandomDataUtil.generateUserPayload();
        const response = await request.post(`${BASE_URL}${Routes.CREATE_USER}`, { data: payload });
        expect(response.status()).toBe(201);

        const created = await response.json();
        expect(created.id).toBeTruthy();
    });

    test('Update user @master @regression @api', async ({ request }) => {
        const payload = RandomDataUtil.generateUserUpdatePayload();
        const route = Routes.UPDATE_USER.replace('{id}', String(USER_ID));
        const response = await request.put(`${BASE_URL}${route}`, { data: payload });
        expect(response.status()).toBe(200);

        const updated = await response.json();
        expect(updated.email).toBe(payload.email);
        expect(updated.username).toBe(payload.username);
        expect(updated.password).toBe(payload.password);
    });

    test('Delete user @master @regression @api', async ({ request }) => {
        const route = Routes.DELETE_USER.replace('{id}', String(USER_ID));
        const response = await request.delete(`${BASE_URL}${route}`);
        expect(response.status()).toBe(200);

        const body = await response.json();
        expect(body).toBeTruthy();
    });

    test('Validate user response schema @master @api', async ({ request }) => {
        const route = Routes.GET_USER_BY_ID.replace('{id}', String(USER_ID));
        const response = await request.get(`${BASE_URL}${route}`);
        expect(response.status()).toBe(200);

        const body = await response.json();
        const schema = DataProvider.readJson('./api/schemas/user_api_schema.json');
        const ajv = new Ajv({ allErrors: true });
        const isValid = ajv.validate(schema, body);

        expect(isValid, JSON.stringify(ajv.errors, null, 2)).toBeTruthy();
    });
});
