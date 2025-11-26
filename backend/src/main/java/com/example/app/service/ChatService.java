package com.example.app.service;

import java.util.List;
import java.util.Optional;

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

  public Messages send(Long chatId, StartMessageRequest r){
    // var m = new Messages();
    // m.setChatId(r.chat_id());
    // m.setSenderId(r.sender_id());
    // m.setRecieverId(r.reciever_id()); // ensure Messages entity uses the same property names
    // m.setMsg(r.msg());
    return mr.insertMessage(
      chatId,
      r.sender_id(),
      r.reciever_id(),
      r.msg()
    );
  }

  @Transactional
  public MessageResponse sendAndFetchAll(Long chatId, StartMessageRequest r){
    final String sql = """
        with ins as (
                insert into messages (chat_id, sender_id, reciever_id, msg)
                values (:chatId, :senderId, :recieverId, :msg)
                returning chat_id
            )
            select m.* from messages m join ins on m.chat_id = ins.chat_id
            order by id
        """;
      @SuppressWarnings("unchecked")
      List<Messages> rows = em.createNativeQuery(sql, Messages.class)
      .setParameter("chatId", chatId)
      .setParameter("senderId", r.sender_id())
      .setParameter("recieverId", r.reciever_id())
      .setParameter("msg", r.msg())
      .getResultList();
      return new MessageResponse(chatId, rows);
  }

  public List<Messages> messages(Long conversationId) {
    if (conversationId == null) {
      throw new IllegalArgumentException("Chat ID cannot be null");
    }
    
    // Verify chat exists
    if (!cr.existsById(conversationId)) {
      throw new RuntimeException("Chat not found with id: " + conversationId);
    }
    
    // Return empty list if no messages (instead of null)
    List<Messages> messages = mr.findByChatId(conversationId);
    return messages != null ? messages : List.of();
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
