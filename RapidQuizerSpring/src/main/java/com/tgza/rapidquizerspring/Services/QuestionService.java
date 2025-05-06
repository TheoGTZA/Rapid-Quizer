package com.tgza.rapidquizerspring.Services;

import com.tgza.rapidquizerspring.entities.Question;
import com.tgza.rapidquizerspring.entities.User;
import com.tgza.rapidquizerspring.repositories.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuestionService {

    @Autowired
    private QuestionRepository questionRepository;

    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    public List<Question> getQuestionsByCategory(Long categoryId) {
        return questionRepository.findByCategoryId(categoryId);
    }

    public Question getQuestionById(Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
    }

    public Question createQuestion(Question question, User creator) {
        return questionRepository.save(question);
    }

    public List<Question> getQuestionsByCreator(User creator) {
        return questionRepository.findByCreator(creator);
    }

}