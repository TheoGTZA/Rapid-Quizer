package com.tgza.rapidquizerspring.controllers;

import com.tgza.rapidquizerspring.entities.Categories;
import com.tgza.rapidquizerspring.services.CategoriesService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoriesController {

    @Autowired
    private final CategoriesService categoriesService;

    @GetMapping
    public List<Categories> getAllCategories() {
        return categoriesService.getAllCategories();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Categories> getCategoryById(@PathVariable Long id) {
        Optional<Categories> category = categoriesService.getCategoryById(id);
        return category.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Categories createCategory(@RequestBody Categories category) {
        return categoriesService.createCategory(category);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Categories> updateCategory(@PathVariable Long id, @RequestBody Categories categoryDetails) {
        Optional<Categories> updatedCategory = categoriesService.updateCategory(id, categoryDetails);
        return updatedCategory.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        boolean isDeleted = categoriesService.deleteCategory(id);
        return isDeleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
