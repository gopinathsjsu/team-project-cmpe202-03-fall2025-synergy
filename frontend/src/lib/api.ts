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

// Add JWT token to all requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Legacy types for backward compatibility (if needed elsewhere)
export type Messages = MessageDTO;
export type startMessageRequest = StartMessageRequestDTO & { chat_id: number };
export type startChatRequest = StartChatRequestDTO;

export type Chat = {
  id: number;
  productId: number;
  productName: string;
  buyerId: number;
  buyerName: string;
  sellerId: number;
  sellerName: string;
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

interface ServerMessage {
  id: number;
  chatId?: number;
  chat_id?: number;
  senderId?: number;
  sender_id?: number;
  recieverId?: number;
  reciever_id?: number;
  msg: string;
  sentAt?: string;
  sent_at?: string;
}

/**
 * Helper to map server message to UI Message
 * Uses actual logged-in user ID from localStorage
 */
function mapServerMessage(m: ServerMessage, currentUserId: number): Message {
  const senderId = m.senderId ?? m.sender_id ?? 0;
  const chatId = m.chatId ?? m.chat_id ?? 0;
  const sentAt = m.sentAt ?? m.sent_at ?? new Date().toISOString();
  const isOwn = senderId === currentUserId;
  
  return {
    id: m.id,
    conversationId: chatId,
    sender: isOwn ? "You" : `User ${senderId}`,
    content: m.msg,
    timestamp: new Date(sentAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    isOwn,
  };
}

/**
 * Helper to map array of server messages to UI Messages
 * Uses actual logged-in user ID from localStorage
 */
function mapServerMessages(list: ServerMessage[], currentUserId: number): Message[] {
  return (list || []).map((m) => mapServerMessage(m, currentUserId));
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
 * Returns: MessageDTO[] directly (array of messages)
 */
export async function getMessages(chatId: number): Promise<Message[]> {
  try {
    const res = await apiClient.get<ServerMessage[]>(`/chat/${chatId}/message`);
    const data = res.data;
    
    // Backend returns MessageDTO[] directly
    const messages: ServerMessage[] = Array.isArray(data) ? data : [];
    
    // Get current user ID from localStorage
    const storedId = Number(localStorage.getItem("userId"));
    const currentUserId = Number.isFinite(storedId) && storedId > 0 ? storedId : CURRENT_USER_ID;
    
    return mapServerMessages(messages, currentUserId);
  } catch (error) {
    console.error(`Failed to get messages for chat ${chatId}:`, error);
    throw error;
  }
}

/**
 * Send a message in a chat
 * Backend: POST /api/chat/{chatId}/message
 * Body: { receiver_id, msg } (sender_id is derived from JWT on backend)
 * Returns: MessageResponse with all messages for the chat
 */
export async function sendMessage(
  chatId: number,
  payload: { receiver_id: number; msg: string }
): Promise<Message[]> {
  try {
    // Backend expects { receiver_id, msg } - sender_id comes from JWT
    const res = await apiClient.post<{ chatId: number; messages: ServerMessage[] } | ServerMessage[]>(`/chat/${chatId}/message`, payload);
    
    // Backend returns MessageResponse { chatId, messages } or directly MessageDTO[]
    const data = res.data;
    let messages: ServerMessage[] = [];
    
    if (Array.isArray(data)) {
      messages = data;
    } else if (data && typeof data === 'object' && 'messages' in data) {
      messages = (data as { messages: ServerMessage[] }).messages ?? [];
    }
    
    // Get current user ID from localStorage
    const storedId = Number(localStorage.getItem("userId"));
    const currentUserId = Number.isFinite(storedId) && storedId > 0 ? storedId : CURRENT_USER_ID;
    
    return mapServerMessages(messages, currentUserId);
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
  } catch (error: unknown) {
    const err = error as { response?: { data?: { error?: string } }; message?: string };
    const errorMessage = err.response?.data?.error || err.message || "Failed to start chat";
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
//   getUserConversations: async (): Promise<UserConversationsResponse> => {
//     try {
//       const response = await apiClient.post<UserConversationsResponse>(`/users/conversations`, { user_id: CURRENT_USER_ID });
//       return response.data;
//     } catch (error) {
//       console.error("Failed to get user conversations:", error);
//       throw error;
//     }
//   },
    getUserConversations: async (): Promise<UserConversationsResponse> => {
      try {
        // Prefer the logged-in user's id from localStorage
        const storedId = Number(localStorage.getItem("userId"));
        const userId = Number.isFinite(storedId) && storedId > 0
          ? storedId
          : CURRENT_USER_ID; // fallback for safety

        const response = await apiClient.post<UserConversationsResponse>(
          `/users/conversations`,
          { user_id: userId }
        );

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
