package com.tgza.rapidquizerspring.entities;

import jakarta.persistence.Embeddable;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;

import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class ReponsesId implements Serializable {

    private Long reponse_id;

    private Long question;

    // constructeur par défaut
    public ReponsesId() {}

    // Getters and setters
    public Long getReponse_id() {
        return reponse_id;
    }

    public void setReponse_id(Long reponse_id) {
        this.reponse_id = reponse_id;
    }

    public Long getQuestion() {
        return question;
    }

    public void setQuestion(Long question) {
        this.question = question;
    }

    // redéfinition de hashCode and equals
    @Override
    public int hashCode() {
        return Objects.hash(reponse_id, question);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        ReponsesId that = (ReponsesId) obj;
        return Objects.equals(reponse_id, that.reponse_id) && Objects.equals(question, that.question);
    }
}
