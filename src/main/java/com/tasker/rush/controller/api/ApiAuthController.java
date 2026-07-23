package com.tasker.rush.controller.api;

import com.tasker.rush.dto.LoginRequest;
import com.tasker.rush.dto.LoginResponse;
import com.tasker.rush.security.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * The JWT counterpart to the session-based /login used by pages.
 *
 * Any front-end that talks to this app as an API — a JS SPA, a mobile app,
 * another backend service — calls this instead of submitting the HTML form.
 * Credentials are checked exactly the same way as the web login (same
 * AuthenticationManager, same CustomUserDetailsService, same users table
 * and password hashes) — only what happens on success differs: no session
 * is created, a signed JWT is returned in the response body instead.
 */
@RestController
@RequestMapping("/api/auth")
public class ApiAuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public ApiAuthController(AuthenticationManager authenticationManager, JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request, HttpServletResponse response) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsername(), request.getPassword())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String token = jwtService.generateToken(userDetails);
            long expiresInSeconds = jwtService.getExpirationMinutes() * 60;

            // Server-side gate for page routes (e.g. /dashboard)
            ResponseCookie cookie = ResponseCookie.from("JWT_TOKEN", token)
                    .httpOnly(true)
                    .secure(true)          // requires HTTPS — see note below for local dev
                    .path("/")
                    .maxAge(expiresInSeconds)
                    .sameSite("Strict")
                    .build();
            response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

            return ResponseEntity.ok(new LoginResponse(token, userDetails.getUsername(), expiresInSeconds));

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(Map.of("error", "Invalid username or password"));
        } catch (DisabledException e) {
            return ResponseEntity.status(403).body(Map.of("error", "Account is disabled"));
        }
    }
}
