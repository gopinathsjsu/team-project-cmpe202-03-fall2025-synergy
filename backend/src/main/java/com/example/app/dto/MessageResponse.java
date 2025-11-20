package com.example.app.dto;

import java.util.List;

import com.example.app.model.Messages;

public record MessageResponse(
    Long chat_id,
    List<Messages> messages
) {
    
}
