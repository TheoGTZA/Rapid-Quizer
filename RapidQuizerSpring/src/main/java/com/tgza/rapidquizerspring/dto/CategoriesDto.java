package com.tgza.rapidquizerspring.dto;

import com.tgza.rapidquizerspring.entities.Categories;
import lombok.Data;

@Data
public class CategoriesDto {
    private Long categorie_id;

    private String libelle;

    private Categories categorie_sup;
}
