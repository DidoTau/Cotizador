import axios from 'axios';

import { apiResponse } from '../types/countriesTypes';


const port = 8000;


const apiClient = axios.create({
    baseURL: `http://localhost:${port}`,
    timeout: 3000,
    headers: {
        'Content-Type': 'application/json'
    }
});


export const convertFromClp = async (date: string, to: string, amount: number) => {
    try {
        const response = await apiClient.get(`/${date}/convertFromClp?to=${to}&amount=${amount}`);
        return response.data as apiResponse;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const convertToClp = async (date: string, from: string, amount: number) => {
    try {
        const response = await apiClient.get(`/${date}/convertToClp?from=${from}&amount=${amount}`);
        return response.data as apiResponse;
    } catch (error) {
        console.error(error);
        return null;
    }
};

