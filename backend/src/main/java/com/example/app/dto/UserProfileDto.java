package com.example.app.dto;

import com.example.app.model.UserStatus;

/**
 * DTO for user profile information - excludes password
 * Used for GET/PUT /api/users/me endpoints
 */
public class UserProfileDto {
    
    private Long id;
    private String username;
    private String email;
    private String firstName;
    private String lastName;
    private UserStatus status;
    
    // Constructors
    public UserProfileDto() {}
    
    public UserProfileDto(Long id, String username, String email, 
                         String firstName, String lastName, UserStatus status) {
        this.id = id;
        this.username = username;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
        this.status = status;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getUsername() {
        return username;
    }
    
    public void setUsername(String username) {
        this.username = username;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getFirstName() {
        return firstName;
    }
    
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }
    
    public String getLastName() {
        return lastName;
    }
    
    public void setLastName(String lastName) {
        this.lastName = lastName;
    }
    
    public UserStatus getStatus() {
        return status;
    }
    
    public void setStatus(UserStatus status) {
        this.status = status;
    }
}

