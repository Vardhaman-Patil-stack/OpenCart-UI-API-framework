import { test, expect } from '@playwright/test';
import dotenv from 'dotenv';
import { Routes } from '../../api/endpoints/routes';

dotenv.config();

test.describe('FakeStore Authentication API Tests', () => {
    const BASE_URL = process.env.API_BASE_URL || Routes.BASE_URL;

    test('Successful login @master @sanity @api', async ({ request }) => {
        const username = process.env.USERNAME || 'mor_2314';
        const password = process.env.PASSWORD || '83r5^_';

        const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
            data: { username, password }
        });

        let loginResponse = response;
        if (loginResponse.status() !== 201) {
            loginResponse = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
                data: { username: 'johnd', password: 'm38rmF$' }
            });
        }

        expect(loginResponse.status(), 'Login should return status 201').toBe(201);

        const body = await loginResponse.json();
        expect(typeof body.token, 'Token should be a string').toBe('string');
        expect(body.token.length, 'Token should not be empty').toBeGreaterThan(0);
    });

    test('Invalid login @master @regression @api', async ({ request }) => {
        const response = await request.post(`${BASE_URL}${Routes.AUTH_LOGIN}`, {
            data: {
                username: 'invalid-user',
                password: 'invalid-password'
            }
        });

        expect(response.status(), 'Invalid login should return status 401').toBe(401);

        const body = await response.text();
        expect(body, 'Invalid login should return the expected error message')
            .toBe('username or password is incorrect');
    });
});
