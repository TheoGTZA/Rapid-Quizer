package com.tgza.rapidquizerspring.entities;

import jakarta.persistence.*;
import lombok.Setter;

@Entity
public class Answer {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Setter
    private String text;

    @Setter
    private boolean isCorrect;

    @ManyToOne
    @JoinColumn(name = "question_id")
    @Setter
    private Question question;

}
