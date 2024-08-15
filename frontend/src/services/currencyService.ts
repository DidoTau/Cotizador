import axios from "axios";
import { CountryAndCurrency } from "../types/countriesTypes";
import * as countries from "i18n-iso-countries";
import enLocale from 'i18n-iso-countries/langs/en.json'
import esLocale from 'i18n-iso-countries/langs/es.json'

countries.registerLocale(enLocale);
countries.registerLocale(esLocale);

const LANG = "es";

export const getSendCountries: () => Promise<CountryAndCurrency[]> = async () => {
    try {
        const response = await axios.get("https://elb.currencybird.cl/apigateway-cb/api/public/sendCountries");
        response.data.forEach((country: CountryAndCurrency) => {
            const name = countries.getName(country.isoCode, LANG, { select: "official" });
            country.name = name ?? "";

        });
      
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
}

export const getIncomingCountries: () => Promise<CountryAndCurrency[]> = async () => {
    try {
        const response = await axios.get("https://elb.currencybird.cl/apigateway-cb/api/public/incomingCountries");
        response.data.forEach((country: CountryAndCurrency) => {
            const name = countries.getName(country.isoCode, LANG, { select: "official" });
            country.name = name ?? "";
        });
        return response.data;
    } catch (error) {
        console.error(error);
        return null;
    }
};
