import { createContext, useContext } from "react";

export interface Conversation {
  id: number;
  user: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar: string;
  otherUserId?: number; // Store the other user's ID for sending messages
  messages?: Message[]; // Store messages for this conversation
  productId?: number; // Product ID for this conversation
  productName?: string; // Product name for this conversation
}

export interface Message {
  id: number;
  conversationId: number;
  sender: string;     // "You" or the other user's name
  content: string;
  timestamp: string;  // e.g., "2:30 PM"
  isOwn: boolean;
}

export interface ChatContextValue {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  activeMessages: Message[];
  activeChatId: number | null;
  selectConversation: (id: number) => void | Promise<void>;
  sendMessage: (text: string) => void;
  loadUserChats?: () => Promise<void>;  // No userId parameter - uses current user
  // a ref the UI can use to auto-scroll to bottom
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

export const ChatContext = createContext<ChatContextValue | null>(null);

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
