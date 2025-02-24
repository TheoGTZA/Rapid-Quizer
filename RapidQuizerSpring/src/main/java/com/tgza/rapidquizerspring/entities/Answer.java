package com.tgza.rapidquizerspring.entities;

import jakarta.persistence.*;
import lombok.Setter;

@Entity
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    @Column(length = 10000)
    private String text;

    @Setter
    private boolean isCorrect;

}
