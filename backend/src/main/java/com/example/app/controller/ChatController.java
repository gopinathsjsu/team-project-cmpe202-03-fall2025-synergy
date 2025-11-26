package com.example.app.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.app.dto.ChatDTO;
import com.example.app.dto.StartMessageRequest;
import com.example.app.dto.startChatRequest;
import com.example.app.model.Chat;
import com.example.app.service.ChatService;
import com.example.app.util.JwtUtil;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/chat")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"})
public class ChatController {
    private final ChatService chatService;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }
    
    /**
     * Start a new chat or get existing chat
     * POST /api/chat/start
     * Body: { "product_id": 3, "buyer_id": 15, "seller_id": 12 }
     * 
     * For better security, we could extract buyer_id from JWT instead of trusting request
     */
    @PostMapping("/start")
    public ResponseEntity<?> start(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @Valid @RequestBody startChatRequest req) {
        try {
            // Optional: Override buyer_id with JWT user if provided
            Long buyerId = req.buyer_id();
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                String token = authHeader.substring(7);
                if (jwtUtil.validateToken(token)) {
                    Long jwtUserId = jwtUtil.extractUserId(token);
                    if (jwtUserId != null) {
                        // Use JWT user as buyer (more secure)
                        buyerId = jwtUserId;
                    }
                }
            }
            
            // Create modified request with JWT user ID
            startChatRequest secureReq = new startChatRequest(
                req.product_id(),
                buyerId,
                req.seller_id()
            );
            
            Chat chat = chatService.start(secureReq);
            // Return chat with names
            ChatDTO chatDTO = chatService.getChatWithNames(chat.getId());
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
    
    /**
     * Get all chats for the current user (from JWT)
     * GET /api/chat
     * Requires Authorization header with Bearer token
     */
    @GetMapping
    public ResponseEntity<?> listChats(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {
        try {
            // Extract user ID from JWT
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Missing or invalid Authorization header"));
            }
            
            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid or expired token"));
            }
            
            Long userId = jwtUtil.extractUserId(token);
            if (userId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "User ID not found in token"));
            }
            
            // Get chats with user names
            List<ChatDTO> chats = chatService.myConversationsWithNames(userId);
            return ResponseEntity.ok(chats);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to load chats: " + e.getMessage()));
        }
    }
}
