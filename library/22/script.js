// Initial Data
const initialBooks = [
    {
        id: '1',
        title: 'The Design of Everyday Things',
        author: 'Don Norman',
        isbn: '978-0465050659',
        status: 'available',
        coverColor: '#3b82f6'
    },
    {
        id: '2',
        title: 'Clean Code',
        author: 'Robert C. Martin',
        isbn: '978-0132350884',
        status: 'borrowed',
        coverColor: '#10b981'
    },
    {
        id: '3',
        title: 'JavaScript: The Good Parts',
        author: 'Douglas Crockford',
        isbn: '978-0596517748',
        status: 'available',
        coverColor: '#f59e0b'
    }
];

// State Management
let books = JSON.parse(localStorage.getItem('libNova_books')) || initialBooks;

// DOM Elements
const booksGrid = document.getElementById('booksGrid');
const emptyState = document.getElementById('emptyState');
const modalOverlay = document.getElementById('modalOverlay');
const bookForm = document.getElementById('bookForm');
const searchInput = document.getElementById('searchInput');

// Stats Elements
const totalBooksEl = document.getElementById('totalBooks');
const borrowedBooksEl = document.getElementById('borrowedBooks');
const availableBooksEl = document.getElementById('availableBooks');

// Modal Elements
const addBookBtn = document.getElementById('addBookBtn');
const closeModalBtn = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const modalTitle = document.getElementById('modalTitle');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderBooks();
    updateStats();
});

// Helper Functions
function saveToLocalStorage() {
    localStorage.setItem('libNova_books', JSON.stringify(books));
    updateStats();
}

function updateStats() {
    totalBooksEl.textContent = books.length;
    const borrowed = books.filter(b => b.status === 'borrowed').length;
    borrowedBooksEl.textContent = borrowed;
    availableBooksEl.textContent = books.length - borrowed;
}

function getRandomColor() {
    const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function getBookCard(book) {
    const statusClass = book.status === 'available' ? 'status-available' : 'status-borrowed';
    const statusText = book.status === 'available' ? 'Available' : 'Borrowed';

    // Fallback for cover color if old data
    const coverBg = book.coverColor || getRandomColor();

    return `
        <div class="book-card" data-id="${book.id}">
            <div class="book-cover" style="background: linear-gradient(135deg, ${coverBg}, #1e293b)">
                <i class="fa-solid fa-book" style="font-size: 4rem; color: rgba(255,255,255,0.2)"></i>
            </div>
            <div class="book-info">
                <h3 class="book-title" title="${book.title}">${book.title}</h3>
                <p class="book-author">by ${book.author}</p>
                <div style="display: flex; justify-content: space-between; align-items: center">
                    <span class="book-status ${statusClass}">${statusText}</span>
                    <div class="card-actions" style="margin-top: 0; border: none; padding: 0">
                        <button class="action-btn" onclick="editBook('${book.id}')" title="Edit">
                            <i class="fa-solid fa-pen"></i>
                        </button>
                        <button class="action-btn" onclick="deleteBook('${book.id}')" title="Delete" style="color: var(--danger-color)">
                            <i class="fa-solid fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function renderBooks(booksToRender = books) {
    booksGrid.innerHTML = '';

    if (booksToRender.length === 0) {
        booksGrid.style.display = 'none';
        emptyState.style.display = 'block';
        return;
    }

    booksGrid.style.display = 'grid';
    emptyState.style.display = 'none';

    booksToRender.forEach(book => {
        booksGrid.innerHTML += getBookCard(book);
    });
}

// Modal Functions
function openModal(isEdit = false, bookId = null) {
    modalOverlay.classList.add('open');
    if (isEdit && bookId) {
        const book = books.find(b => b.id === bookId);
        modalTitle.textContent = 'Edit Book';
        document.getElementById('bookId').value = book.id;
        document.getElementById('title').value = book.title;
        document.getElementById('author').value = book.author;
        document.getElementById('isbn').value = book.isbn || '';
        document.getElementById('status').value = book.status;
    } else {
        modalTitle.textContent = 'Add New Book';
        bookForm.reset();
        document.getElementById('bookId').value = '';
    }
}

function closeModal() {
    modalOverlay.classList.remove('open');
    bookForm.reset();
}

// Actions
window.editBook = (id) => {
    openModal(true, id);
};

window.deleteBook = (id) => {
    if (confirm('Are you sure you want to delete this book?')) {
        books = books.filter(b => b.id !== id);
        saveToLocalStorage();
        renderBooks();
    }
};

// Event Listeners
addBookBtn.addEventListener('click', () => openModal(false));
closeModalBtn.addEventListener('click', closeModal);
cancelBtn.addEventListener('click', closeModal);

modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});

bookForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
        id: document.getElementById('bookId').value,
        title: document.getElementById('title').value,
        author: document.getElementById('author').value,
        isbn: document.getElementById('isbn').value,
        status: document.getElementById('status').value
    };

    if (formData.id) {
        // Update existing
        const index = books.findIndex(b => b.id === formData.id);
        if (index !== -1) {
            books[index] = { ...books[index], ...formData, coverColor: books[index].coverColor };
        }
    } else {
        // Create new
        const newBook = {
            ...formData,
            id: Date.now().toString(),
            coverColor: getRandomColor()
        };
        books.unshift(newBook);
    }

    saveToLocalStorage();
    renderBooks();
    closeModal();
});

searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const filtered = books.filter(book =>
        book.title.toLowerCase().includes(term) ||
        book.author.toLowerCase().includes(term) ||
        (book.isbn && book.isbn.includes(term))
    );
    renderBooks(filtered);
});
