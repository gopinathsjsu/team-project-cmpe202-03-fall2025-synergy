package com.example.app.dto;

import com.fasterxml.jackson.annotation.JsonAlias;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

/**
 * Simplified request for sending a message.
 * Client only needs to send receiver ID and message content.
 * Sender ID is derived from the authenticated user.
 */
public class SendMessageRequest {

    @JsonAlias({"receiver_id", "reciever_id"})
    @NotNull(message = "Receiver ID is required")
    private Long receiverId;

    @NotBlank(message = "Message content cannot be empty")
    private String msg;

    // Constructors
    public SendMessageRequest() {}

    public SendMessageRequest(Long receiverId, String msg) {
        this.receiverId = receiverId;
        this.msg = msg;
    }

    public Long getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(Long receiverId) {
        this.receiverId = receiverId;
    }

    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }
}

