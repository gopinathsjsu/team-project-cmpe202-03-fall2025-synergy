package com.example.app.service;

import java.util.List;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.app.dto.ChatDTO;
import com.example.app.dto.MessageResponse;
import com.example.app.dto.StartMessageRequest;
import com.example.app.dto.startChatRequest;
import com.example.app.model.Chat;
import com.example.app.model.Messages;
import com.example.app.model.User;
import com.example.app.repository.ChatRepository;
import com.example.app.repository.MessagesRepository;
import com.example.app.repository.UserRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

@Service
public class ChatService {
  
  private static final Logger logger = LoggerFactory.getLogger(ChatService.class);
  
  @PersistenceContext
  private EntityManager em;
  private final ChatRepository cr;
  private final MessagesRepository mr;
  @Autowired
  private UserRepository userRepository;

  public ChatService(ChatRepository cr, MessagesRepository mr) {
    this.cr = cr;
    this.mr = mr;
  }

  public Chat start(startChatRequest r) {
    if (r == null) {
      throw new IllegalArgumentException("Request cannot be null");
    }
    
    var buyerId = r.buyer_id();
    var sellerId = r.seller_id();
    var productId = r.product_id();

    if (buyerId == null || sellerId == null || productId == null) {
      throw new IllegalArgumentException("buyer_id, seller_id, and product_id are required");
    }

    // Validate users exist
    Optional<User> buyer = userRepository.findById(buyerId);
    Optional<User> seller = userRepository.findById(sellerId);
    
    if (buyer.isEmpty()) {
      throw new RuntimeException("Buyer not found with id: " + buyerId);
    }
    if (seller.isEmpty()) {
      throw new RuntimeException("Seller not found with id: " + sellerId);
    }

    return cr.findByProductIdAndBuyerIdAndSellerId(productId, buyerId, sellerId)
      .orElseGet(() -> {
        var c = new Chat();
        c.setProductId(productId);
        c.setBuyerId(buyerId);
        c.setSellerId(sellerId);
        // timestamps are set by @PrePersist
        return cr.save(c);
      });
  }
  
  /**
   * Get chat with user names populated
   */
  public ChatDTO getChatWithNames(Long chatId) {
    Chat chat = cr.findById(chatId)
      .orElseThrow(() -> new RuntimeException("Chat not found with id: " + chatId));
    
    User buyer = userRepository.findById(chat.getBuyerId())
      .orElseThrow(() -> new RuntimeException("Buyer not found"));
    User seller = userRepository.findById(chat.getSellerId())
      .orElseThrow(() -> new RuntimeException("Seller not found"));
    
    String buyerName = formatUserName(buyer);
    String sellerName = formatUserName(seller);
    
    return ChatDTO.fromChat(chat, buyerName, sellerName);
  }
  
  private String formatUserName(User user) {
    if (user.getFirstName() != null && user.getLastName() != null) {
      return user.getFirstName() + " " + user.getLastName();
    } else if (user.getFirstName() != null) {
      return user.getFirstName();
    } else if (user.getUsername() != null) {
      return user.getUsername();
    }
    return "User " + user.getId();
  }

  /**
   * Send a message and return it
   */
  @Transactional
  public Messages send(Long chatId, StartMessageRequest r){
    logger.info("Sending message in chat {}: sender={}, receiver={}", 
                chatId, r.sender_id(), r.reciever_id());
    
    try {
      // Verify chat exists
      Chat chat = cr.findById(chatId)
        .orElseThrow(() -> new RuntimeException("Chat not found with id: " + chatId));
      
      logger.info("Chat found: buyer={}, seller={}", chat.getBuyerId(), chat.getSellerId());
      
      // Create new message
      Messages message = new Messages();
      message.setChatId(chatId);
      message.setSenderId(r.sender_id());
      message.setRecieverId(r.reciever_id());
      message.setMsg(r.msg());
      
      // Save message
      Messages savedMessage = mr.save(message);
      logger.info("Message saved with ID: {}", savedMessage.getId());
      
      // Update chat's updated_at timestamp
      chat.setUpdatedAt(java.time.OffsetDateTime.now());
      cr.save(chat);
      
      return savedMessage;
    } catch (Exception e) {
      logger.error("Error sending message in chat {}: {}", chatId, e.getMessage(), e);
      throw e;
    }
  }

  /**
   * Send a message and return all messages in the chat
   */
  @Transactional
  public MessageResponse sendAndFetchAll(Long chatId, StartMessageRequest r){
    logger.info("Send and fetch all for chat {}", chatId);
    
    try {
      // Send the message
      send(chatId, r);
      
      // Fetch all messages for this chat
      List<Messages> allMessages = messages(chatId);
      
      logger.info("Returning {} messages for chat {}", allMessages.size(), chatId);
      return new MessageResponse(chatId, allMessages);
    } catch (Exception e) {
      logger.error("Error in sendAndFetchAll for chat {}: {}", chatId, e.getMessage(), e);
      throw e;
    }
  }

  /**
   * Get all messages for a chat, ordered by time
   */
  public List<Messages> messages(Long conversationId) {
    logger.info("Fetching messages for chat ID: {}", conversationId);
    
    if (conversationId == null) {
      logger.error("Chat ID is null");
      throw new IllegalArgumentException("Chat ID cannot be null");
    }
    
    try {
      // Verify chat exists
      boolean chatExists = cr.existsById(conversationId);
      logger.info("Chat {} exists: {}", conversationId, chatExists);
      
      if (!chatExists) {
        logger.warn("Chat not found with id: {}", conversationId);
        throw new RuntimeException("Chat not found with id: " + conversationId);
      }
      
      // Fetch messages
      List<Messages> messages = mr.findByChatId(conversationId);
      logger.info("Found {} messages for chat {}", messages != null ? messages.size() : 0, conversationId);
      
      // Return empty list if no messages (instead of null)
      return messages != null ? messages : List.of();
      
    } catch (Exception e) {
      logger.error("Error fetching messages for chat {}: {}", conversationId, e.getMessage(), e);
      throw e;
    }
  }

  public List<Chat> myConversations(Long userId) {
    if (userId == null) {
      throw new IllegalArgumentException("User ID cannot be null");
    }
    return cr.findByBuyerIdOrSellerId(userId, userId);
  }
  
  /**
   * Get conversations with user names for a user
   */
  public List<ChatDTO> myConversationsWithNames(Long userId) {
    List<Chat> chats = myConversations(userId);
    return chats.stream()
      .map(chat -> {
        try {
          User buyer = userRepository.findById(chat.getBuyerId())
            .orElse(null);
          User seller = userRepository.findById(chat.getSellerId())
            .orElse(null);
          
          String buyerName = buyer != null ? formatUserName(buyer) : "Unknown";
          String sellerName = seller != null ? formatUserName(seller) : "Unknown";
          
          return ChatDTO.fromChat(chat, buyerName, sellerName);
        } catch (Exception e) {
          // Fallback if user lookup fails
          return ChatDTO.fromChat(chat, "User " + chat.getBuyerId(), "User " + chat.getSellerId());
        }
      })
      .toList();
  }
}
