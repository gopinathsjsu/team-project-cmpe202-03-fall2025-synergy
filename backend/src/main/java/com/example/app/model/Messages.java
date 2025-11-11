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
    private long chat_id;

    @Column(name= "sender_id", nullable = false)
    private long sender_id;

    @Column(name="reciever_id", nullable = false)
    private long reciever_id;

    @Column(name = "msg", nullable = false)
    private String msg;

    @Column(name = "send_at", nullable = false)
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
        return chat_id;
    }
    public void setChatId(long chatId) {
        this.chat_id = chatId;
    }
    public long getSenderId() {
        return sender_id;
    }
    public void setSenderId(long senderId) {
        this.sender_id = senderId;
    }
    public long getRecieverId() {
        return reciever_id;
    }
    public void setRecieverId(long recieverId) {
        this.reciever_id = recieverId;
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
