package com.example.app.controller;

import com.example.app.dto.*;
import com.example.app.model.User;
import com.example.app.model.UserStatus;
import com.example.app.model.Messages;
import com.example.app.service.UserService;
import com.example.app.service.ChatService;
import com.example.app.util.JwtUtil;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://localhost:5174"})
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private ChatService chatService;
    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        List<User> users = userService.getAllUsers();
        return ResponseEntity.ok(users);
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        User user = userService.getUserById(id);
        return ResponseEntity.ok(user);
    }

    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User user) {
        User createdUser = userService.createUser(user);
        return ResponseEntity.ok(createdUser);
    }

    @PostMapping("/{id}")
    public ResponseEntity<User> createUserId(@RequestBody User user) {
        User createdUser = userService.createUser(user);
        return ResponseEntity.ok(createdUser);
    }

    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User user) {
        User updatedUser = userService.updateUser(id, user);
        return ResponseEntity.ok(updatedUser);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/conversations")
    public ResponseEntity<?> getUserConversations(@RequestBody UserIdRequest req) {
        try {
            if (req == null || req.getUser_id() == null) {
                return ResponseEntity.badRequest()
                    .body(Map.of("error", "user_id is required"));
            }
            
            Long userId = req.getUser_id();
            User user = userService.getUserById(userId);
            
            // Get conversations with names
            List<ChatDTO> chatsWithNames = chatService.myConversationsWithNames(userId);
            
            // Build conversations with messages
            List<ConversationWithMessages> convs = chatsWithNames.stream()
                .map(chatDTO -> {
                    try {
                        List<Messages> messages = chatService.messages(chatDTO.id());
                        return new ConversationWithMessages(chatDTO, messages);
                    } catch (Exception e) {
                        // If messages fail to load, return conversation with empty messages
                        return new ConversationWithMessages(chatDTO, List.of());
                    }
                })
                .toList();
            
            return ResponseEntity.ok(new UserConversationsResponse(user, convs));
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Failed to load conversations: " + e.getMessage()));
        }
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<?> updateUserStatus(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String statusStr = request.get("status");
        if (statusStr == null || statusStr.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Status is required"));
        }
        try {
            UserStatus status = UserStatus.valueOf(statusStr.toUpperCase());
            User updatedUser = userService.updateUserStatus(id, status);
            return ResponseEntity.ok(updatedUser);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", "Invalid status. Must be ACTIVE or SUSPENDED"));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateUserStatusPut(@PathVariable Long id, @RequestBody Map<String, String> request) {
        // Alias for PATCH endpoint for compatibility
        return updateUserStatus(id, request);
    }
    
    @GetMapping("/count")
    public ResponseEntity<Map<String, Long>> getUserCount() {
        long totalCount = userService.getTotalUserCount();
        long activeCount = userService.getActiveUserCount();
        return ResponseEntity.ok(Map.of("total", totalCount, "active", activeCount));
    }
    
    @GetMapping("/ping")
    public ResponseEntity<String> ping() {
        return ResponseEntity.ok("UserController is alive!");
    }
    
    /**
     * Get current user profile
     * GET /api/users/me
     * Requires authentication via JWT token in Authorization header
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUserProfile(@RequestHeader("Authorization") String authHeader) {
        try {
            // Extract token from Authorization header
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Missing or invalid Authorization header"));
            }
            
            String token = authHeader.substring(7);
            
            // Validate token
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid or expired token"));
            }
            
            // Extract user ID from token
            Long userId = jwtUtil.extractUserId(token);
            
            // Fetch user from database
            User user = userService.getUserById(userId);
            
            // Convert to DTO (exclude password)
            UserProfileDto profile = new UserProfileDto(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getStatus()
            );
            
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to retrieve profile: " + e.getMessage()));
        }
    }
    
    /**
     * Update current user profile
     * PUT /api/users/me
     * Requires authentication via JWT token in Authorization header
     */
    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentUserProfile(
            @RequestHeader("Authorization") String authHeader,
            @Valid @RequestBody UpdateUserProfileRequest request) {
        try {
            // Extract token from Authorization header
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Missing or invalid Authorization header"));
            }
            
            String token = authHeader.substring(7);
            
            // Validate token
            if (!jwtUtil.validateToken(token)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("error", "Invalid or expired token"));
            }
            
            // Extract user ID from token
            Long userId = jwtUtil.extractUserId(token);
            
            // Fetch existing user from database
            User user = userService.getUserById(userId);
            
            // Update only the allowed fields
            user.setFirstName(request.getFirstName());
            user.setLastName(request.getLastName());
            
            // Only update email if provided and different
            if (request.getEmail() != null && !request.getEmail().equals(user.getEmail())) {
                // Check if new email is already taken by another user
                if (userService.existsByEmail(request.getEmail())) {
                    return ResponseEntity.badRequest()
                            .body(Map.of("error", "Email is already in use"));
                }
                user.setEmail(request.getEmail());
            }
            
            // Save updated user
            User updatedUser = userService.updateUser(userId, user);
            
            // Convert to DTO and return
            UserProfileDto profile = new UserProfileDto(
                updatedUser.getId(),
                updatedUser.getUsername(),
                updatedUser.getEmail(),
                updatedUser.getFirstName(),
                updatedUser.getLastName(),
                updatedUser.getStatus()
            );
            
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Failed to update profile: " + e.getMessage()));
        }
    }
}
