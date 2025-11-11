package com.example.app.dto;

import jakarta.validation.constraints.NotNull;

public record StartMessageRequest(
    @NotNull Long chat_id,
    @NotNull Long sender_id,
    @NotNull Long reciever_id,
    @NotNull String msg
) {
    
}
