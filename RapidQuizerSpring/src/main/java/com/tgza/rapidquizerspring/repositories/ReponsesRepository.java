package com.tgza.rapidquizerspring.repositories;

import com.tgza.rapidquizerspring.entities.Reponses;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ReponsesRepository extends JpaRepository<Reponses, Long> {
}
