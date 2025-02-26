package com.tgza.rapidquizerspring.controllers;

import com.tgza.rapidquizerspring.entities.Answer;
import com.tgza.rapidquizerspring.entities.Category;
import com.tgza.rapidquizerspring.entities.Question;
import com.tgza.rapidquizerspring.repositories.CategoryRepository;
import com.tgza.rapidquizerspring.repositories.QuestionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class FileUploadController {

    @Autowired
    private QuestionRepository questionRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    @PostMapping("/upload")
    public String handleFileUpload(@RequestParam("file") MultipartFile file, @RequestParam("category") Long categoryId ) {
        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
            StringBuilder content = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line).append("\n");
            }

            String latexContent = content.toString();
            Pattern questionPattern = Pattern.compile("\\\\begin\\{questionmult\\}\\{.*?\\}\\s*(.*?)\\s*\\\\begin\\{reponses\\}", Pattern.DOTALL);
            Matcher questionMatcher = questionPattern.matcher(latexContent);
            String questionText = questionMatcher.find() ? questionMatcher.group(1).trim() : "";

            Pattern answersPattern = Pattern.compile("\\\\begin\\{reponses\\}\\s*(.*?)\\s*\\\\end\\{reponses\\}", Pattern.DOTALL);
            Matcher answersMatcher = answersPattern.matcher(latexContent);
            String answersText = answersMatcher.find() ? answersMatcher.group(1).trim() : "";

            String[] answerLines = answersText.split("\n");
            List<Answer> answers = new ArrayList<>();
            Question question = new Question();
            question.setText(questionText);
            questionRepository.save(question);
            for (String answerLine : answerLines) {
                if (answerLine.trim().isEmpty()) {
                    continue;
                }
                boolean isCorrect = answerLine.startsWith("\\bonne");
                String answerText = answerLine.replaceAll("\\\\(bonne|mauvaise)\\{(.*?)\\}", "$2").trim();
                Answer answer = new Answer();
                answer.setText(answerText);
                answer.setCorrect(isCorrect);
                answer.setQuestion(question);
                answers.add(answer);
            }

            Category category = categoryRepository.findById(categoryId).orElseThrow(() -> new RuntimeException("Category not found"));

            question.setAnswers(answers);
            question.setCategory(category);
            questionRepository.save(question);

            return "File uploaded and data saved successfully";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error processing file" + e.getMessage();
        }
    }
}
