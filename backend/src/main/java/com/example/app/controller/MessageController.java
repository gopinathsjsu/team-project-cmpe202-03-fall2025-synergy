package com.example.app.controller;

import java.util.List;

import org.hibernate.query.Page;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.app.dto.MessageResponse;
import com.example.app.dto.StartMessageRequest;
import com.example.app.model.Messages;
import com.example.app.service.ChatService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/chat/{chatId}/message")
public class MessageController {
    private final ChatService chatService;

    public MessageController(ChatService chatService) {
        this.chatService = chatService;
    }

    @PostMapping
    public MessageResponse send(@PathVariable Long chatId, @RequestBody @Valid StartMessageRequest req) {
        return chatService.sendAndFetchAll(chatId, req);
    }

    @GetMapping
    public List<Messages> listMessages(@PathVariable Long chatId){
        return chatService.messages(chatId);
    }
}
