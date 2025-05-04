package com.tgza.rapidquizerspring.repositories;

import com.tgza.rapidquizerspring.entities.User;
import com.tgza.rapidquizerspring.enums.Role;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    List<User> findByRolesContaining(Role role);

    Optional<User> findByEmail(String email);
}