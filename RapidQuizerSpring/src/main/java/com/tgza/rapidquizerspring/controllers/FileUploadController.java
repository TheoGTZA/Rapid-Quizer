package com.tgza.rapidquizerspring.controllers;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.type.TypeReference;
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
    public String handleFileUpload(@RequestParam("file") MultipartFile file,
                                   @RequestParam("category") Long categoryId,
                                   @RequestParam("isPersonal") boolean isPersonal) {
        try {
            BufferedReader reader = new BufferedReader(new InputStreamReader(file.getInputStream()));
            StringBuilder content = new StringBuilder();
            String line;
            while ((line = reader.readLine()) != null) {
                content.append(line).append("\n");
            }

            String latexContent = content.toString();

            // Pattern amélioré pour capturer la question jusqu'au début des réponses
            Pattern questionPattern = Pattern.compile(
                    "\\\\begin\\{questionmult\\}\\{.*?\\}\\s*(.*?)\\s*\\\\begin\\{(reponses|choices)\\}",
                    Pattern.DOTALL
            );
            Matcher questionMatcher = questionPattern.matcher(latexContent);
            String questionText = questionMatcher.find() ? questionMatcher.group(1).trim() : "";

            // Pattern pour capturer la section des réponses (supporte les deux formats)
            Pattern answersPattern = Pattern.compile(
                    "\\\\begin\\{(reponses|choices)\\}\\s*(.*?)\\s*\\\\end\\{(reponses|choices)\\}",
                    Pattern.DOTALL
            );
            Matcher answersMatcher = answersPattern.matcher(latexContent);
            String answersText = answersMatcher.find() ? answersMatcher.group(2).trim() : "";

            Question question = new Question();
            question.setText(questionText);
            question.setPersonal(isPersonal);

            // Pattern amélioré pour les réponses individuelles (supporte les deux formats)
            Pattern singleAnswerPattern = Pattern.compile(
                    "\\\\(bonne|mauvaise|correctchoice|wrongchoice)\\{([^{}]|\\{[^{}]*\\})*\\}",
                    Pattern.DOTALL
            );
            Matcher singleAnswerMatcher = singleAnswerPattern.matcher(answersText);

            List<Answer> answers = new ArrayList<>();

            while (singleAnswerMatcher.find()) {
                String fullMatch = singleAnswerMatcher.group(0);
                boolean isCorrect = fullMatch.startsWith("\\bonne") || fullMatch.startsWith("\\correctchoice");

                // Extraction améliorée du contenu
                String answerText = extractLatexContent(fullMatch);

                Answer answer = new Answer();
                answer.setText(answerText);
                answer.setCorrect(isCorrect);
                answer.setQuestion(question);
                answers.add(answer);
            }

            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found"));

            question.setAnswers(answers);
            question.setCategory(category);
            questionRepository.save(question);

            return "File uploaded and data saved successfully";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error processing file: " + e.getMessage();
        }
    }

    private String extractLatexContent(String latex) {
        // Extrait le contenu entre les accolades externes
        int start = latex.indexOf("{") + 1;
        int end = latex.lastIndexOf("}");
        if (start >= 0 && end >= 0) {
            return latex.substring(start, end)
                    .replaceAll("\\r\\n|\\r|\\n", " ")  // Normalise les sauts de ligne
                    .replaceAll("\\s+", " ")            // Normalise les espaces
                    .trim();
        }
        return "";
    }

    @PostMapping("/uploadqa")
    public String handleQAUpload(@RequestParam("question") String q,
                                 @RequestParam("answers") String answersJSON,
                                 @RequestParam("category") Long categoryId,
                                 @RequestParam("correct") String correctJSON,
                                 @RequestParam("isPersonal") boolean p) {
        try {
            ObjectMapper mapper = new ObjectMapper();
            List<String> a = mapper.readValue(answersJSON, new TypeReference<List<String>>() {});
            List<String> c = mapper.readValue(correctJSON, new TypeReference<List<String>>() {});

            System.out.println("Question: " + q);
            System.out.println("Answers: " + a);
            System.out.println("Correct: " + c);
            System.out.println("isPersonal: " + p);

            Question question = new Question();
            question.setText(q);
            question.setPersonal(p);

            List<Answer> answers = new ArrayList<>();

            for (int i = 0; i < a.size(); i++) {
                System.out.println(i + " : " + a.get(i));
                boolean isCorrect = c.get(i).equals("true");

                Answer answer = new Answer();
                answer.setText(a.get(i));
                answer.setCorrect(isCorrect);
                answer.setQuestion(question);
                answers.add(answer);
            }

            Category category = categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new RuntimeException("Category not found"));

            question.setAnswers(answers);
            question.setCategory(category);
            questionRepository.save(question);

            return "q/a uploaded and data saved successfully";
        } catch (Exception e) {
            e.printStackTrace();
            return "Error processing file: " + e.getMessage();
        }
    }
}
