package com.juhanavalasmo.book_manager;

import java.util.Collection;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

/**
 * Controller for the server-client communication
 */
@RestController
public class ApplicationController {

	/**
	 * Main page
	 */
	@GetMapping("/")
	public ModelAndView app() {
		ModelAndView modelAndView = new ModelAndView();
		modelAndView.setViewName("app");
		return modelAndView;
	}

	// API below. 
	// TODO: These should catch exeptions raised by the database 
	// and return useful error messages to the client.
	@GetMapping("/getbook")
	public Book getBook(@RequestParam(value = "id") String id) {
		return Database.getInstance().getBook(id);
	}

	@PutMapping("/addbook")
	public void addBook(
			@RequestParam(value = "id") String id,
			@RequestParam(value = "title") String title,
			@RequestParam(value = "author") String author,
			@RequestBody String description) {
		Book book = new Book(id, title, author, description);
		Database.getInstance().addBook(book);
	}

	@PutMapping("/editbook")
	public void editBook(
			@RequestParam(value = "id") String id,
			@RequestParam(value = "title") String title,
			@RequestParam(value = "author") String author,
			@RequestBody String description) {
		Book book = new Book(id, title, author, description);
		Database.getInstance().editBook(book);
	}

	@PutMapping("/deletebook")
	public void deleteBook(@RequestParam(value = "id") String id) {
		Database.getInstance().deleteBook(id);
	}

	@GetMapping("/getbooks")
	public Collection<Book> getBooks() {
		return Database.getInstance().getBooks();
	}
}