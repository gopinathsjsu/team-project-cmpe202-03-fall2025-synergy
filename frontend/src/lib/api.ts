import axios from "axios";
import type { MessageDTO, StartMessageRequestDTO } from "../types/chat";
import type { Conversation, Message } from "../context/chatContext";
import { CURRENT_USER_ID } from "../types/chat";

// Re-export for convenience
export { CURRENT_USER_ID } from "../types/chat";

// Axios instance with baseURL
// Note: withCredentials is set to true to support cookie-based auth if needed in the future
// For JWT auth, this is optional but doesn't hurt
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
  withCredentials: true, // Send cookies/credentials with requests
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
  buyerName: string;
  sellerId: number;
  sellerName: string;
  productId: number;
  createdAt?: string;
  updatedAt?: string | null;
};

export type StartChatRequestDTO = {
  product_id: number;
  buyer_id: number;
  seller_id: number;
};

// Backend now returns ChatDTO directly (not wrapped in chat object)
export type StartChatResponse = Chat;

export type MessagesDTO = Array<{
  id: number;
  chatId: number;
  senderId: number;
  recieverId: number;
  msg: string;
  sentAt: string;
}>;

export type ConversationWithMessages = {
  chat: Chat; // Now includes buyerName and sellerName
  messages: Messages[];
};

export type UserConversationsResponse = {
  user: { id: number; username: string; email: string; firstName?: string; lastName?: string };
  conversations: ConversationWithMessages[];
};

/**
 * Helper to map server message to UI Message
 */
function mapServerMessage(m: any): Message {
  return {
    id: m.id,
    conversationId: m.chatId,
    sender: m.senderId === CURRENT_USER_ID ? "You" : "Seller",
    content: m.msg,
    timestamp: new Date(m.sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    isOwn: m.senderId === CURRENT_USER_ID,
  };
}

/**
 * Helper to map array of server messages to UI Messages
 */
function mapServerMessages(list: any[]): Message[] {
  return (list || []).map(mapServerMessage);
}

/**
 * Helper to convert StartChatResponse (ChatDTO) to Conversation
 * (Exported for potential future use)
 */
export function toConversationFromStart(resp: StartChatResponse, currentUserId: number): Conversation {
  const isBuyer = resp.buyerId === currentUserId;
  const otherUserName = isBuyer ? resp.sellerName : resp.buyerName;
  const otherUserId = isBuyer ? resp.sellerId : resp.buyerId;
  
  return {
    id: resp.id,
    user: otherUserName,
    lastMessage: "",
    timestamp: "Just now",
    unread: 0,
    avatar: "", // Will use Avatar component
    otherUserId: otherUserId,
    messages: [],
  };
}

/**
 * Get all messages for a chat
 * Backend: GET /api/chat/{chatId}/message
 */
export async function getMessages(chatId: number): Promise<Message[]> {
  try {
    const res = await apiClient.get<any>(`/chat/${chatId}/message`);
    return mapServerMessages(res.data?.messages ?? res.data ?? []);
  } catch (error) {
    console.error(`Failed to get messages for chat ${chatId}:`, error);
    throw error;
  }
}

/**
 * Send a message in a chat
 * Backend: POST /api/chat/{chatId}/message
 * Body: { sender_id, reciever_id, msg }
 */
export async function sendMessage(
  chatId: number,
  payload: { sender_id: number; reciever_id: number; msg: string }
): Promise<Message[]> {
  try {
    const res = await apiClient.post<any>(`/chat/${chatId}/message`, payload);
    // backend returns all messages of the chat; map them:
    return mapServerMessages(res.data?.messages ?? res.data ?? []);
  } catch (error) {
    console.error(`Failed to send message in chat ${chatId}:`, error);
    throw error;
  }
}

/**
 * Start a new chat
 * Backend: POST /api/chat/start
 * Body: { product_id, buyer_id, seller_id }
 * Returns: ChatDTO with buyerName and sellerName
 */
export async function startChat(body: StartChatRequestDTO): Promise<StartChatResponse> {
  try {
    const res = await apiClient.post<StartChatResponse>("/chat/start", body);
    return res.data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message || "Failed to start chat";
    console.error("Failed to start chat:", errorMessage, error);
    throw new Error(errorMessage);
  }
}

// API object
export const api = {
  startChat,
  getMessages,
  sendMessage,
  /**
   * Get user conversations
   * Backend: POST /api/users/conversations
   * Body: { user_id: number }
   */
  getUserConversations: async (): Promise<any> => {
    try {
      const response = await apiClient.post(`/users/conversations`, { user_id: CURRENT_USER_ID });
      return response.data;
    } catch (error) {
      console.error("Failed to get user conversations:", error);
      throw error;
    }
  },
  // Legacy aliases for backward compatibility
  listMessages: getMessages,
  sendMessages: sendMessage,
};
