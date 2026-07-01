package com.tasker.rush.repository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {

    private final PasswordEncoder passwordEncoder;

    public HomeController(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    @GetMapping("/")
    public String home() {
        return "Welcome to the Tasker Rush API!";
    }

    @GetMapping("/login")
    public String login() {
        String password = passwordEncoder.encode("admin123");
        return "Welcome to the Tasker Rush API!: "+password;
    }
}
