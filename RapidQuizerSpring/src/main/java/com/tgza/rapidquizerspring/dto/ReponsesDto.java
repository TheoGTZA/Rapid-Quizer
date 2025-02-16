package com.tgza.rapidquizerspring.dto;

import com.tgza.rapidquizerspring.entities.Questions;
import lombok.Data;

@Data
public class ReponsesDto {

    private Long reponse_id;

    private Questions question;

    private String contenu;

}
