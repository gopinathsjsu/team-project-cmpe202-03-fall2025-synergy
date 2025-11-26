import { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send } from 'lucide-react'

interface Message {
  id: number
  text: string
  isBot: boolean
  timestamp: Date
}

// Simple FAQ-based chatbot responses
const getBotResponse = (userMessage: string): string => {
  const msg = userMessage.toLowerCase().trim()
  
  // Greetings
  if (msg.match(/^(hi|hello|hey|greetings|good morning|good afternoon|good evening)$/)) {
    return "Hello! 👋 I'm your Campus Marketplace assistant. How can I help you today?"
  }
  
  // Help/Support
  if (msg.includes('help') || msg.includes('support') || msg.includes('assist')) {
    return "I can help you with:\n• Browsing and searching listings\n• Creating new listings\n• Managing your profile\n• Chatting with sellers\n\nWhat would you like to know more about?"
  }
  
  // Navigation - Dashboard/Home
  if (msg.includes('dashboard') || msg.includes('home')) {
    return "To go to your dashboard, click on the home icon in the navigation bar at the top, or simply click 'Campus Marketplace' logo."
  }
  
  // Navigation - Profile
  if (msg.includes('profile') || msg.includes('account')) {
    return "You can access your profile by clicking the user icon in the top navigation bar. There you can view your listings, edit your information, and manage your account settings."
  }
  
  // Listings
  if (msg.includes('listing') || msg.includes('post') || msg.includes('sell')) {
    return "To create a new listing:\n1. Click 'Create Listing' in the navigation menu\n2. Fill in the item details (title, description, price, category)\n3. Upload photos of your item\n4. Click 'Create Listing' to publish\n\nYour listing will be visible to all students!"
  }
  
  // Search
  if (msg.includes('search') || msg.includes('find') || msg.includes('look for')) {
    return "You can search for items by:\n• Using the search bar at the top\n• Browsing by category\n• Filtering by price range\n• Sorting by newest or price\n\nHead to the Listings page to explore!"
  }
  
  // Chat/Messages
  if (msg.includes('chat') || msg.includes('message') || msg.includes('contact seller')) {
    return "To chat with a seller:\n1. Go to any listing page\n2. Click 'Chat with seller' button\n3. Start your conversation!\n\nYou can view all your chats in the Messages section from the navigation menu."
  }
  
  // Logout
  if (msg.includes('logout') || msg.includes('log out') || msg.includes('sign out')) {
    return "To logout, click on the user icon in the top navigation bar and select 'Logout' from the dropdown menu."
  }
  
  // Pricing
  if (msg.includes('price') || msg.includes('cost') || msg.includes('free')) {
    return "Campus Marketplace is completely FREE to use! There are no fees for:\n• Creating listings\n• Browsing items\n• Messaging sellers\n\nWe're here to help students buy and sell to each other easily!"
  }
  
  // Safety
  if (msg.includes('safe') || msg.includes('trust') || msg.includes('scam')) {
    return "Safety tips:\n• Meet in public campus locations\n• Inspect items before purchasing\n• Use secure payment methods\n• Report suspicious listings\n• Trust your instincts\n\nStay safe and happy shopping!"
  }
  
  // Thank you
  if (msg.includes('thank') || msg.includes('thanks')) {
    return "You're welcome! 😊 Feel free to ask if you need anything else. Happy buying and selling!"
  }
  
  // Default fallback
  return "I'm not quite sure about that yet, but I'm still learning! 🤔\n\nYou can try asking about:\n• How to create listings\n• How to search for items\n• How to chat with sellers\n• Your profile settings\n• General help\n\nOr type 'help' to see what I can assist with!"
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi! I'm your Campus Marketplace assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-scroll to bottom when new messages arrive
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  const handleSend = () => {
    const text = inputValue.trim()
    if (!text) return

    // Add user message
    const userMessage: Message = {
      id: Date.now(),
      text: text,
      isBot: false,
      timestamp: new Date()
    }
    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    // Simulate bot "thinking" delay
    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: getBotResponse(text),
        isBot: true,
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
    }, 500)
  }

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSend()
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Panel */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 bg-white rounded-lg shadow-2xl border border-gray-200 flex flex-col animate-in slide-in-from-bottom-5 duration-300">
          {/* Header */}
          <div className="bg-primary-600 text-white px-4 py-3 rounded-t-lg flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <MessageCircle className="h-5 w-5" />
              <h3 className="font-semibold">Chat Support</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-primary-700 rounded p-1 transition-colors"
              aria-label="Close chat"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 h-96 overflow-y-auto p-4 space-y-3 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.isBot
                      ? 'bg-white text-gray-800 shadow-sm border border-gray-200'
                      : 'bg-primary-600 text-white'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.isBot ? 'text-gray-500' : 'text-primary-100'
                    }`}
                  >
                    {message.timestamp.toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200 rounded-b-lg">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <button
                onClick={handleSend}
                disabled={!inputValue.trim()}
                className="bg-primary-600 text-white p-2 rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-primary-600 text-white rounded-full p-4 shadow-lg hover:bg-primary-700 hover:scale-110 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-primary-300"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageCircle className="h-6 w-6" />
        )}
      </button>
    </div>
  )
}

