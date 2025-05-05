package com.tgza.rapidquizerspring.repositories;

import com.tgza.rapidquizerspring.entities.Question;
import com.tgza.rapidquizerspring.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByCategoryId(Long categoryId);

    List<Question> findByIsPersonal(boolean isPersonal);
    List<Question> findByCreator(User creator);
}
