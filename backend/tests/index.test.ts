import request from 'supertest';
import { Express } from 'express'; // Import the Express type from the express package
import app from '../src/index';
import axios from 'axios';
import {describe, expect, test, it, jest} from '@jest/globals';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

mock.onGet('https://2024-08-01.currency-api.pages.dev/v1/currencies/clp.json').reply(200, {
    "clp": {
        "usd": 0.0013
    }
});

mock.onGet('https://2024-08-01.currency-api.pages.dev/v1/currencies/usd.json').reply(200, {
    "usd": {
        "clp": 764.00
    }
});

describe('GET /', () => {
    it('should return 200 OK', async () => {
        const response = await request(app).get('/');
        expect(response.status).toEqual(200);
        expect(response.text).toEqual('Hello World');
    });

    it('convert from clp', async () => {

        
        const response = await request(app).get('/2024-08-01/convertFromClp?to=usd&amount=1000');
        
        expect(response.status).toEqual(200);
        expect(response.body).toHaveProperty('amount');
        expect(response.body).toHaveProperty('exchangeRate');
        expect(response.body.amount).toEqual('1.23');
        expect(response.body.exchangeRate).toEqual('809.72');
    });

    it('convert to clp', async () => {
        const response = await request(app).get('/2024-08-01/convertToClp?from=usd&amount=1');
        expect(response.status).toEqual(200);
        expect(response.body).toHaveProperty('amount');
        expect(response.body).toHaveProperty('exchangeRate');
        expect(response.body.amount).toEqual('725.80');
        expect(response.body.exchangeRate).toEqual('0.00');
    })
    
});