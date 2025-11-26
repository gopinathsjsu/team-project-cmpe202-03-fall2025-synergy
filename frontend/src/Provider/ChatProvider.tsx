import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { ChatContext, type ChatContextValue, type Conversation, type Message } from "../context/chatContext";
import { getMessages, api, CURRENT_USER_ID } from "../lib/api";
import { formatRelativeTime } from "../types/chat";
import { useInterval } from "../hooks/useInterval";
import { Toast } from "../components/Toast";
import { getCurrentUserId } from "../utils/auth";

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [activeChatId, setActiveChatId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type?: "error" | "success" | "info" } | null>(null);

  const scrollRef = useRef<HTMLDivElement>(null);
  // Track last seen message ID per chat to avoid double-counting unread
  const lastSeenMessageIds = useRef<Map<number, number>>(new Map());

  const activeConversation = useMemo(
    () => conversations.find((c) => c.id === activeChatId) ?? null,
    [conversations, activeChatId]
  );

  const activeMessages = useMemo(() => {
    const filtered = messages.filter((m) => m.conversationId === activeChatId);
    // Sort by id ascending (oldest → newest)
    return filtered.sort((a, b) => a.id - b.id);
  }, [messages, activeChatId]);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeMessages]);

  // Load messages for active chat
  const loadMessagesForChat = useCallback(async (chatId: number) => {
    if (!chatId) return;
    
    try {
      const uiMessages = await getMessages(chatId);
      
      // Update messages: remove old messages for this chat, add new ones
      setMessages((prev) => {
        const otherChatMessages = prev.filter((m) => m.conversationId !== chatId);
        return [...otherChatMessages, ...uiMessages];
      });

      // Update conversation's lastMessage if there are new messages
      if (uiMessages.length > 0) {
        const latestMessage = uiMessages[uiMessages.length - 1];
        const isFromOtherUser = !latestMessage.isOwn;
        const isActiveChat = chatId === activeChatId;
        const lastSeenId = lastSeenMessageIds.current.get(chatId) ?? 0;
        const isNewMessage = latestMessage.id > lastSeenId;
        
        // Update last seen message ID
        lastSeenMessageIds.current.set(chatId, latestMessage.id);
        
        setConversations((prev) =>
          prev.map((c) => {
            if (c.id !== chatId) return c;
            
            // Increment unread only if it's a new message from other user and chat is not active
            const newUnread = isNewMessage && isFromOtherUser && !isActiveChat 
              ? c.unread + 1 
              : c.unread;
            
            return {
              ...c,
              lastMessage: latestMessage.content,
              timestamp: formatRelativeTime(new Date().toISOString()), // Use current time as fallback
              unread: newUnread,
              messages: uiMessages, // Update messages in conversation
            };
          })
        );
      }
    } catch (error: unknown) {
      // Don't show toast for 404s (chat might not exist yet)
      const err = error as { response?: { status?: number; data?: { error?: string } }; message?: string };
      if (err.response?.status === 404) {
        console.warn(`Chat ${chatId} not found`);
        return;
      }
      const errorMessage = err.response?.data?.error || err.message || "Failed to load messages";
      console.error("Failed to load messages:", errorMessage);
      // Only show toast for unexpected errors, not during polling
      if (activeChatId === chatId) {
        setToast({ message: errorMessage, type: "error" });
      }
    }
  }, [activeChatId]);

  // Poll for new messages in active chat (every 5 seconds)
  // Only poll if we have a valid activeChatId and no recent errors
  useInterval(
    () => {
      if (activeChatId) {
        loadMessagesForChat(activeChatId);
      }
    },
    activeChatId ? 5000 : null
  );

  // Helper to get current user ID
  const getCurrentUser = useCallback(() => {
    const userId = getCurrentUserId();
    return userId ?? CURRENT_USER_ID;
  }, []);

  const loadUserChats = useCallback(async () => {
    try {
      const currentUserId = getCurrentUser();
      const data = await api.getUserConversations();
      
      // Filter to only show conversations where current user is a participant
      const userConvs = data.conversations.filter((c) => 
        c.chat.buyerId === currentUserId || c.chat.sellerId === currentUserId
      );
      
      const convs = userConvs.map((c) => {
        const isBuyer = c.chat.buyerId === currentUserId;
        const otherUserName = isBuyer ? c.chat.sellerName : c.chat.buyerName;
        const otherUserId = isBuyer ? c.chat.sellerId : c.chat.buyerId;
        const lastMessage = c.messages?.at(-1);
        
        return {
          id: c.chat.id,
          user: otherUserName,
          lastMessage: lastMessage?.msg ?? "",
          timestamp: lastMessage?.sentAt ? formatRelativeTime(lastMessage.sentAt) : "Just now",
          unread: 0,
          avatar: "",
          otherUserId: otherUserId,
          messages: c.messages?.map((m): Message => {
            const senderName = m.senderId === currentUserId ? "You" : otherUserName;
            const sentAt = m.sentAt ?? new Date().toISOString();
            return {
              id: m.id,
              conversationId: m.chatId ?? 0,
              sender: senderName,
              content: m.msg,
              timestamp: new Date(sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              isOwn: m.senderId === currentUserId,
            };
          }) || [],
        };
      });
      
      setConversations(convs);
      
      // Collect all messages from conversations
      const allMessages: Message[] = convs.flatMap((conv) => conv.messages || []);
      setMessages(allMessages);
      
      // Initialize last seen message IDs
      convs.forEach((conv) => {
        if (conv.messages && conv.messages.length > 0) {
          const lastMessageId = Math.max(...conv.messages.map((m) => m.id));
          lastSeenMessageIds.current.set(conv.id, lastMessageId);
        }
      });
      
      // Set first conversation as active if none is active
      if (!activeChatId && convs.length > 0) {
        setActiveChatId(convs[0].id);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load conversations";
      setToast({ message: errorMessage, type: "error" });
      console.error("Failed to load user chats:", error);
    }
  }, [activeChatId, getCurrentUser]);

  // Handle chatId query parameter (from "Chat with seller" button)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const chatIdParam = Number(params.get("chatId"));
    if (!chatIdParam || isNaN(chatIdParam)) return;

    // If conversation already exists, just select it
    const exists = conversations.some((c) => c.id === chatIdParam);
    if (exists) {
      setActiveChatId(chatIdParam);
      return;
    }

    // Otherwise, load conversations first, then select if it exists
    loadUserChats().then(() => {
      const stillExists = conversations.some((c) => c.id === chatIdParam);
      if (stillExists) {
        setActiveChatId(chatIdParam);
      } else {
        // Chat doesn't exist yet - try to load messages directly
        // This will create a temporary conversation that gets replaced on next refresh
        loadMessagesForChat(chatIdParam).catch(() => {
          // If loading fails, just show error
          setToast({ message: "Chat not found", type: "error" });
        });
      }
    });
  }, [location.search, conversations, loadUserChats, loadMessagesForChat]);

  // Load messages when activeChatId changes
  useEffect(() => {
    if (activeChatId) {
      loadMessagesForChat(activeChatId);
    } else {
      // Clear messages if no active chat
      setMessages([]);
    }
  }, [activeChatId, loadMessagesForChat]);

  const selectConversation = useCallback((id: number) => {
    setActiveChatId(id);
    // Mark as read and update last seen message ID
    const chatMessages = messages.filter((m) => m.conversationId === id);
    if (chatMessages.length > 0) {
      const lastMessageId = Math.max(...chatMessages.map((m) => m.id));
      lastSeenMessageIds.current.set(id, lastMessageId);
    }
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c))
    );
    // Note: loadMessagesForChat will be called by useEffect when activeChatId changes
  }, [messages]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || !activeChatId) return;

    const activeConv = conversations.find((c) => c.id === activeChatId);
    if (!activeConv || !activeConv.otherUserId) {
      setToast({ message: "Cannot send message: chat information incomplete", type: "error" });
      return;
    }

    const receiverId = activeConv.otherUserId;

    const previousMessages = [...messages];

    // Optimistic update: add message immediately
    const optimisticMsg: Message = {
      id: Date.now(),
      conversationId: activeChatId,
      sender: "You",
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      isOwn: true,
    };
    setMessages((prev) => [...prev, optimisticMsg]);
    setConversations((prev) =>
      prev.map((c) =>
        c.id === activeChatId
          ? { ...c, lastMessage: optimisticMsg.content, timestamp: "Just now" }
          : c
      )
    );

    try {
      // Send to API - backend derives sender_id from JWT, we only send receiver_id and msg
      const updated = await api.sendMessage(activeChatId, {
        receiver_id: receiverId,
        msg: text.trim(),
      });

      // Replace all messages for this chat with server response (no duplicates)
      setMessages((prev) => {
        const otherChatMessages = prev.filter((m) => m.conversationId !== activeChatId);
        return [...otherChatMessages, ...updated];
      });

      // Update conversation with latest message
      if (updated.length > 0) {
        const latest = updated[updated.length - 1];
        // Update last seen message ID
        lastSeenMessageIds.current.set(activeChatId, latest.id);
        setConversations((prev) =>
          prev.map((c) =>
            c.id === activeChatId
              ? { ...c, lastMessage: latest.content, timestamp: "Just now" }
              : c
          )
        );
      }
    } catch (err: unknown) {
      // Roll back optimistic message
      setMessages(previousMessages);
      const error = err as { response?: { data?: { error?: string } }; message?: string };
      const errorMessage = error.response?.data?.error || error.message || "Failed to send message";
      console.error("Send failed:", errorMessage);
      setToast({ message: errorMessage, type: "error" });
    }
  }, [activeChatId, conversations, messages, getCurrentUser]);

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

  return (
    <>
      <ChatContext.Provider value={value}>{children}</ChatContext.Provider>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

export default ChatProvider;
