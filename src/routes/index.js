// src/routes/index.js
const express = require('express');
const router = express.Router();
const Book = require('../models/Book');
const currencyService = require('../services/currencyService');

router.post('/books', async (req, res) => {
    try {
        const book = new Book(req.body);
        await book.save();
        res.status(201).json(book);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.get('/books', async (req, res) => {
    try {
        const currency = req.query.currency || 'USD';
        let books = await Book.find();
        
        if (currency !== 'USD') {
            books = await Promise.all(books.map(async (book) => {
                const convertedPrice = await currencyService.convertPrice(book.price, currency);
                return {
                    ...book.toObject(),
                    price: Number(convertedPrice.toFixed(2)),
                    currency
                };
            }));
        }
        
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/books/:id', async (req, res) => {
    try {
        await Book.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Book deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/currencies', async (req, res) => {
    try {
        const currencies = await currencyService.getSupportedCurrencies();
        res.json(currencies);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;