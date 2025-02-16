package com.tgza.rapidquizerspring.controllers;

import com.tgza.rapidquizerspring.entities.Reponses;
import com.tgza.rapidquizerspring.services.ReponsesService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/reponses")
@RequiredArgsConstructor
public class ReponsesController {

    @Autowired
    private ReponsesService reponsesService;

    @GetMapping
    public List<Reponses> getAllReponses() {
        return reponsesService.getAllReponses();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Reponses> getReponseById(@PathVariable Long id) {
        Optional<Reponses> reponse = reponsesService.getReponseById(id);
        return reponse.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public Reponses createReponse(@RequestBody Reponses reponse) {
        return reponsesService.createReponse(reponse);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Reponses> updateReponse(@PathVariable Long id, @RequestBody Reponses reponseDetails) {
        Optional<Reponses> updatedReponse = reponsesService.updateReponse(id, reponseDetails);
        return updatedReponse.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteReponse(@PathVariable Long id) {
        boolean isDeleted = reponsesService.deleteReponse(id);
        return isDeleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
}
