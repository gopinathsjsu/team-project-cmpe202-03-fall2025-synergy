package com.example.app.controller;

import java.util.List;
import java.util.UUID;

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
  public Chat start(@Valid @RequestBody startChatRequest req) {
    return chatService.start(req);
  }

  /** Mark messages addressed to me as read (optional) */
//   @PostMapping("/conversations/{conversationId}/read")
//   public void markRead(@PathVariable Long conversationId, @RequestParam Long userId) {
//     chatService.markAsRead(conversationId, userId);
//   }
}
