package com.tgza.rapidquizerspring.repositories;

import com.tgza.rapidquizerspring.entities.PersonalQuestion;
import com.tgza.rapidquizerspring.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PersonalQuestionRepository extends JpaRepository<PersonalQuestion, Long> {
    List<PersonalQuestion> findByCreator(User creator);
}
