package com.tasker.rush.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Arrays;

import com.tasker.rush.service.UserService;

@Component
public class JwtCookieAuthenticationFilter extends AbstractJwtAuthenticationFilter {

    public JwtCookieAuthenticationFilter(JwtService jwtService, UserService userService) {
        super(jwtService, userService);
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                    @NonNull HttpServletResponse response,
                                    @NonNull FilterChain filterChain) throws ServletException, IOException {

        Cookie[] cookies = request.getCookies();
        if (cookies == null) {
            filterChain.doFilter(request, response);
            return;
        }

        Arrays.stream(cookies)
                .filter(c -> "JWT_TOKEN".equals(c.getName()))
                .findFirst()
                .ifPresent(cookie -> authenticateFromToken(cookie.getValue(), request));

        filterChain.doFilter(request, response);
    }
}