package com.tgza.rapidquizerspring.controllers;

import com.tgza.rapidquizerspring.enums.Role;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RoleRequest {
    private String email;
    private Role role;
}