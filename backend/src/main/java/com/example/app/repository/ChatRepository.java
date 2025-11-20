package com.example.app.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.app.model.Chat;

public interface ChatRepository extends JpaRepository<Chat, Long> {
  Optional<Chat> findByProductIdAndBuyerIdAndSellerId(Long productId, Long buyerId, Long sellerId);

  List<Chat> findByBuyerIdOrSellerId(Long buyerId, Long sellerId);

  @Modifying
  @Query(value = """
            insert into chats (product_id, seller_id, buyer_id) values (:productId, :sellerId, :buyerId) on conflict (product_id, seller_id, buyer_id) do nothing returning id;  
          """, nativeQuery = true)
          int insertChat(Long productId, Long sellerId, Long buyerId);
}
