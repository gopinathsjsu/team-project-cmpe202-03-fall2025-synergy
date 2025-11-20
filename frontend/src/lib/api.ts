export const API_BASE_URL = import.meta.env.VITE_API_URL as string;

async function http<T> (path: string, options?:RequestInit):Promise<T>{
    const res = await fetch(`${API_BASE_URL}${path}`, {
        headers:{
            'content-type': 'application/json'
        },
        ...options
    });
    if(!res.ok){
        throw new Error(`HTTP error! status: ${res.status}`);
    }else{
        return res.json() as Promise<T>;
    }
}

export type Messages = {
    id: number;
    chat_id?: number; // backend uses snake_case
    chatId?: number;  // frontend-friendly
    sender_id?: number;
    senderId?: number;
    reciever_id?: number;
    recieverId?: number;
    msg: string;
    sent_at?: string;
    sentAt?: string;
}

export type startMessageRequest = {
    chat_id: number;
    reciever_id: number;
    sender_id: number;
    msg: string;
}

export type startChatRequest = {
    buyer_id: number;
    seller_id: number;
    product_id: number;
}

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
}

export type UserConversationsResponse = {
    user: { id: number; username: string; email: string; firstName?: string; lastName?: string };
    conversations: ConversationWithMessages[];
}

export const api = {
    listMessages: (chatId: number) => http<Messages[]>(`chat/${chatId}/message`),

    sendMessages: (chatId: number, body: startMessageRequest ) => http<{chat_id: number, messages: Messages[]}>(`chat/${chatId}/message`, {
        method: 'POST',
        body: JSON.stringify(body)
    }),

    startChat: (body: startChatRequest) => http<Chat>(`chat/start`, {
        method: 'POST',
        body: JSON.stringify(body)
    }),

    getUserConversations: (userId: number) => http<UserConversationsResponse>(`users/conversations`, {
        method: 'POST',
        body: JSON.stringify({ user_id: 10 })
    })
}