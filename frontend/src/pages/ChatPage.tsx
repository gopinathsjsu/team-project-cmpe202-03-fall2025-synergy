import { useEffect, useState } from "react";
import { Send, MessageCircle } from "lucide-react";
import { useChat } from "../context/chatContext";
import { Avatar } from "../components/Avatar";

const ChatPage = () => {
  const {
    conversations,
    activeConversation,
    activeMessages,
    activeChatId,
    selectConversation,
    sendMessage,
    loadUserChats,
    scrollRef,
  } = useChat();

  const [message, setMessage] = useState("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessage(message);
    setMessage("");
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [activeMessages, scrollRef]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="card">
        <h1 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <MessageCircle className="h-6 w-6 mr-2" />
          Messages
        </h1>

        <div className="flex h-96 border border-gray-200 rounded-lg overflow-hidden">
          {/* Conversations List */}
          <div className="w-1/3 border-r border-gray-200 bg-gray-50">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-medium text-gray-900">Conversations</h3>
              <div className="flex items-center space-x-2">
                <input id="userId" placeholder="user id" className="input-field w-20" />
                <button
                  className="btn-primary"
                  onClick={() => {
                    const el = document.getElementById('userId') as HTMLInputElement | null;
                    const v = el?.value ? Number(el.value) : NaN;
                    if (!isNaN(v) && loadUserChats) loadUserChats(v);
                  }}
                >
                  Load
                </button>
              </div>
            </div>
            <div className="overflow-y-auto">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <MessageCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p className="text-sm font-medium mb-1">No conversations yet</p>
                  <p className="text-xs">Start a chat from a listing</p>
                </div>
              ) : (
                conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    onClick={() => selectConversation(conversation.id)}
                    className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-100 ${
                      activeChatId === conversation.id ? "bg-primary-50 border-primary-200" : ""
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Avatar name={conversation.user} className="w-10 h-10" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {conversation.user}
                          </p>
                          <p className="text-xs text-gray-500">{conversation.timestamp}</p>
                        </div>
                        <p className="text-sm text-gray-600 truncate">
                          {conversation.lastMessage || "No messages yet"}
                        </p>
                      </div>
                      {conversation.unread > 0 && (
                        <div className="bg-primary-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                          {conversation.unread}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="flex items-center space-x-3">
                {activeConversation && (
                  <Avatar name={activeConversation.user} className="w-8 h-8" />
                )}
                <div>
                  <h4 className="font-medium text-gray-900">
                    {activeConversation?.user ?? "Select a conversation"}
                  </h4>
                  <p className="text-sm text-gray-500">Online</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 p-4 overflow-y-auto bg-gray-50">
              {activeMessages.length === 0 && activeConversation ? (
                <div className="flex items-center justify-center h-full text-gray-500">
                  <p className="text-sm">No messages yet. Start the conversation!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activeMessages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.isOwn ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.isOwn
                          ? "bg-primary-600 text-white"
                          : "bg-white text-gray-900 border border-gray-200"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.isOwn ? "text-primary-100" : "text-gray-500"}`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <form onSubmit={handleSendMessage} className="flex space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 input-field"
                />
                <button type="submit" className="btn-primary flex items-center space-x-2">
                  <Send className="h-4 w-4" />
                  <span>Send</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
