package com.tgza.rapidquizerspring.entities;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Data
@IdClass(ReponsesId.class)
public class Reponses {

    @EmbeddedId
    private ReponsesId reponse_id;

    @Id
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Questions question;

    @Lob
    private String contenu;
}
