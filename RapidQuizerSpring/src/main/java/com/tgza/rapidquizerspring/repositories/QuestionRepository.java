package com.tgza.rapidquizerspring.repositories;

import com.tgza.rapidquizerspring.entities.Question;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<Question, Long> {
}
