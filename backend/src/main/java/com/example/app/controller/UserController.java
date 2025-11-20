package com.example.app.controller;

import com.example.app.model.User;
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

@RestController
@RequestMapping("/users")
@CrossOrigin(origins = "http://localhost:3000")
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
}
