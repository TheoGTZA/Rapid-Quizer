package com.tgza.rapidquizerspring.entities;

import jakarta.persistence.*;
import lombok.Setter;

import java.util.List;

@Entity
public class Question {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    private String text;

    @OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)
    @Setter
    private List<Answer> answers;


}
