package com.tgza.rapidquizerspring.controllers;

import com.tgza.rapidquizerspring.Services.QuestionService;
import com.tgza.rapidquizerspring.entities.Question;
import com.tgza.rapidquizerspring.entities.User;
import com.tgza.rapidquizerspring.enums.Role;
import com.tgza.rapidquizerspring.repositories.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "http://localhost:4200", allowCredentials = "true")
public class QuestionController {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private QuestionService questionService;

    @GetMapping
    public List<Question> getAllQuestions() {
        return questionRepository.findAll();
    }

    @GetMapping("/category/{categoryId}")
    public List<Question> getQuestionsByCategory(@PathVariable Long categoryId) {
        List<Question> questions = questionRepository.findByCategoryId(categoryId);
        System.out.println("Questions found: " + questions.size()); // Debug log
        return questions;
    }

    @GetMapping("/{id}")
    public Question getQuestionById(@PathVariable Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
    }

    @GetMapping("/personal")
    @PreAuthorize("isAuthenticated()")
    public List<Question> getPersonalQuestions(@AuthenticationPrincipal User user) {
        return questionRepository.findByIsPersonal(true);
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('USER', 'CONTRIBUTOR', 'ADMIN')")
    public Question createQuestion(@RequestBody Question question, @AuthenticationPrincipal User user) {
        question.setCreator(user);

        if (user.getRole() == Role.USER) {
            question.setPersonal(true);
        }
        return questionRepository.save(question);
    }

    @GetMapping("/public")
    public List<Question> getPublicQuestions() {
        return questionRepository.findByIsPersonal(false);
    }

}