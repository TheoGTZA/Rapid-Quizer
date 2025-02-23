package com.tgza.rapidquizerspring.services;

import com.tgza.rapidquizerspring.entities.Categories;
import com.tgza.rapidquizerspring.repositories.CategoriesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CategoriesService {

    @Autowired
    private final CategoriesRepository categoriesRepository;

    public List<Categories> getAllCategories() {
        return categoriesRepository.findAll();
    }

    public Optional<Categories> getCategoryById(Long id) {
        return categoriesRepository.findById(id);
    }

    public Categories createCategory(Categories category) {
        return categoriesRepository.save(category);
    }

    public Optional<Categories> updateCategory(Long id, Categories categoryDetails) {
        return categoriesRepository.findById(id).map(category -> {
            category.setLibelle(categoryDetails.getLibelle());
            return categoriesRepository.save(category);
        });
    }

    public boolean deleteCategory(Long id) {
        return categoriesRepository.findById(id).map(category -> {
            categoriesRepository.delete(category);
            return true;
        }).orElse(false);
    }
}
