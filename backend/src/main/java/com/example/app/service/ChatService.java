package com.example.app.service;

import java.util.List;

import org.hibernate.sql.ast.tree.expression.Star;
import org.springframework.stereotype.Service;

import com.example.app.dto.MessageResponse;
import com.example.app.dto.StartMessageRequest;
import com.example.app.dto.startChatRequest;
import com.example.app.model.Chat;
import com.example.app.model.Messages;
import com.example.app.repository.ChatRepository;
import com.example.app.repository.MessagesRepository;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.transaction.Transactional;

@Service
public class ChatService {
  @PersistenceContext
  private EntityManager em;
  private final ChatRepository cr;
  private final MessagesRepository mr;

  public ChatService(ChatRepository cr, MessagesRepository mr) {
    this.cr = cr;
    this.mr = mr;
  }

  public Chat start(startChatRequest r) {
    var buyerId  = r.buyer_id();
    var sellerId = r.seller_id();
    var productId = r.product_id();

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
    return mr.findByChatId(conversationId);
  }

  public List<Chat> myConversations(Long userId) {
    return cr.findByBuyerIdOrSellerId(userId, userId);
  }
}
