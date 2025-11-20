package com.example.app.controller;

import com.example.app.model.User;
import com.example.app.model.UserStatus;
import com.example.app.service.UserService;
import com.example.app.service.ChatService;
import com.example.app.dto.UserIdRequest;
import com.example.app.dto.UserConversationsResponse;
import com.example.app.dto.ConversationWithMessages;
import com.example.app.model.Chat;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173"})
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private ChatService chatService;

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
    public ResponseEntity<UserConversationsResponse> getUserConversations(@RequestBody UserIdRequest req) {
        Long userId = req.getUser_id();
        User user = userService.getUserById(userId);
        List<Chat> chats = chatService.myConversations(userId);
        List<ConversationWithMessages> convs = chats.stream()
                .map(c -> new ConversationWithMessages(c, chatService.messages(c.getId())))
                .toList();
        return ResponseEntity.ok(new UserConversationsResponse(user, convs));
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
}
