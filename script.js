const myLibrary = [];
const container = document.querySelector(".library-container");
const addNewBookBtn = document.querySelector(".add-new-book-btn");
const addBookForm = document.querySelector(".add-book-form");
const addToLibraryBtn = document.querySelector(".add-to-library-btn");
const titleInput = document.querySelector("#title");
const titleError = document.querySelector("#title-error");
const authorInput = document.querySelector("#author");
const authorError = document.querySelector("#author-error");
const pagesInput = document.querySelector("#pages");
const pagesError = document.querySelector("#pages-error");
const readInput = document.querySelector("#read");
const dialog = document.querySelector("dialog");
const closeDialogBtn = document.querySelector(".close-dialog-btn");

const validators = {
  title: {
    input: titleInput,
    errorEl: titleError,
    validate: (val) => val.trim() !== "",
    message: "Title can't be empty!",
  },
  author: {
    input: authorInput,
    errorEl: authorError,
    validate: (val) => val.trim() !== "",
    message: "Author can't be empty!",
  },
  pages: {
    input: pagesInput,
    errorEl: pagesError,
    validate: (val) => Number(val) > 0,
    message: "Pages must be 1 or more!",
  },
};

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

function showErrorMsg(errorElement, message) {
  errorElement.textContent = message;
  errorElement.classList.add("error", "active");
}

function resetErrorMsg(errorElement) {
  errorElement.textContent = "";
  errorElement.classList.remove("error", "active"); // Removes the `active` class
}

function validateInputs() {
  let isValid = true;

  for (const key in validators) {
    const { input, errorEl, validate, message } = validators[key];
    if (validate(input.value)) {
      resetErrorMsg(errorEl);
    } else {
      showErrorMsg(errorEl, message);
      isValid = false;
    }
  }
  return isValid;
}

addNewBookBtn.addEventListener("click", () => {
  dialog.showModal();
  document.getElementById("dummy-focus").focus();
});

addBookForm.addEventListener("input", (event) => {
  const field = validators[event.target.id];
  if (!field) return; // Not a tracked input

  if (field.validate(event.target.value)) {
    resetErrorMsg(field.errorEl);
  } else {
    showErrorMsg(field.errorEl, field.message);
  }
});

addBookForm.addEventListener("submit", function (event) {
  event.preventDefault(); // Prevent default form submission behavior
  if (!validateInputs()) {
    return;
  }

  //Once inputs are valid, save their values
  const title = titleInput.value.trim();
  const author = authorInput.value.trim();
  const pages = parseInt(pagesInput.value, 10);
  const isRead = readInput.checked;
  const newBook = addBookToLibrary(title, author, pages, isRead);

  if (newBook) {
    displayLibrary();
    addBookForm.reset(); //Reset form
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

dialog.addEventListener("close", () => {
  addBookForm.reset();
  for (const key in validators) {
    const errorEl = validators[key].errorEl;
    resetErrorMsg(errorEl);
  }
});

// Listen for when the dialog closes (regardless of how)
dialog.addEventListener("close", () => {
  addBookForm.reset();
  for (const key in validators) {
    const errorEl = validators[key].errorEl;
    resetErrorMsg(errorEl);
  }
});

// Simplified event listeners - just close the dialog
closeDialogBtn.addEventListener("click", () => {
  dialog.close();
});

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) {
    dialog.close();
  }
});

displayLibrary();
