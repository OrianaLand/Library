const myLibrary = [];
const container = document.querySelector(".library-container");
const addNewBookBtn = document.querySelector(".add-new-book-btn");
const addBookForm = document.querySelector(".add-book-form");
const addToLibraryBtn = document.querySelector(".add-to-library-btn");
const titleInput = document.querySelector("#title");
const authorInput = document.querySelector("#author");
const pagesInput = document.querySelector("#pages");
const readInput = document.querySelector("#read");
const dialog = document.querySelector("dialog");
const closeDialogBtn = document.querySelector(".close-dialog-btn");

/* function Book(title, author, pages, read) {
  if (!new.target) {
    throw Error("You must use the 'new' operator to call the constructor");
  }

  this.title = title;
  this.author = author;
  this.pages = pages;
  this.isRead = read;
  this.id = crypto.randomUUID();
} */

/* Book.prototype.info = function () {
  return `${this.title} by ${this.author}, ${this.pages} pages, ${
    this.isRead ? "Already read!" : "Not read yet"
  }`;
};

Book.prototype.toggleReadStatus = function () {
  this.isRead = !this.isRead;
}; */

class Book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.isRead = read;
    this.id = crypto.randomUUID();
  }

  toggleReadStatus() {
    this.isRead = !this.isRead;
  }

  info() {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${
      this.isRead ? "Already read!" : "Not read yet"
    }`;
  }
}

function addBookToLibrary(title, author, pages, read) {
  try {
    const newBook = new Book(title, author, pages, read);
    myLibrary.push(newBook);
    return newBook;
  } catch (error) {
    console.error("Error adding book to library:", error);
    return null;
  }
}

function removeBook(id) {
  const index = myLibrary.findIndex((book) => book.id === id);

  if (index === -1) {
    console.error(`Book with id ${id} not found in library`);
    return;
  }

  if (
    confirm(
      `Are you sure you want to delete ${myLibrary[index].title} by ${myLibrary[index].author} from your library?`
    )
  ) {
    if (index > -1) {
      myLibrary.splice(index, 1);
    }

    const bookCard = document.getElementById(id);
    if (bookCard) {
      bookCard.remove();
    }

    if (myLibrary.length === 0) {
      displayLibrary();
    }
  }
}

function createBookCardElement(book) {
  // Create all DOM elements
  const bookCard = document.createElement("div");
  const bookTitle = document.createElement("h2");
  const bookAuthor = document.createElement("p");
  const bookPages = document.createElement("p");
  const bookStatus = document.createElement("p");
  const removeBtn = document.createElement("button");
  const toggleReadBtn = document.createElement("button");

  // Set up classes and IDs
  bookCard.className = "book-card";
  bookCard.id = book.id;
  removeBtn.className = "remove-book-btn";
  toggleReadBtn.className = "button toggle-status-btn";

  // Set content
  bookTitle.textContent = book.title;
  bookAuthor.textContent = book.author;
  bookPages.textContent = `${book.pages} pages`;
  bookStatus.textContent = book.isRead ? "Already read!" : "Not read yet";
  removeBtn.textContent = "x";
  toggleReadBtn.textContent = book.isRead ? "Mark as unread" : "Mark as read";

  // Assemble the card
  bookCard.append(
    removeBtn,
    bookTitle,
    bookAuthor,
    bookPages,
    bookStatus,
    toggleReadBtn
  );

  return { bookCard, bookStatus, toggleReadBtn };
}

function attachBookCardEvents(book, bookStatus, toggleReadBtn) {
  toggleReadBtn.addEventListener("click", () => {
    book.toggleReadStatus();
    updateBookStatusDisplay(book, bookStatus, toggleReadBtn);
  });
}

function updateBookStatusDisplay(book, bookStatus, toggleReadBtn) {
  bookStatus.textContent = book.isRead ? "Already read!" : "Not read yet";
  toggleReadBtn.textContent = book.isRead ? "Mark as unread" : "Mark as read";
}

function displayBook(book) {
  // Create the card structure
  const { bookCard, bookStatus, toggleReadBtn } = createBookCardElement(book);

  // Attach event listeners
  attachBookCardEvents(book, bookStatus, toggleReadBtn);

  // Add to DOM
  container.appendChild(bookCard);
}

function displayLibrary() {
  // Clear existing display
  container.innerHTML = "";

  if (myLibrary.length === 0) {
    const placeholder = document.createElement("p");
    placeholder.textContent = "Your library is empty. Add a book!";
    placeholder.className = "empty-library-msg";
    container.appendChild(placeholder);
    return;
  }

  // Display each book
  myLibrary.forEach(displayBook);
}

/* addBookToLibrary(
  "The Ballad of Songbirds and Snakes",
  "Suzanne Collins",
  528,
  false
);
addBookToLibrary("The Woman in me", "Britney Spears", 288, false);
addBookToLibrary("El Principito", "Antoine de Saint-Exupéry", 100, true);
addBookToLibrary("Toma hierro para la anemia", "Oriana", 200, true);
addBookToLibrary("How to buy a web cam", "Logitech", 1254, false);

displayLibrary(); */

addNewBookBtn.addEventListener("click", () => {
  dialog.showModal();
  document.getElementById("dummy-focus").focus();
});

closeDialogBtn.addEventListener("click", () => {
  dialog.close();
  addBookForm.reset();
});

addBookForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevents the form from being submitted / page reload

  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const pages = parseInt(pagesInput.value, 10);
  const isRead = readInput.checked;

  if (!title || !author || isNaN(pages) || pages <= 0) {
    alert("Please fill in all fields correctly.");
    return;
  }

  const newBook = addBookToLibrary(title, author, pages, isRead);

  if (newBook) {
    displayLibrary();
    /* displayBook(newBook); */
    //Reset form

    addBookForm.reset();
    addNewBookBtn.textContent = "Add new Book!";
  }

  dialog.close();
});

container.addEventListener("click", (event) => {
  if (event.target.classList.contains("remove-book-btn")) {
    const bookId = event.target.parentElement.id;
    removeBook(bookId);
  }
});

//Close modal when clicking outside of it
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    addBookForm.reset();
    dialog.close();
  }
});

displayLibrary();
