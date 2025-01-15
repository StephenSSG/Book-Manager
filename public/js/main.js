async function fetchBooks() {
    try {
        const response = await fetch('/api/books');
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
                <p>Price: $${book.price}</p>
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

fetchBooks();
