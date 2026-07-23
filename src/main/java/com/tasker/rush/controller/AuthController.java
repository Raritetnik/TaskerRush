package com.tasker.rush.controller;

import com.tasker.rush.dto.RegisterForm;
import com.tasker.rush.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.oauth2.jwt.*;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
public class AuthController {


    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

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

    @GetMapping("/register")
    public String showRegisterPage(Model model) {
        if (!model.containsAttribute("registerForm")) {
            model.addAttribute(
                    "registerForm",
                    new RegisterForm()
            );
        }

        return "register";
    }

    @PostMapping("/register")
    public String register(@Valid RegisterForm registerForm, BindingResult bindingResult, Model model, RedirectAttributes redirectAttributes) {
        if (!registerForm.getPassword()
                .equals(registerForm.getConfirmPassword())) {

            bindingResult.rejectValue(
                    "confirmPassword",
                    "password.mismatch",
                    "Passwords do not match."
            );
        }

        if (userService.emailExists(registerForm.getEmail())) {
            bindingResult.rejectValue(
                    "email",
                    "email.exists",
                    "An account with this email already exists."
            );
        }

        if (bindingResult.hasErrors()) {
            return "register";
        }

        try {
            userService.createAccount(registerForm);

            redirectAttributes.addFlashAttribute(
                    "registrationSuccess",
                    "Your account was created. You can now sign in."
            );

            return "redirect:/login?registered=true";

        } catch (IllegalArgumentException exception) {
            model.addAttribute(
                    "registrationError",
                    exception.getMessage()
            );

            return "register";
        }
    }
}
