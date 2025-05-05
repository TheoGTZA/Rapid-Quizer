package com.tgza.rapidquizerspring.controllers;

import com.tgza.rapidquizerspring.Services.UserService;
import com.tgza.rapidquizerspring.entities.User;
import com.tgza.rapidquizerspring.enums.Role;
import com.tgza.rapidquizerspring.exceptions.EmailAlreadyUsedException;
import com.tgza.rapidquizerspring.exceptions.InvalidEmailFormatException;
import com.tgza.rapidquizerspring.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.ErrorResponse;
import org.springframework.web.bind.annotation.*;

import java.util.Set;

@RestController
@RequestMapping("/api")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    // Endpoint pour la connexion
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
        );
        SecurityContextHolder.getContext().setAuthentication(authentication);

        // Get user role from UserDetails
        User user = userService.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        String token = jwtUtil.generateToken(loginRequest.getEmail(), user.getRole().toString());
        return ResponseEntity.ok(token);
    }

    // Endpoint pour la création de compte
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest registerRequest) {
        try {
            User user = userService.registerUser(
                    registerRequest.getEmail(),
                    registerRequest.getPassword(),
                    Role.USER
            );
            return ResponseEntity.ok(user);
        } catch (EmailAlreadyUsedException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(null);
        } catch (InvalidEmailFormatException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }

    }

    // Endpoint pour définir un rôle
    @PostMapping("/admin/assign-role")
    public ResponseEntity<String> assignRole(@RequestBody RoleRequest roleRequest) {
        User user = userService.assignRole(roleRequest.getEmail(), roleRequest.getRole());
        return ResponseEntity.ok("Rôle attribué avec succès à " + user.getEmail());
    }

}