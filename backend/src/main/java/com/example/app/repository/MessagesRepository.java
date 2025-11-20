package com.example.app.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import com.example.app.model.Messages;

public interface MessagesRepository extends JpaRepository<Messages, Long>{
    List<Messages> findByChatId(Long chatId);

    @Query(value = """
            with ins as (
                insert into messages (chat_id, sender_id, reciever_id, msg)
                values (:chatId, :senderId, :recieverId, :msg)
                returning chat_id
            )
            select m.* from messages m join ins on m.chat_id = ins.chat_id
            order by id
            """, nativeQuery = true)
    Messages insertMessage(Long chatId, Long senderId, Long recieverId, String msg);
}
