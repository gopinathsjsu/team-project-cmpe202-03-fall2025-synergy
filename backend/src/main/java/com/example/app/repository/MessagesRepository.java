package com.example.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.app.model.Messages;

public interface MessagesRepository extends JpaRepository<Messages, Long>{
    
    /**
     * Find all messages for a chat, ordered by sent time ascending (oldest first)
     */
    @Query("SELECT m FROM Messages m WHERE m.chatId = :chatId ORDER BY m.sent_at ASC")
    List<Messages> findByChatId(@Param("chatId") Long chatId);
    
    /**
     * Find all messages ordered by ID (simple version)
     */
    List<Messages> findByChatIdOrderByIdAsc(Long chatId);
}
