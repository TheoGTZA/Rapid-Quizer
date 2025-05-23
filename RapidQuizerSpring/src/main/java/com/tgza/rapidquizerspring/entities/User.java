package com.tgza.rapidquizerspring.entities;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.tgza.rapidquizerspring.enums.Role;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.util.List;


@Entity
@Getter
@Setter
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @JsonBackReference
    @OneToMany(mappedBy = "creator")
    private List<Question> questions;
}