package com.example.app.dto;

public class UserIdRequest {
    private Long user_id;

    public UserIdRequest() {}

    public UserIdRequest(Long user_id) { this.user_id = user_id; }

    public Long getUser_id() { return user_id; }
    public void setUser_id(Long user_id) { this.user_id = user_id; }
}
