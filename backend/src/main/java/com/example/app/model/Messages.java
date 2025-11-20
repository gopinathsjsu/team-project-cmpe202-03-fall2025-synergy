package com.example.app.model;

import java.time.OffsetDateTime;

import jakarta.persistence.*;

@Entity
@Table(
    name = "messages"
)
public class Messages {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long Id;

    @Column(name = "chat_id", nullable = false)
    private long chatId;

    @Column(name= "sender_id", nullable = false)
    private long senderId;

    @Column(name="reciever_id", nullable = false)
    private long recieverId;

    @Column(name = "msg", nullable = false)
    private String msg;

    @Column(name = "sent_at", nullable = false)
    private OffsetDateTime sent_at = OffsetDateTime.now();

    @Column(name = "updated_at")
    private OffsetDateTime updated_at = OffsetDateTime.now();

    // Getters and Setters
    public Long getId() {
        return Id;
    }
    public void setId(Long id) {
        Id = id;
    }
    public long getChatId() {
        return chatId;
    }
    public void setChatId(long chatId) {
        this.chatId = chatId;
    }
    public long getSenderId() {
        return senderId;
    }
    public void setSenderId(long senderId) {
        this.senderId = senderId;
    }
    public long getRecieverId() {
        return recieverId;
    }
    public void setRecieverId(long recieverId) {
        this.recieverId = recieverId;
    }
    public String getMsg() {
        return msg;
    }
    public void setMsg(String msg) {
        this.msg = msg;
    }
    public OffsetDateTime getSentAt() {
        return sent_at;
    }

}
