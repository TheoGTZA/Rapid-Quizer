package com.tgza.rapidquizerspring.services;

import com.tgza.rapidquizerspring.entities.Questions;
import com.tgza.rapidquizerspring.repositories.QuestionsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class QuestionsService {

    @Autowired
    private QuestionsRepository questionsRepository;

    public List<Questions> getAllQuestions() {
        return questionsRepository.findAll();
    }

    public Optional<Questions> getQuestionById(Long id) {
        return questionsRepository.findById(id);
    }

    public Questions createQuestion(Questions question) {
        return questionsRepository.save(question);
    }

    public Optional<Questions> updateQuestion(Long id, Questions questionDetails) {
        return questionsRepository.findById(id).map(question -> {
            question.setContenu(questionDetails.getContenu());
            question.setCategorie(questionDetails.getCategorie());
            return questionsRepository.save(question);
        });
    }

    public boolean deleteQuestion(Long id) {
        return questionsRepository.findById(id).map(question -> {
            questionsRepository.delete(question);
            return true;
        }).orElse(false);
    }
}
