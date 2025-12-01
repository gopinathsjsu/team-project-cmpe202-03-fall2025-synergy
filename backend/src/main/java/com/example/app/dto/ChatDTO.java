package com.example.app.dto;

import java.time.OffsetDateTime;

public record ChatDTO(
    Long id,
    Long productId,
    Long buyerId,
    String buyerName,
    Long sellerId,
    String sellerName,
    String productName,
    OffsetDateTime createdAt,
    OffsetDateTime updatedAt
) {
    public static ChatDTO fromChat(com.example.app.model.Chat chat, String buyerName, String sellerName, String productName) {
        return new ChatDTO(
            chat.getId(),
            chat.getProductId(),
            chat.getBuyerId(),
            buyerName,
            chat.getSellerId(),
            sellerName,
            productName,
            chat.getCreatedAt(),
            chat.getUpdatedAt()
        );
    }
}

