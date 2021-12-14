package com.juhanavalasmo.book_manager;

/**
 * Server-side representation of a book
 */
public class Book {
    private String id;
    private String title;
    private String author;
    private String description;

    public Book(String id, String title, String author, String description) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.description = description;
    }

    public String getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getAuthor() {
        return author;
    }

    public String getDescription() {
        return description;
    }
}
