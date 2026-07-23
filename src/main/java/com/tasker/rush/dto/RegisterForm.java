package com.tasker.rush.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

public class RegisterForm {

    @Setter
    @Getter
    @NotBlank(message = "Name is required.")
    @Size(max = 100, message = "Name cannot exceed 100 characters.")
    private String full_name;

    @Setter
    @Getter
    @NotBlank(message = "Username is required.")
    @Size(max = 100, message = "Username cannot exceed 100 characters.")
    private String username;


    @Setter
    @Getter
    @NotBlank(message = "Email is required.")
    @Email(message = "Enter a valid email address.")
    @Size(max = 150, message = "Email cannot exceed 150 characters.")
    private String email;

    @Setter
    @Getter
    @NotBlank(message = "Password is required.")
    @Size(
            min = 8,
            max = 72,
            message = "Password must contain between 8 and 72 characters."
    )
    private String password;

    @Setter
    @Getter
    @NotBlank(message = "Please confirm your password.")
    private String confirmPassword;

}
