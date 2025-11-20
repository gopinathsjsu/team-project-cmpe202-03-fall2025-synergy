import axios from "axios";
import type { MessageDTO, StartMessageRequestDTO, StartChatRequestDTO } from "../types/chat";
import type { Conversation, Message } from "../context/chatContext";
import { CURRENT_USER_ID } from "../types/chat";

// Axios instance with baseURL
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Legacy types for backward compatibility (if needed elsewhere)
export type Messages = MessageDTO;
export type startMessageRequest = StartMessageRequestDTO & { chat_id: number };
export type startChatRequest = StartChatRequestDTO;

export type Chat = {
  id: number;
  buyerId: number;
  sellerId: number;
  productId: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ConversationWithMessages = {
  chat: Chat;
  messages: Messages[];
};

export type UserConversationsResponse = {
  user: { id: number; username: string; email: string; firstName?: string; lastName?: string };
  conversations: ConversationWithMessages[];
};

/**
 * Get all messages for a chat
 */
export async function getMessages(chatId: number): Promise<Message[]> {
  const response = await apiClient.get<any[]>(`/chat/${chatId}/message`);
  // Map backend response (camelCase) to Message[]
  return response.data.map((m: any): Message => ({
    id: m.id,
    conversationId: m.chatId ?? chatId,
    sender: m.senderId === CURRENT_USER_ID ? "You" : "Seller",
    content: m.msg,
    timestamp: new Date(m.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    isOwn: m.senderId === CURRENT_USER_ID,
  }));
}

/**
 * Send a message in a chat
 */
export async function sendMessage(
  chatId: number,
  body: StartMessageRequestDTO
): Promise<Message[]> {
  const response = await apiClient.post<any>(`/chat/${chatId}/message`, body);
  // Map backend response to Message[]
  const messages = response.data.messages || [];
  return messages.map((m: any): Message => ({
    id: m.id,
    conversationId: m.chatId ?? chatId,
    sender: m.senderId === CURRENT_USER_ID ? "You" : "Seller",
    content: m.msg,
    timestamp: new Date(m.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    isOwn: m.senderId === CURRENT_USER_ID,
  }));
}

/**
 * Start a new chat (optional)
 */
export async function startChat(body: StartChatRequestDTO): Promise<Chat> {
  const response = await apiClient.post<Chat>(`/chat/start`, body);
  return response.data;
}

// Legacy API object for backward compatibility
export const api = {
  listMessages: getMessages,
  sendMessages: sendMessage,
  startChat,
  getUserConversations: async (): Promise<Conversation[]> => {
    const response = await apiClient.post(`/users/conversations`, {
      user_id: CURRENT_USER_ID,
    });
    
    const data = response.data;
    return data.conversations.map((conv: any) => ({
      id: conv.chat.id,
      user: conv.chat.sellerId === CURRENT_USER_ID ? "Buyer" : "Seller",
      lastMessage: conv.messages?.at(-1)?.msg || "",
      timestamp: conv.messages?.at(-1)?.sentAt || conv.chat.createdAt,
      unread: 0,
      avatar: "https://via.placeholder.com/40x40?text=CM",
      otherUserId: conv.chat.sellerId === CURRENT_USER_ID ? conv.chat.buyerId : conv.chat.sellerId,
      messages: conv.messages?.map((m: any): Message => ({
        id: m.id,
        conversationId: m.chatId,
        sender: m.senderId === CURRENT_USER_ID ? "You" : "Seller",
        content: m.msg,
        timestamp: new Date(m.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        isOwn: m.senderId === CURRENT_USER_ID,
      })) || [],
    }));
  },
};
