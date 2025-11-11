package com.example.app.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.app.model.Chat;

public interface ChatRepository extends JpaRepository<Chat, Long> {
    Optional<Chat> findByProductIdAndBuyerIdAndSellerTd(Long productId, Long buyerId, Long sellerId);
    List<Chat> findByBuyerIdOrSellerId(Long buyerId, Long sellerId);
}