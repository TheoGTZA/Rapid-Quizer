package com.tgza.rapidquizerspring.repositories;

import com.tgza.rapidquizerspring.entities.Question;
import com.tgza.rapidquizerspring.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByCategoryIdAndIsPersonal(Long categoryId, boolean isPersonal);

    List<Question> findByIsPersonal(boolean isPersonal);
    List<Question> findByCreator(Optional<User> creator);
    List<Question> findByCategoryIdAndCreator(Long categoryId, Optional<User> creator);
}
