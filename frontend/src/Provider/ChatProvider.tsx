import React, { useMemo, useRef, useState } from "react";
import { ChatContext, type ChatContextValue, type Conversation, type Message } from "../context/chatContext";
import { api, type UserConversationsResponse } from "../lib/api";

// --- Dummy data ---
const DUMMY_CONVERSATIONS: Conversation[] = [
  { id: 1, user: "John Doe",  lastMessage: "Is the textbook still available?", timestamp: "2 min ago", unread: 2, avatar: "https://via.placeholder.com/40x40?text=JD" },
  { id: 2, user: "Jane Smith", lastMessage: "What's the condition of the laptop?", timestamp: "1 hour ago", unread: 0, avatar: "https://via.placeholder.com/40x40?text=JS" },
  { id: 3, user: "Mike Johnson", lastMessage: "Thanks for the quick response!", timestamp: "3 hours ago", unread: 0, avatar: "https://via.placeholder.com/40x40?text=MJ" },
];

const DUMMY_MESSAGES: Message[] = [
  { id: 1, conversationId: 1, sender: "John Doe", content: "Hi! Is the Calculus textbook still available?", timestamp: "2:30 PM", isOwn: false },
  { id: 2, conversationId: 1, sender: "You",      content: "Yes, it's still available! It's in great condition.", timestamp: "2:32 PM", isOwn: true },
  { id: 3, conversationId: 1, sender: "John Doe", content: "Perfect! What's the lowest price you can do?", timestamp: "2:35 PM", isOwn: false },
  { id: 4, conversationId: 1, sender: "You",      content: "I can do $40 if you can pick it up today.", timestamp: "2:36 PM", isOwn: true },
];

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const [conversations, setConversations] = useState<Conversation[]>(DUMMY_CONVERSATIONS);
  const [messages, setMessages] = useState<Message[]>(DUMMY_MESSAGES);
  const [activeChatId, setActiveChatId] = useState<number | null>(DUMMY_CONVERSATIONS[0]?.id ?? null);

  const scrollRef = useRef<HTMLDivElement>(null);

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeChatId) ?? null,
    [conversations, activeChatId]
  );

  const activeMessages = useMemo(
    () => messages.filter((m) => m.conversationId === activeChatId),
    [messages, activeChatId]
  );

  const selectConversation = (id: number) => {
    setActiveChatId(id);
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
  };

  const loadUserChats = async (userId: number) => {
    try {
      const res = await api.getUserConversations(userId);
      // map conversations and messages
      const convs: Conversation[] = res.conversations.map((cwm) => {
        const chat = cwm.chat;
        // pick the other user id to display
        const otherId = (chat.buyerId === userId) ? chat.sellerId : chat.buyerId;
        return {
          id: Number(chat.id),
          user: `User ${otherId}`,
          lastMessage: cwm.messages.length ? cwm.messages[cwm.messages.length - 1].msg : "",
          timestamp: cwm.messages.length ? (cwm.messages[cwm.messages.length - 1].sent_at ?? '') : '',
          unread: 0,
          avatar: `https://via.placeholder.com/40x40?text=U${otherId}`,
        };
      });

      const msgs = res.conversations.flatMap((cwm) =>
        cwm.messages.map((m) => ({
          id: Number(m.id),
          conversationId: Number(cwm.chat.id),
          sender: (m.sender_id === userId) ? "You" : `User ${m.sender_id}`,
          content: m.msg,
          timestamp: m.sent_at ?? '',
          isOwn: m.sender_id === userId,
        }))
      );

      setConversations(convs);
      setMessages(msgs);
      setActiveChatId(convs[0]?.id ?? null);
    } catch (err) {
      console.error("Failed to load user chats", err);
    }
  };

  const sendMessage = (text: string) => {
    if (!text.trim() || !activeChatId) return;

    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const newMsg: Message = {
      id: Date.now(),
      conversationId: activeChatId,
      sender: "You",
      content: text.trim(),
      timestamp: time,
      isOwn: true,
    };

    setMessages((prev) => [...prev, newMsg]);

    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeChatId ? { ...c, lastMessage: newMsg.content, timestamp: "Just now" } : c
      )
    );

    // mock reply after 1s
    const replySender = conversations.find((c) => c.id === activeChatId)?.user ?? "Seller";
    setTimeout(() => {
      const reply: Message = {
        id: Date.now() + 1,
        conversationId: activeChatId,
        sender: replySender,
        content: "Got it! Can do $42?",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isOwn: false,
      };
      setMessages((prev) => [...prev, reply]);
      setConversations((prev) =>
        prev.map((c) =>
          c.id === activeChatId
            ? { ...c, lastMessage: reply.content, timestamp: "Just now" }
            : c
        )
      );
    }, 1000);
  };

  const value: ChatContextValue = {
    conversations,
    activeConversation,
    activeMessages,
    activeChatId,
    selectConversation,
    sendMessage,
    loadUserChats,
    scrollRef,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export default ChatProvider;
