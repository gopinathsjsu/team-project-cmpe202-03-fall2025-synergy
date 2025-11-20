// DTO types from backend (camelCase in responses, snake_case in requests)
export interface MessageDTO {
  id: number;
  chatId?: number; // camelCase from backend response
  chat_id?: number; // snake_case fallback
  senderId?: number; // camelCase from backend response
  sender_id?: number; // snake_case fallback
  recieverId?: number; // camelCase from backend response
  reciever_id?: number; // snake_case fallback
  msg: string;
  sentAt?: string; // camelCase from backend response
  sent_at?: string; // snake_case fallback
  updated_at?: string | null;
}

export interface MessageResponseDTO {
  chat_id: number;
  messages: MessageDTO[];
}

export interface StartMessageRequestDTO {
  chat_id: number;
  sender_id: number;
  reciever_id: number;
  msg: string;
}

export interface StartChatRequestDTO {
  buyer_id: number;
  seller_id: number;
  product_id: number;
}

// UI types (camelCase)
export interface Conversation {
  id: number; // chat_id
  user: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar: string;
}

export interface Message {
  id: number;
  conversationId: number; // = chat_id
  sender: string; // "You" or other user's name
  content: string; // = msg
  timestamp: string; // HH:mm or relative
  isOwn: boolean;
}

// Current user ID - single place to change
export const CURRENT_USER_ID = 10;
export const DEFAULT_BUYER_ID = 10;
export const DEFAULT_SELLER_ID = 4;

/**
 * Maps a MessageDTO to a UI Message
 */
export function mapDTOToMessage(dto: MessageDTO, currentUserId: number = CURRENT_USER_ID): Message {
  // Handle both camelCase and snake_case
  const senderId = dto.senderId ?? dto.sender_id ?? 0;
  const chatId = dto.chatId ?? dto.chat_id ?? 0;
  const sentAt = dto.sentAt ?? dto.sent_at ?? "";
  
  const isOwn = senderId === currentUserId;
  const sender = isOwn ? "You" : `User ${senderId}`;
  
  // Format timestamp to HH:mm
  const date = new Date(sentAt);
  const timestamp = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  
  return {
    id: dto.id,
    conversationId: chatId,
    sender,
    content: dto.msg,
    timestamp,
    isOwn,
  };
}

/**
 * Formats a timestamp to relative time (e.g., "2 min ago", "1 hour ago")
 */
export function formatRelativeTime(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  
  return date.toLocaleDateString();
}

