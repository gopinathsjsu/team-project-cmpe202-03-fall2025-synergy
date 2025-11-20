package com.example.app.dto;

import java.util.List;
import com.example.app.model.Chat;
import com.example.app.model.Messages;

public class ConversationWithMessages {
    private Chat chat;
    private List<Messages> messages;

    public ConversationWithMessages() {}

    public ConversationWithMessages(Chat chat, List<Messages> messages) {
        this.chat = chat;
        this.messages = messages;
    }

    public Chat getChat() { return chat; }
    public void setChat(Chat chat) { this.chat = chat; }

    public List<Messages> getMessages() { return messages; }
    public void setMessages(List<Messages> messages) { this.messages = messages; }
}
