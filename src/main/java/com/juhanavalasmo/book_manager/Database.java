package com.juhanavalasmo.book_manager;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;

/**
 * Class that provides access to the books database.
 * TODO: Use an actual database
 */
public class Database {

    /**
     * In-memory HashMap of ids to Books. Placeholder for an actual database
     */
    private Map<String, Book> bookMap = new HashMap<>();
    /**
     * The unique database instance. Accessed through Database.getInstance()
     */
    private static Database instance = new Database();

    /**
     * Returns the Database instance
     */
    public static Database getInstance() {
        return instance;
    }

    /**
     * Database constructor
     */
    private Database() {
        // dummy data
        bookMap.put("Id", new Book("Id", "Title", "Author", "Description"));
        bookMap.put("AnotherId", new Book("AnotherId", "AnotherTitle", "AnotherAuthor", "AnotherDescription"));
    }

    // TODO: These should throw exceptions when things go wrong
    public Book getBook(String id) {
        return bookMap.get(id);
    }

    public void addBook(Book book) {
        bookMap.put(book.getId(), book);
    }

    public void editBook(Book book) {
        bookMap.put(book.getId(), book);
    }

    public void deleteBook(String id) {
        bookMap.remove(id);
    }

    public Collection<Book> getBooks() {
        return bookMap.values();
    }
}
