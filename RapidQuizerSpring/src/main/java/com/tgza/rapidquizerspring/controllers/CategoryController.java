package com.tgza.rapidquizerspring.controllers;



import com.tgza.rapidquizerspring.entities.Category;
import com.tgza.rapidquizerspring.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class CategoryController {

    @Autowired
    private CategoryRepository categoryRepository;

    @GetMapping
    public List<Category> getAllCategories() {
        List<Category> categories = categoryRepository.findAll();
        System.out.println("Fetching all categories: " + categories.size() + " found");
        return categories;
    }

    @PostMapping
    public Category createCategory(@RequestBody Category category) {
        System.out.println("Creating category: " + category.getName());
        return categoryRepository.save(category);
    }
}