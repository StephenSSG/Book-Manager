// public/js/main.js
let currentCurrency = 'USD';

async function fetchCurrencies() {
    try {
        const response = await fetch('/api/currencies');
        const currencies = await response.json();
        displayCurrencySelector(currencies);
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayCurrencySelector(currencies) {
    const container = document.querySelector('.container');
    const booksSection = document.querySelector('.books-section');
    
    const currencySelector = document.createElement('div');
    currencySelector.className = 'currency-selector';
    currencySelector.innerHTML = `
        <label for="currency">Select Currency:</label>
        <select id="currency">
            ${currencies.map(currency => `
                <option value="${currency}" ${currency === currentCurrency ? 'selected' : ''}>
                    ${currency}
                </option>
            `).join('')}
        </select>
    `;
    
    container.insertBefore(currencySelector, booksSection);
    
    document.getElementById('currency').addEventListener('change', (e) => {
        currentCurrency = e.target.value;
        fetchBooks();
    });
}

async function fetchBooks() {
    try {
        const response = await fetch(`/api/books?currency=${currentCurrency}`);
        const books = await response.json();
        displayBooks(books);
    } catch (error) {
        console.error('Error:', error);
    }
}

function displayBooks(books) {
    const booksList = document.getElementById('booksList');
    booksList.innerHTML = books.map(book => `
        <div class="book-card">
            <div>
                <h3>${book.title}</h3>
                <p>Author: ${book.author}</p>
                <p>Price: ${book.currency} ${book.price.toFixed(2)}</p>
                <p>Stock: ${book.stock}</p>
            </div>
            <button class="delete-btn" onclick="deleteBook('${book._id}')">Delete</button>
        </div>
    `).join('');
}

async function deleteBook(id) {
    try {
        await fetch(`/api/books/${id}`, { method: 'DELETE' });
        fetchBooks();
    } catch (error) {
        console.error('Error:', error);
    }
}

document.getElementById('bookForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const bookData = {
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        price: document.getElementById('price').value,
        stock: document.getElementById('stock').value
    };

    try {
        await fetch('/api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(bookData)
        });
        e.target.reset();
        fetchBooks();
    } catch (error) {
        console.error('Error:', error);
    }
});

// Add some CSS for the currency selector
const style = document.createElement('style');
style.textContent = `
    .currency-selector {
        margin-bottom: 1rem;
        padding: 1rem;
        background: #f4f4f4;
        border-radius: 5px;
    }
    
    .currency-selector select {
        margin-left: 0.5rem;
        padding: 0.25rem;
        border-radius: 4px;
    }
`;
document.head.appendChild(style);

// Initialize
fetchCurrencies();
fetchBooks();