package com.tgza.rapidquizerspring.controllers;



import com.tgza.rapidquizerspring.entities.Category;
import com.tgza.rapidquizerspring.repositories.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
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
    @PreAuthorize("hasAuthority('ADMIN')")
    public Category createCategory(@RequestBody Category category) {
        System.out.println("Received request to create category: " + category.getName());
        try {
            Category savedCategory = categoryRepository.save(category);
            System.out.println("Category created successfully with ID: " + savedCategory.getId());
            return savedCategory;
        } catch (Exception e) {
            System.err.println("Error creating category: " + e.getMessage());
            throw e;
        }
    }
}
