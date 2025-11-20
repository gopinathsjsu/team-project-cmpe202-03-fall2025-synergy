import { createContext, useContext } from "react";

export interface Conversation {
  id: number;
  user: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  avatar: string;
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
  selectConversation: (id: number) => void;
  sendMessage: (text: string) => void;
  loadUserChats?: (userId: number) => Promise<void>;
  // a ref the UI can use to auto-scroll to bottom
  scrollRef: React.RefObject<HTMLDivElement | null>;
}

export const ChatContext = createContext<ChatContextValue | null>(null);

export function useChat(): ChatContextValue {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error("useChat must be used within ChatProvider");
  return ctx;
}
