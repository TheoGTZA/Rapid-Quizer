package com.tgza.rapidquizerspring.Services;

import com.tgza.rapidquizerspring.entities.User;
import com.tgza.rapidquizerspring.enums.Role;
import com.tgza.rapidquizerspring.exceptions.EmailAlreadyUsedException;
import com.tgza.rapidquizerspring.exceptions.InvalidEmailFormatException;
import com.tgza.rapidquizerspring.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;


import java.util.HashSet;
import java.util.Optional;
import java.util.Set;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public User registerUser(String email, String password, Role role) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new EmailAlreadyUsedException("Cet email est déjà utilisé.");
        }

        // Vérification de l'email
        if (!email.matches("^[\\w.%+-]+@[\\w.-]+\\.[a-zA-Z]{2,6}$")) {
            throw new InvalidEmailFormatException("L'email fourni n'est pas valide : " + email);
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(role);
        return userRepository.save(user);
    }

    public User assignRole(String email, Role role) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Utilisateur non trouvé : " + email));
        user.setRole(role);
        return userRepository.save(user);
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Set<User> getAllUsers() {
        return new HashSet<>(userRepository.findAll());
    }
}
