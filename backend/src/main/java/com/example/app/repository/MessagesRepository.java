package com.example.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.app.model.Messages;

public interface MessagesRepository extends JpaRepository<Messages, Long>{
    List<Messages> findByChatId(Long chatId);
}
