package com.example.app.controller;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import com.example.app.dto.MessageDTO;
import com.example.app.dto.MessageResponse;
import com.example.app.dto.SendMessageRequest;
import com.example.app.dto.StartMessageRequest;
import com.example.app.model.Chat;
import com.example.app.model.Messages;
import com.example.app.model.User;
import com.example.app.repository.ChatRepository;
import com.example.app.repository.UserRepository;
import com.example.app.service.ChatService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/chat")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"})
public class MessageController {
    
    private static final Logger logger = LoggerFactory.getLogger(MessageController.class);
    
    private final ChatService chatService;
    private final ChatRepository chatRepository;
    private final UserRepository userRepository;

    @Autowired
    public MessageController(ChatService chatService, ChatRepository chatRepository, UserRepository userRepository) {
        this.chatService = chatService;
        this.chatRepository = chatRepository;
        this.userRepository = userRepository;
    }

    /**
     * Send a message in a chat
     * POST /api/chat/{chatId}/message
     * Body: { "receiver_id": 2, "msg": "Hello" }
     * 
     * Sender ID is extracted from JWT for security
     */
    @PostMapping("/{chatId}/message")
    public ResponseEntity<?> send(
            @PathVariable Long chatId,
            @Valid @RequestBody SendMessageRequest request,
            Authentication authentication) {
        
        logger.info("POST /api/chat/{}/message", chatId);
        
        try {
            if (chatId == null) {
                logger.warn("Chat ID is null");
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Chat ID is required"));
            }

            Long senderId = resolveCurrentUserId(authentication);
            if (senderId == null) {
                logger.warn("Unable to resolve sender from authentication");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required - please login"));
            }

            if (request.getReceiverId() == null) {
                logger.warn("Receiver ID is missing");
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "receiver_id is required"));
            }

            // Verify chat exists and user belongs to it
            Chat chat = chatRepository.findById(chatId).orElse(null);
            if (chat == null) {
                logger.warn("Chat not found: {}", chatId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Chat not found"));
            }
            
            if (!isParticipant(senderId, chat)) {
                logger.warn("User {} not authorized for chat {}", senderId, chatId);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You are not authorized to send messages in this chat"));
            }

            if (!isParticipant(request.getReceiverId(), chat)) {
                logger.warn("Receiver {} is not part of chat {}", request.getReceiverId(), chatId);
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Receiver must be part of this chat"));
            }

            // Create and send message
            StartMessageRequest messageRequest = new StartMessageRequest(
                chatId,
                senderId,
                request.getReceiverId(),
                request.getMsg()
            );
            
            MessageResponse response = chatService.sendAndFetchAll(chatId, messageRequest);
            logger.info("Message sent successfully in chat {}", chatId);
            
            return ResponseEntity.ok(response);
            
        } catch (IllegalArgumentException e) {
            logger.error("Validation error: {}", e.getMessage());
            return ResponseEntity.badRequest()
                .body(Map.of("error", e.getMessage()));
        } catch (RuntimeException e) {
            logger.error("Runtime error: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error sending message: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to send message: " + e.getMessage()));
        }
    }

    /**
     * Get all messages for a chat
     * GET /api/chat/{chatId}/message
     * Requires Authorization header - user must be part of the chat
     */
    @GetMapping("/{chatId}/message")
    public ResponseEntity<?> listMessages(
            @PathVariable Long chatId,
            Authentication authentication) {
        
        logger.info("GET /api/chat/{}/message", chatId);
        
        try {
            if (chatId == null) {
                logger.warn("Chat ID is null");
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "Chat ID is required"));
            }
            
            Long userId = resolveCurrentUserId(authentication);
            if (userId == null) {
                logger.warn("Unauthenticated access to chat {}", chatId);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Authentication required - please login"));
            }

            // Verify chat exists first
            Chat chat = chatRepository.findById(chatId).orElse(null);
            if (chat == null) {
                logger.warn("Chat not found: {}", chatId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Chat not found"));
            }
            
            if (!isParticipant(userId, chat)) {
                logger.warn("User {} not authorized to view chat {}", userId, chatId);
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("error", "You are not authorized to view this chat"));
            }
            
            // Fetch messages
            List<Messages> messages = chatService.messages(chatId);
            logger.info("Found {} messages for chat {}", messages.size(), chatId);
            
            // Convert to DTOs
            List<MessageDTO> messageDTOs = messages.stream()
                .map(MessageDTO::fromEntity)
                .collect(Collectors.toList());
            
            // Always return 200 with empty list if no messages
            return ResponseEntity.ok(messageDTOs);
            
        } catch (RuntimeException e) {
            logger.error("Runtime error fetching messages: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            logger.error("Unexpected error fetching messages: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to load messages: " + e.getMessage()));
        }
    }

    private Long resolveCurrentUserId(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return null;
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof UserDetails userDetails) {
            return userRepository.findByUsername(userDetails.getUsername())
                    .map(User::getId)
                    .orElse(null);
        }

        if (principal instanceof User user) {
            return user.getId();
        }

        return null;
    }

    private boolean isParticipant(Long userId, Chat chat) {
        if (userId == null || chat == null) {
            return false;
        }
        return userId.equals(chat.getBuyerId()) || userId.equals(chat.getSellerId());
    }
}
