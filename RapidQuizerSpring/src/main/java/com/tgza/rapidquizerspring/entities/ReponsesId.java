package com.tgza.rapidquizerspring.entities;

import java.io.Serializable;
import lombok.Data;

@Data
public class ReponsesId implements Serializable {
    private Long reponse_id;
    private Long question;
}
