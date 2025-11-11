package com.example.app.dto;

import jakarta.validation.constraints.NotNull;

public record startChatRequest(
    @NotNull Long product_id,
    @NotNull Long buyer_id,
    @NotNull Long seller_id) {
}
