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
    @Column(length = 10000)
    private String text;

    @OneToMany(mappedBy = "question",cascade = CascadeType.ALL, orphanRemoval = true)
    @Setter
    private List<Answer> answers;


}
