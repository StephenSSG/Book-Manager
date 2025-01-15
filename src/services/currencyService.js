// src/services/currencyService.js
const https = require('https');

class CurrencyService {
    constructor() {
        this.baseUrl = 'https://api.exchangerate-api.com/v4/latest/USD';
        this.rates = {};
        this.lastFetched = null;
    }

    async fetchRates() {
        // Only fetch new rates if we haven't fetched in the last hour
        if (this.lastFetched && Date.now() - this.lastFetched < 3600000) {
            return this.rates;
        }

        return new Promise((resolve, reject) => {
            https.get(this.baseUrl, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        const response = JSON.parse(data);
                        this.rates = response.rates;
                        this.lastFetched = Date.now();
                        resolve(this.rates);
                    } catch (error) {
                        reject(error);
                    }
                });
            }).on('error', (error) => {
                reject(error);
            });
        });
    }

    async convertPrice(amount, targetCurrency) {
        try {
            const rates = await this.fetchRates();
            if (!rates[targetCurrency]) {
                throw new Error(`Currency ${targetCurrency} not supported`);
            }
            return amount * rates[targetCurrency];
        } catch (error) {
            throw error;
        }
    }

    async getSupportedCurrencies() {
        const rates = await this.fetchRates();
        return Object.keys(rates);
    }
}

module.exports = new CurrencyService();
