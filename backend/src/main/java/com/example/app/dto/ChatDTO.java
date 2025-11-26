package com.example.app.dto;

import java.time.OffsetDateTime;

public record ChatDTO(
    Long id,
    Long productId,
    Long buyerId,
    String buyerName,
    Long sellerId,
    String sellerName,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {
    public static ChatDTO fromChat(com.example.app.model.Chat chat, String buyerName, String sellerName) {
        return new ChatDTO(
            chat.getId(),
            chat.getProductId(),
            chat.getBuyerId(),
            buyerName,
            chat.getSellerId(),
            sellerName,
            chat.getCreatedAt(),
            chat.getUpdatedAt()
        );
    }
}

