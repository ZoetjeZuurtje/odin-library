"use-strict";

function Book(title, author, pages, haveRead, cover = 'https://placehold.co/100x120', id = Math.floor(Math.random() * 1000000000)) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.haveRead = haveRead;
    this.cover = cover;
    this.id = id
}
Book.prototype.getDescription = function () {
    let readMsg = this.haveRead ? 'read' : 'unread';
    return `${this.title} by ${this.author}, ${this.pages} pages, ${readMsg}`
}

function Library(...books) {
    this.books = [];
    books.forEach(book => this.books.push(book));
}
Library.prototype.add = function(book) {
    this.books.push(book);
}
Library.prototype.getBook = function(id) {
    return this.books.filter(book => book.id == id)[0];
}
Library.prototype.remove = function(id) {
    let book = this.getBook(id);
    let index = this.books.indexOf(book);
    this.books = this.books.slice(0, index).concat(this.books.slice(index + 1));
}

function LibraryGUI(library, displayArea) {
    this.library = library;
    this.displayArea = displayArea;
    this.displayBooks();
}
LibraryGUI.prototype.createCard = function(book) {
    let card = document.createElement('div');
    card.classList.add('book');
    card.dataset.id = book.id;
    card.innerHTML = `
    <img src="${book.cover}" alt="">
    <span>${book.title}</span>
    <span>${book.author}</span>
    <span>${book.pages}</span>
    <span>${book.haveRead}</span>
    <div class="book-buttons">
        <button class="onclick read-book material-symbols-outlined">
            chrome_reader_mode
        </button>
        <button class="onclick remove-book material-symbols-outlined">
            delete
        </button>
    </div>`;
    return card;
}
LibraryGUI.prototype.displayBooks = function() {
    let frag = new DocumentFragment();

    this.library.books.forEach(book => {
        frag.append(this.createCard(book));
    });

    this.displayArea.innerHTML = '';
    this.displayArea.append(frag);
    this.setEventListeners();
}
LibraryGUI.prototype.updateBook = function(id) {
    let card = document.querySelector(`[data-id="${id}"]`);
    let book = this.library.getBook(id);

    card.children[0].innerHTML = `<img src="${book.cover}" alt="">`;
    card.children[1].innerHTML = `<span>${book.title}</span>`;
    card.children[2].innerHTML = `<span>${book.author}</span>`;
    card.children[3].innerHTML = `<span>${book.pages}</span>`;
    card.children[4].innerHTML = `<span>${book.haveRead}</span>`;
}
LibraryGUI.prototype.setEventListeners = function() {
    let readBtns = document.querySelectorAll('.onclick.read-book');
    readBtns.forEach(btn => btn.addEventListener('click', (event) => { this.toggleRead(event) }));

    let removeBtns = document.querySelectorAll('.onclick.remove-book');
    removeBtns.forEach(btn => btn.addEventListener('click', (event) => {
        let id = event.target.parentNode.parentNode.dataset.id;
        this.library.remove(id);
        this.displayBooks();
    }));
}
LibraryGUI.prototype.toggleRead = function(event) {
    let id = event.target.parentNode.parentNode.dataset.id;
    let book = this.library.getBook(id);
    book.haveRead = book.haveRead ? false : true;
    this.updateBook(id);
}

function getValues(form) {
    const inputs = form.querySelectorAll('input:not([type="checkbox"])');
    const checkbox = form.querySelector('input[type="checkbox"]');
    const checkboxValue = checkbox.checked;
    console.log(checkboxValue);
    let inputValues = [checkboxValue];
    inputs.forEach(elem => inputValues.push(elem.value));
    return inputValues;
}

const showFormBtn   = document.querySelector('header button');
const formModal     = document.querySelector('dialog');
const form          = document.querySelector('dialog form');
const confirmBtn    = form.querySelector('button[type="submit"]');
form.querySelectorAll('input').forEach(element => {
    element.addEventListener('change', () => {
        confirmBtn.value = getValues(form);
    });
});
formModal.addEventListener('close', e => {
    let values = confirmBtn.value.split(',');
    let cover = values[1] ? values[1] : undefined;
    let book = new Book(values[2], values[3], values[4], values[0], cover,/* id*/);
    lib.add(book);
    gui.displayBooks();
});
showFormBtn.addEventListener('click', () => {
    formModal.show();
    confirmBtn.value = getValues(form);
});

let lib = new Library();
let gui = new LibraryGUI(lib, document.querySelector('.books'));