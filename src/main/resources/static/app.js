/**
 * Client side scripts
 */

/**
 * This is a dict that contains all fetched books in a dictionary as Book objects. 
 * Books' ids are used as keys.
 */
var bookdict = null;

/**
 * Which book has been selected from the list at the bottom of app.html
 */
var selectedBook = null;

/**
 * List of books at the bottom of app.html
 */
const booklistTable = document.getElementById("Booklist");

/**
 * Client-side representation of a book
 */
class Book {
    constructor(id, title, author, description) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.description = description;
    }

    /**
     * Write Book data to the text boxes in app.html
     */
    writeToTextBoxes() {
        document.getElementById("title").value = this.title;
        document.getElementById("author").value = this.author;
        document.getElementById("description").value = this.description;
    }

    /**
     * Add Book to booklistTable. 
     * The created table row will have the same id as the book
     */
    addToBooklist() {
        let row = document.createElement('tr');
        row.setAttribute("id", this.id);
        booklistTable.appendChild(row);
        let authorCell = document.createElement('td');
        row.appendChild(authorCell);
        authorCell.innerText = this.author;
        let titleCell = document.createElement('td');
        row.appendChild(titleCell);
        titleCell.innerText = this.title;

        row.addEventListener("click", function() {
            selectBook(this.getAttribute("id"));
        });
    }

    /**
     * Remove Book from booklistTable
     */
    removeFromBooklist() {
        booklistTable.removeChild(document.getElementById(this.id))
    }

    /**
     * Returns an url with Book's id, title and author as params.
     */
    asUrl() {
        let url = "";
        url += "?id=" + this.id;
        url += "&title=" + this.title;
        url += "&author=" + this.author;
        return url;
    }
}

/**
 * Add a new Book to the server
 */
async function saveNew() {
    // Create a unique id for the new book. TODO: Clean this randomness
    while (true) {
        let randInt = Math.floor(Math.random() * 1000000);
        var id = randInt.toString();
        if (Object.keys(bookdict).indexOf(id) == -1) {
            break
        }
    }
    // Create the Book object using data from the web page's text boxes
    let book = new Book(
        id,
        document.getElementById("title").value,
        document.getElementById("author").value,
        document.getElementById("description").value);
    // Send the book to the server
    let url = "/addbook" + book.asUrl();
    const response = await fetch(
        url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'plain/text',
            },
            body: book.description
        });
    if (response.status == "200") {
        // All went well. Add the book to booklistTable
        bookdict[id] = book;
        book.addToBooklist()
        clearSelection()
    } else {
        // Something went wrong. TODO: More informative errors
        window.alert("Failure")
    }
}

/**
 * Save changes made to the selected book by sending an updated book to the server
 */
async function saveSelected() {
    let id = selectedBook.id
        // Create a new Book object with edited text data but the same id as the old one
    let book = new Book(
        id,
        document.getElementById("title").value,
        document.getElementById("author").value,
        document.getElementById("description").value);
    // selectedBook should point to the edited book insead of the old one
    selectedBook = book;
    // Send the edited book to the server
    let url = "/editbook" + book.asUrl();
    const response = await fetch(
        url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'plain/text',
            },
            body: book.description
        });
    if (response.status == "200") {
        // All went well. Delete the old book from client side
        bookdict[id].removeFromBooklist();
        delete bookdict[id];
        // Add the edited book to booklistTable and select it
        bookdict[id] = book;
        book.addToBooklist();
        selectBook(id);

    } else {
        // Something went wrong. TODO: More informative errors
        window.alert("Failure")
    }
}

/**
 * Delete the selected book from the client and the server.
 */
async function deleteSelected() {
    let id = selectedBook.id
        // Delete the book from the server
    const response = await fetch("/deletebook?id=" + id, { method: 'PUT' });
    if (response.status == "200") {
        // All went well. Delete the selected book from client side
        bookdict[id].removeFromBooklist();
        if (selectedBook.id == id) {
            selectedBook = null;
        }
        delete bookdict[id];
        clearSelection()
    } else {
        // Something went wrong. TODO: More informative errors
        window.alert("Failure")
    }
}

/**
 * Clears selection of any books
 */
function clearSelection() {
    if (selectedBook !== null) {
        // Clear highlighting on the previously selected book
        document.getElementById(selectedBook.id).style.backgroundColor = ""
    }
    selectedBook = null
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("description").value = "";
    // Now the user will be creating a new book. Disable buttons accordingly
    document.getElementById("Save New").disabled = false
    document.getElementById("Save").disabled = true
    document.getElementById("Delete").disabled = true
}

/**
 * Triggers when user clicks on a book in booklistTable.
 * If the already selected book is clicked, 
 * selection is cleared to allow the user to create a new book.
 * @param  {String} id id of the book that was clicked
 */
function selectBook(id) {
    if (selectedBook !== null) {
        // Clear highlighting on the previously selected book
        document.getElementById(selectedBook.id).style.backgroundColor = ""
        if (selectedBook.id == id) {
            // Clear book selection and text boxes
            selectedBook = null
            document.getElementById("title").value = "";
            document.getElementById("author").value = "";
            document.getElementById("description").value = "";
            // Now the user will be creating a new book. Disable buttons accordingly
            document.getElementById("Save New").disabled = false
            document.getElementById("Save").disabled = true
            document.getElementById("Delete").disabled = true
            return;
        }
    }
    // Highlight the selected book and add it's data to text boxes
    selectedBook = bookdict[id];
    document.getElementById(selectedBook.id).style.backgroundColor = "#0000FF"
    selectedBook.writeToTextBoxes()
        // Now the user will be modifying an existing book. Disable buttons accordingly
    document.getElementById("Save New").disabled = true
    document.getElementById("Save").disabled = false
    document.getElementById("Delete").disabled = false
}

/**
 * Initialize bookdict
 */
async function getBooklist() {
    let raw_list = await fetch('/getbooks').then(response => response.json());
    bookdict = {}
    for (let i = 0; i < raw_list.length; i++) {
        bookdict[raw_list[i].id] = new Book(
            raw_list[i].id,
            raw_list[i].title,
            raw_list[i].author,
            raw_list[i].description)
    }
}

/**
 * Add all books from bookdict to booklistTable
 */
async function makeBooklistTable() {
    for (var book_id in bookdict) {
        bookdict[book_id].addToBooklist()
    }
}

/**
 * Executed on page load. Fetch all books from the server and add them to booklistTable
 */
window.onload = function() {
    getBooklist().then(_ => makeBooklistTable());
    // In the beginning the user will be creating a new book. Disable buttons accordingly
    document.getElementById("Save New").disabled = false
    document.getElementById("Save").disabled = true
    document.getElementById("Delete").disabled = true
}