package com.tasker.rush.controller.api;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

/**
 * Stands in for "data communications" — the kind of endpoint a front-end
 * would poll/fetch from after the page has loaded. Reachable only with a
 * valid "Authorization: Bearer <token>" header; unlike /dashboard, no
 * cookie/session is involved at all (see SecurityConfig.apiSecurityFilterChain).
 */
@RestController
@RequestMapping("/api")
public class ApiUserController {

    @GetMapping("/me")
    public Map<String, Object> me(@AuthenticationPrincipal UserDetails currentUser) {
        return Map.of(
                "username", currentUser.getUsername(),
                "authorities", currentUser.getAuthorities()
        );
    }
}
