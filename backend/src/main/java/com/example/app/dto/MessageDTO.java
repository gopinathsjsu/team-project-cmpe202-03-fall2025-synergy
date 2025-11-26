package com.example.app.dto;

import com.example.app.model.Messages;
import java.time.OffsetDateTime;

/**
 * DTO for message responses
 */
public class MessageDTO {
    
    private Long id;
    private Long chatId;
    private Long senderId;
    private Long recieverId; // Keep typo for backwards compatibility
    private String msg;
    private OffsetDateTime sentAt;
    
    // Constructors
    public MessageDTO() {}
    
    public MessageDTO(Long id, Long chatId, Long senderId, Long recieverId, String msg, OffsetDateTime sentAt) {
        this.id = id;
        this.chatId = chatId;
        this.senderId = senderId;
        this.recieverId = recieverId;
        this.msg = msg;
        this.sentAt = sentAt;
    }
    
    /**
     * Convert Messages entity to DTO
     */
    public static MessageDTO fromEntity(Messages message) {
        return new MessageDTO(
            message.getId(),
            message.getChatId(),
            message.getSenderId(),
            message.getRecieverId(),
            message.getMsg(),
            message.getSentAt()
        );
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Long getChatId() {
        return chatId;
    }
    
    public void setChatId(Long chatId) {
        this.chatId = chatId;
    }
    
    public Long getSenderId() {
        return senderId;
    }
    
    public void setSenderId(Long senderId) {
        this.senderId = senderId;
    }
    
    public Long getRecieverId() {
        return recieverId;
    }
    
    public void setRecieverId(Long recieverId) {
        this.recieverId = recieverId;
    }
    
    public String getMsg() {
        return msg;
    }
    
    public void setMsg(String msg) {
        this.msg = msg;
    }
    
    public OffsetDateTime getSentAt() {
        return sentAt;
    }
    
    public void setSentAt(OffsetDateTime sentAt) {
        this.sentAt = sentAt;
    }
}

