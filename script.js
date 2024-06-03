const bookList = [];
const RENDER_EVENT = 'renderBookList';

document.addEventListener('DOMContentLoaded', function () {
  addBookHandler();
  if (isStorageAvailable()) {
    loadStorage();
  }
});

document.addEventListener(RENDER_EVENT, function () {
  const incompleteBookList = document.getElementById('incompleteBookshelfList');
  incompleteBookList.innerHTML = '';
  const completeBookList = document.getElementById('completeBookshelfList');
  completeBookList.innerHTML = '';

  for (const bookItem of bookList) {
    const bookElement = createBookElement(bookItem);
    if (bookItem.isComplete) {
      completeBookList.append(bookElement);
    } else {
      incompleteBookList.append(bookElement);
    }
  }
  updateLocalStorage();
});

function generateBookId() {
  return +new Date();
}

function createBookObject(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year: Number(year),
    isComplete,
  };
}

function addBook() {
  const bookTitle = document.getElementById('inputBookTitle').value;
  const bookAuthor = document.getElementById('inputBookAuthor').value;
  const bookYear = document.getElementById('inputBookYear').value;
  const isBookComplete = document.getElementById('inputBookIsComplete').checked;

  const bookId = generateBookId();
  const newBook = createBookObject(bookId, bookTitle, bookAuthor, bookYear, isBookComplete);
  bookList.push(newBook);

  document.dispatchEvent(new Event(RENDER_EVENT));
  updateLocalStorage();
}

function addBookHandler() {
  const submitBookForm = document.getElementById('inputBook');
  submitBookForm.addEventListener('submit', function (event) {
    event.preventDefault();
    addBook();
    document.dispatchEvent(new Event(RENDER_EVENT));
  });
}

function createBookElement(book) {
  const bookTitleElement = document.createElement('h3');
  bookTitleElement.innerText = book.title;

  const bookAuthorElement = document.createElement('p');
  bookAuthorElement.innerText = 'Penulis: ' + book.author;

  const bookYearElement = document.createElement('p');
  bookYearElement.innerText = 'Tahun: ' + book.year;

  const markCompleteButton = document.createElement('button');
  markCompleteButton.classList.add('green');
  markCompleteButton.innerText = book.isComplete ? 'Belum selesai dibaca' : 'Selesai dibaca';

  const removeButton = document.createElement('button');
  removeButton.classList.add('red');
  removeButton.innerText = 'Hapus Buku';

  markCompleteButton.addEventListener('click', function () {
    toggleBookCompletion(book.id);
  });

  removeButton.addEventListener('click', function () {
    removeBookFromList(book.id);
  });

  const actionContainer = document.createElement('div');
  actionContainer.classList.add('action');
  actionContainer.append(markCompleteButton, removeButton);

  const bookContainer = document.createElement('article');
  bookContainer.classList.add('book_item');
  bookContainer.append(bookTitleElement, bookAuthorElement, bookYearElement, actionContainer);
  bookContainer.setAttribute('id', `book-${book.id}`);

  return bookContainer;
}

function toggleBookCompletion(bookId) {
  const bookToUpdate = findBook(bookId);

  if (bookToUpdate == null) return;

  bookToUpdate.isComplete = !bookToUpdate.isComplete;
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function removeBookFromList(bookId) {
  const bookIndex = findBookIndex(bookId);
  if (bookIndex === -1) return;

  bookList.splice(bookIndex, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function findBookIndex(bookId) {
  for (const index in bookList) {
    if (bookList[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function findBook(bookId) {
  return bookList.find(book => book.id === bookId);
}

function updateLocalStorage() {
  if (isStorageAvailable()) {
    const parsed = JSON.stringify(bookList);
    localStorage.setItem('BOOKSHELF_APPS', parsed);
  }
}

function loadStorage() {
  const serializedData = localStorage.getItem('BOOKSHELF_APPS');
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      bookList.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}

function isStorageAvailable() {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}
