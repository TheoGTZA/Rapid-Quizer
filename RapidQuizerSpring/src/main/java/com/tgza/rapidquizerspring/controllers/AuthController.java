package com.tgza.rapidquizerspring.controllers;

import com.tgza.rapidquizerspring.Services.UserService;
import com.tgza.rapidquizerspring.entities.User;
import com.tgza.rapidquizerspring.enums.Role;
import com.tgza.rapidquizerspring.utils.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
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

        String token = jwtUtil.generateToken(loginRequest.getEmail());
        return ResponseEntity.ok(token);
    }

    // Endpoint pour la création de compte
    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterRequest registerRequest) {
        User user = userService.registerUser(
                registerRequest.getEmail(),
                registerRequest.getPassword(),
                Set.of(Role.USER)
        );
        return ResponseEntity.ok(user);
    }

    // Endpoint pour définir un rôle
    @PostMapping("/admin/assign-role")
    public ResponseEntity<String> assignRole(@RequestBody RoleRequest roleRequest) {
        User user = userService.assignRole(roleRequest.getEmail(), roleRequest.getRole());
        return ResponseEntity.ok("Rôle attribué avec succès à " + user.getEmail());
    }

}