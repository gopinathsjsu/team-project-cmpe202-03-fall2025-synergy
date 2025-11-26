package com.example.app.dto;

import java.util.List;
import com.example.app.model.Messages;

public class ConversationWithMessages {
    private ChatDTO chat;
    private List<Messages> messages;

    public ConversationWithMessages() {}

    public ConversationWithMessages(ChatDTO chat, List<Messages> messages) {
        this.chat = chat;
        this.messages = messages;
    }

    public ChatDTO getChat() { return chat; }
    public void setChat(ChatDTO chat) { this.chat = chat; }

    public List<Messages> getMessages() { return messages; }
    public void setMessages(List<Messages> messages) { this.messages = messages; }
}
