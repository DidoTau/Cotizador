export type CountryAndCurrency = {
    isoCode: string;
    currency: string;
    popular?: boolean;
    id: string;
    name: string;
}

export type apiResponse = {
    amount: number;
    exchangeRate: number;
}