package com.example.app.controller;

import java.util.List;
import java.util.Map;

import org.hibernate.query.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<?> send(@PathVariable Long chatId, @RequestBody @Valid StartMessageRequest req) {
        try {
            if (chatId == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Chat ID is required"));
            }
            MessageResponse response = chatService.sendAndFetchAll(chatId, req);
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to send message: " + e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> listMessages(@PathVariable Long chatId) {
        try {
            if (chatId == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Chat ID is required"));
            }
            List<Messages> messages = chatService.messages(chatId);
            // Always return 200 with empty list if no messages
            return ResponseEntity.ok(messages != null ? messages : List.of());
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to load messages: " + e.getMessage()));
        }
    }
}
