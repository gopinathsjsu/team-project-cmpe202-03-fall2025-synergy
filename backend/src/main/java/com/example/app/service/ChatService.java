package com.example.app.service;

import java.time.OffsetDateTime;

import org.springframework.stereotype.Service;

import com.example.app.dto.StartMessageRequest;
import com.example.app.dto.startChatRequest;
import com.example.app.model.Chat;
import com.example.app.model.Messages;
import com.example.app.repository.ChatRepository;
import com.example.app.repository.MessagesRepository;

@Service
public class ChatService {
    private final ChatRepository cr;
    private final MessagesRepository mr;

    public ChatService(ChatRepository cr, MessagesRepository mr) {
        this.cr = cr;
        this.mr = mr;
    }

    public Chat start(startChatRequest r){
        var buyer_id = r.buyer_id();
        var seller_id = r.seller_id();
        return cr.findByProductIdAndBuyerIdAndSellerTd(r.product_id(), buyer_id, seller_id)
            .orElseGet(() -> {
                var c = new Chat();
                c.setProductId(r.product_id());
                c.setBuyerId(buyer_id);
                c.setSellerId(seller_id);
                c.setCreatedAt(OffsetDateTime.now());
                c.setUpdatedAt(OffsetDateTime.now());
                return cr.save(c);
            });
    }

    public Messages send(StartMessageRequest r){
        var m = new Messages();
        m.setChatId(r.chat_id());
        m.setSenderId(r.sender_id());
        m.setRecieverId(r.reciever_id());
        m.setMsg(r.msg());
        return mr.save(m);
    }
}
