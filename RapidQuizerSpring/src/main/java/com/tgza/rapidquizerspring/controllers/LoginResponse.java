package com.tgza.rapidquizerspring.controllers;

import com.tgza.rapidquizerspring.enums.Role;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
@Data
public class LoginResponse {
    private String token;
    private Long userId;
    private Role userRole;

    public LoginResponse(String token, Long userId, Role userRole) {
        this.token = token;
        this.userId = userId;
        this.userRole = userRole;
    }
}
