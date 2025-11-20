package com.example.app.dto;

import java.util.List;
import com.example.app.model.User;

public class UserConversationsResponse {
    private User user;
    private List<ConversationWithMessages> conversations;

    public UserConversationsResponse() {}

    public UserConversationsResponse(User user, List<ConversationWithMessages> conversations) {
        this.user = user;
        this.conversations = conversations;
    }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public List<ConversationWithMessages> getConversations() { return conversations; }
    public void setConversations(List<ConversationWithMessages> conversations) { this.conversations = conversations; }
}
