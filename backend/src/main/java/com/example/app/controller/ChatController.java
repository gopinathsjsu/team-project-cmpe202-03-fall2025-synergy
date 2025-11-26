package com.example.app.controller;

import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.app.dto.StartMessageRequest;
import com.example.app.dto.startChatRequest;
import com.example.app.model.Chat;
import com.example.app.model.Messages;
import com.example.app.service.ChatService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/chat")
public class ChatController {
    private final ChatService chatService;
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }
    
    @PostMapping("/start")
    public ResponseEntity<?> start(@Valid @RequestBody startChatRequest req) {
        try {
            Chat chat = chatService.start(req);
            // Return chat with names
            com.example.app.dto.ChatDTO chatDTO = chatService.getChatWithNames(chat.getId());
            return ResponseEntity.ok(chatDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to start chat: " + e.getMessage()));
        }
    }

  /** Mark messages addressed to me as read (optional) */
//   @PostMapping("/conversations/{conversationId}/read")
//   public void markRead(@PathVariable Long conversationId, @RequestParam Long userId) {
//     chatService.markAsRead(conversationId, userId);
//   }
}
