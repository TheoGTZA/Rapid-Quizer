package com.tgza.rapidquizerspring.controllers;

import com.tgza.rapidquizerspring.entities.Questions;
import com.tgza.rapidquizerspring.services.QuestionsService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
public class QuestionsController {

    @Autowired
    private QuestionsService questionsService;

    @GetMapping
    public List<Questions> getAllQuestions() {
        return questionsService.getAllQuestions();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Questions> getQuestionById(@PathVariable Long id) {
        Optional<Questions> question = questionsService.getQuestionById(id);
        return question.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Questions createQuestion(@RequestBody Questions question) {
        return questionsService.createQuestion(question);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Questions> updateQuestion(@PathVariable Long id, @RequestBody Questions questionDetails) {
        Optional<Questions> updatedQuestion = questionsService.updateQuestion(id, questionDetails);
        return updatedQuestion.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuestion(@PathVariable Long id) {
        boolean isDeleted = questionsService.deleteQuestion(id);
        return isDeleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
