import React, { useMemo, useRef, useState, useEffect, useCallback } from "react";
import { useLocation } from "react-router-dom";
import { ChatContext, type ChatContextValue, type Conversation, type Message } from "../context/chatContext";
import { getMessages, api, CURRENT_USER_ID } from "../lib/api";
import { formatRelativeTime, DEFAULT_SELLER_ID } from "../types/chat";
import { useInterval } from "../hooks/useInterval";
import { Toast } from "../components/Toast";

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
    } catch (error: any) {
      // Don't show toast for 404s (chat might not exist yet)
      if (error.response?.status === 404) {
        console.warn(`Chat ${chatId} not found`);
        return;
      }
      const errorMessage = error.response?.data?.error || error.message || "Failed to load messages";
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

  // Load conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const data = await api.getUserConversations();
        // Filter to only show conversations where current user is a participant
        const userConvs = (data.conversations ?? []).filter((c: { chat: { buyerId: number; sellerId: number } }) => 
          c.chat.buyerId === CURRENT_USER_ID || c.chat.sellerId === CURRENT_USER_ID
        );
        
        const convs = userConvs.map((c: { 
          chat: { 
            id: number; 
            sellerId: number; 
            buyerId: number;
            buyerName: string;
            sellerName: string;
          }; 
          messages?: Array<{ id: number; chatId: number; senderId: number; msg: string; sentAt: string }> 
        }) => {
          const isBuyer = c.chat.buyerId === CURRENT_USER_ID;
          const otherUserName = isBuyer ? c.chat.sellerName : c.chat.buyerName;
          const otherUserId = isBuyer ? c.chat.sellerId : c.chat.buyerId;
          const lastMessage = c.messages?.at(-1);
          
          return {
            id: c.chat.id,
            user: otherUserName,
            lastMessage: lastMessage?.msg ?? "",
            timestamp: lastMessage ? formatRelativeTime(lastMessage.sentAt) : "Just now",
            unread: 0,
            avatar: "", // Use Avatar component instead
            otherUserId: otherUserId,
            messages: c.messages?.map((m: { id: number; chatId: number; senderId: number; msg: string; sentAt: string }): Message => {
              const senderName = m.senderId === CURRENT_USER_ID ? "You" : otherUserName;
              return {
                id: m.id,
                conversationId: m.chatId,
                sender: senderName,
                content: m.msg,
                timestamp: new Date(m.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                isOwn: m.senderId === CURRENT_USER_ID,
              };
            }) || [],
          };
        });
        setConversations(convs);
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || error.message || "Failed to load conversations";
        console.error("Failed to load conversations:", errorMessage);
        setToast({ message: errorMessage, type: "error" });
      }
    };
    fetchConversations();
  }, []);

  // Handle chatId query parameter (from "Chat with seller" button)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const fromParam = Number(params.get("chatId"));
    if (!fromParam || isNaN(fromParam)) return;

    // Ensure conversation exists and is active
    const exists = conversations.some((c) => c.id === fromParam);
    (async () => {
      if (!exists) {
        try {
          // Fetch messages to get conversation info
          const msgs = await api.getMessages(fromParam);
          // Create a temporary conversation - the name will be updated when we refresh conversations
          setMessages((prev) => [...prev, ...msgs]);
          setConversations((prev) => [
            ...prev,
            {
              id: fromParam,
              user: "Loading...", // Will be updated when conversations refresh
              lastMessage: msgs.at(-1)?.content ?? "",
              timestamp: "Just now",
              unread: 0,
              avatar: "",
              otherUserId: DEFAULT_SELLER_ID,
              messages: msgs,
            },
          ]);
          // Refresh conversations to get proper names
          const data = await api.getUserConversations();
          const userConvs = (data.conversations ?? []).filter((c: { chat: { buyerId: number; sellerId: number } }) => 
            c.chat.buyerId === CURRENT_USER_ID || c.chat.sellerId === CURRENT_USER_ID
          );
          const updatedConvs = userConvs.map((c: { 
            chat: { 
              id: number; 
              sellerId: number; 
              buyerId: number;
              buyerName: string;
              sellerName: string;
            }; 
            messages?: Array<{ id: number; chatId: number; senderId: number; msg: string; sentAt: string }> 
          }) => {
            const isBuyer = c.chat.buyerId === CURRENT_USER_ID;
            const otherUserName = isBuyer ? c.chat.sellerName : c.chat.buyerName;
            const otherUserId = isBuyer ? c.chat.sellerId : c.chat.buyerId;
            const lastMessage = c.messages?.at(-1);
            
            return {
              id: c.chat.id,
              user: otherUserName,
              lastMessage: lastMessage?.msg ?? "",
              timestamp: lastMessage ? formatRelativeTime(lastMessage.sentAt) : "Just now",
              unread: 0,
              avatar: "",
              otherUserId: otherUserId,
              messages: c.messages?.map((m: { id: number; chatId: number; senderId: number; msg: string; sentAt: string }): Message => {
                const senderName = m.senderId === CURRENT_USER_ID ? "You" : otherUserName;
                return {
                  id: m.id,
                  conversationId: m.chatId,
                  sender: senderName,
                  content: m.msg,
                  timestamp: new Date(m.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                  isOwn: m.senderId === CURRENT_USER_ID,
                };
              }) || [],
            };
          });
          setConversations(updatedConvs);
        } catch (e: any) {
          const errorMessage = e.response?.data?.error || e.message || "Failed to load chat";
          console.error("Failed to fetch messages for chatId param:", errorMessage);
          setToast({ message: errorMessage, type: "error" });
        }
      }
      setActiveChatId(fromParam);
    })();
  }, [location.search]);

  // Load messages when activeChatId changes
  useEffect(() => {
    if (activeChatId) {
      loadMessagesForChat(activeChatId);
    }
  }, [activeChatId, loadMessagesForChat]);

  const selectConversation = async (id: number) => {
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
    
    // Load messages if not already loaded
    const conv = conversations.find(c => c.id === id);
    if (conv?.messages && conv.messages.length > 0) {
      setMessages((prev) => {
        const otherChatMessages = prev.filter((m) => m.conversationId !== id);
        return [...otherChatMessages, ...conv.messages!];
      });
    } else {
      // Fetch messages from API
      try {
        const res = await api.listMessages(id);
        setMessages((prev) => {
          const otherChatMessages = prev.filter((m) => m.conversationId !== id);
          return [...otherChatMessages, ...res];
        });
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || error.message || "Failed to load messages";
        console.error("Failed to load messages:", errorMessage);
        if (error.response?.status !== 404) {
          setToast({ message: errorMessage, type: "error" });
        }
      }
    }
  };

  const loadUserChats = async (_userId: number) => {
    try {
      const userConvs = await api.getUserConversations();
      setConversations(userConvs);
      
      // Collect all messages from conversations
      const allMessages: Message[] = userConvs.flatMap((conv: Conversation) => conv.messages || []);
      setMessages(allMessages);
      
      // Initialize last seen message IDs
      userConvs.forEach((conv: Conversation) => {
        if (conv.messages && conv.messages.length > 0) {
          const lastMessageId = Math.max(...conv.messages.map((m: Message) => m.id));
          lastSeenMessageIds.current.set(conv.id, lastMessageId);
        }
      });
      
      // Set first conversation as active if none is active
      if (!activeChatId && userConvs.length > 0) {
        setActiveChatId(userConvs[0].id);
        if (userConvs[0].messages && userConvs[0].messages.length > 0) {
          setMessages(userConvs[0].messages);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to load conversations";
      setToast({ message: errorMessage, type: "error" });
      console.error("Failed to load user chats:", error);
    }
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || !activeChatId) return;

    const activeConv = conversations.find((c) => c.id === activeChatId);
    if (!activeConv) return;

    // Get receiver_id from conversation's otherUserId, fallback to DEFAULT_SELLER_ID
    const receiverId = activeConv.otherUserId || DEFAULT_SELLER_ID;

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
      // Send to API
      const updated = await api.sendMessage(activeChatId, {
        sender_id: CURRENT_USER_ID,
        reciever_id: receiverId,
        msg: text.trim(),
      });

      // Replace optimistic message with server response
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
    } catch (err: any) {
      // Roll back optimistic message
      setMessages(previousMessages);
      const errorMessage = err.response?.data?.error || err.message || "Failed to send message";
      console.error("Send failed:", errorMessage);
      setToast({ message: errorMessage, type: "error" });
    }
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
