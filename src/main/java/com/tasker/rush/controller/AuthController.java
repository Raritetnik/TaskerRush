package com.tasker.rush.controller;

import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
public class AuthController {

    // GET /login just renders the form. The actual POST /login submission
    // is intercepted and handled entirely by Spring Security's formLogin
    // filter (see SecurityConfig) — no controller code needed for that part.
    @GetMapping("/login")
    public String loginPage(
            @RequestParam(value = "error", required = false) String error,
            @RequestParam(value = "logout", required = false) String logout,
            @RequestParam(value = "expired", required = false) String expired,
            Model model) {

        if (error != null) {
            model.addAttribute("errorMessage", "Invalid username or password.");
        }
        if (logout != null) {
            model.addAttribute("infoMessage", "You have been logged out.");
        }
        if (expired != null) {
            model.addAttribute("infoMessage", "Your session expired. Please log in again.");
        }
        return "login";
    }
}
