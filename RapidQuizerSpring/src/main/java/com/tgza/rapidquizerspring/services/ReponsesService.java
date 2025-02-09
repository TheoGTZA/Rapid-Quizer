package com.tgza.rapidquizerspring.services;

import com.tgza.rapidquizerspring.entities.Reponses;
import com.tgza.rapidquizerspring.repositories.ReponsesRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ReponsesService {

    @Autowired
    private ReponsesRepository reponsesRepository;

    public List<Reponses> getAllReponses() {
        return reponsesRepository.findAll();
    }

    public Optional<Reponses> getReponseById(Long id) {
        return reponsesRepository.findById(id);
    }

    public Reponses createReponse(Reponses reponse) {
        return reponsesRepository.save(reponse);
    }

    public Optional<Reponses> updateReponse(Long id, Reponses reponseDetails) {
        return reponsesRepository.findById(id).map(reponse -> {
            reponse.setContenu(reponseDetails.getContenu());
            reponse.setQuestion(reponseDetails.getQuestion());
            return reponsesRepository.save(reponse);
        });
    }

    public boolean deleteReponse(Long id) {
        return reponsesRepository.findById(id).map(reponse -> {
            reponsesRepository.delete(reponse);
            return true;
        }).orElse(false);
    }
}
