package com.tasker.rush.dto;

public class LoginResponse {

    private final String token;
    private final String tokenType = "Bearer";
    private final String username;
    private final long expiresInSeconds;

    public LoginResponse(String token, String username, long expiresInSeconds) {
        this.token = token;
        this.username = username;
        this.expiresInSeconds = expiresInSeconds;
    }

    public String getToken() {
        return token;
    }

    public String getTokenType() {
        return tokenType;
    }

    public String getUsername() {
        return username;
    }

    public long getExpiresInSeconds() {
        return expiresInSeconds;
    }
}
