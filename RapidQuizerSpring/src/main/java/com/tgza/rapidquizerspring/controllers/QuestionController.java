package com.tgza.rapidquizerspring.controllers;

import com.tgza.rapidquizerspring.Services.QuestionService;
import com.tgza.rapidquizerspring.entities.CustomUserDetails;
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

    //@GetMapping                Retourne toutes les questions, même celles qui n'appartiennent pas à l'user
    //public List<Question> getAllQuestions() { return questionRepository.findAll(); }

    @GetMapping("/category/{categoryId}/public")
    public List<Question> getQuestionsByCategoryPublic(@PathVariable Long categoryId) {
        List<Question> questions = questionRepository.findByCategoryIdAndIsPersonal(categoryId, false);
        System.out.println("Questions found: " + questions.size()); // Debug log
        return questions;
    }

    @GetMapping("/category/{categoryId}/personal")
    public List<Question> getQuestionsByCategoryPersonal(@PathVariable Long categoryId) {
        List<Question> questions = questionRepository.findByCategoryIdAndIsPersonal(categoryId, true);
        System.out.println("Questions found: " + questions.size()); // Debug log
        return questions;
    }

    @GetMapping("/{id}")
    public Question getQuestionById(@PathVariable Long id) {
        return questionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Question not found"));
    }

    @GetMapping("/personal")
    @PreAuthorize("hasAnyAuthority('USER', 'CONTRIBUTOR', 'ADMIN')")
    public List<Question> getPersonalQuestions(@AuthenticationPrincipal CustomUserDetails customUserDetails) {
        User user = customUserDetails.getUser();
        if (user.getRole() == Role.USER || user.getRole() == Role.CONTRIBUTOR || user.getRole() == Role.ADMIN) {
            return questionRepository.findByIsPersonal(true);
        }
        else {
            return questionRepository.findByIsPersonal(false);
        }
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