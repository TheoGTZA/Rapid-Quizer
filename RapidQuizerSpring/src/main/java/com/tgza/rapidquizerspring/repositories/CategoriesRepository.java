package com.tgza.rapidquizerspring.repositories;

import com.tgza.rapidquizerspring.entities.Categories;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface CategoriesRepository extends JpaRepository<Categories, Long>{
}
