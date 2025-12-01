import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Package, ExternalLink } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { productApi, type Product } from '../services/productApi'

interface ChatMessage {
  id: number
  text: string
  isBot: boolean
  timestamp: Date
  searchResults?: Product[]
}

/**
 * Extract a useful search term from a natural-language sentence.
 * Examples:
 *  - "can you search for iphone 13?" → "iphone 13"
 *  - "do you have intro to algorithms" → "intro to algorithms"
 */
const extractSearchTerm = (raw: string): string => {
  const text = raw.trim().replace(/[?!.]/g, '')
  const lower = text.toLowerCase()

  const patterns = [
    'can you search for',
    'search for',
    'search',
    'find me',
    'find',
    'look for',
    'do you have',
    'show me',
    'any',
  ]

  for (const pat of patterns) {
    const idx = lower.indexOf(pat)
    if (idx !== -1) {
      const term = text.slice(idx + pat.length).trim()
      if (term.length > 0) return term
    }
  }

  // fallback: whole message without punctuation
  return text
}

/**
 * FAQ-style responses.
 * Returns null if we don't have a canned answer and should treat it as a search.
 */
const getFaqResponse = (rawMessage: string): string | null => {
  const msg = rawMessage.toLowerCase().trim()

  // Greetings
  if (
    msg === 'hi' ||
    msg === 'hello' ||
    msg === 'hey' ||
    msg === 'greetings' ||
    msg === 'good morning' ||
    msg === 'good afternoon' ||
    msg === 'good evening'
  ) {
    return "Hello! 👋 I'm your Spartan Exchange assistant. How can I help you today?"
  }

  // Help/Support
  if (msg.includes('help') || msg.includes('support') || msg.includes('assist')) {
    return "I can help you with:\n• Browsing and searching listings\n• Creating new listings\n• Managing your profile\n• Chatting with sellers\n\nAsk something like \"Do you have an iPhone 13?\" or \"Used textbook for CMPE 202\"."
  }

  // Listings / selling
  if (msg.includes('listing') || msg.includes('post') || msg.includes('sell')) {
    return "To create a new listing:\n1. Click 'Create Listing' in the navigation\n2. Fill in the item details (title, description, price, category)\n3. Upload photos\n4. Click 'Create Listing' to publish."
  }

  // Chat / messages
  if (msg.includes('chat') || msg.includes('message')) {
    return "To chat with a seller:\n1. Open any listing\n2. Click 'Chat with seller'\n3. Start your conversation.\n\nYou can see all chats on the Messages page."
  }

  // Profile/account
  if (msg.includes('profile') || msg.includes('account')) {
    return "You can access your profile by clicking the user icon in the top navigation. There you can view your listings and edit your information."
  }

  // Logout
  if (msg.includes('logout') || msg.includes('log out') || msg.includes('sign out')) {
    return "To log out, click the user icon in the top navigation and select 'Logout'."
  }

  // Safety
  if (msg.includes('safe') || msg.includes('scam') || msg.includes('trust')) {
    return "Safety tips:\n• Meet in public campus locations\n• Inspect items before paying\n• Use secure payment methods\n• Report suspicious listings."
  }

  // Pricing / free
  if (msg.includes('price') || msg.includes('cost') || msg.includes('free')) {
    return "Spartan Exchange is free to use! There are no fees for creating listings, browsing items, or messaging sellers."
  }

  // Thanks
  if (msg.includes('thank') || msg.includes('thanks')) {
    return "You're welcome! 😊 Let me know if you need anything else."
  }

  // No known FAQ → we will treat it as a search
  return null
}

/**
 * Use the SAME idea as ListingsPage: getAll() + client-side filtering.
 */
const searchProductsLocally = async (
  userMessage: string
): Promise<{ term: string; results: Product[] }> => {
  const term = extractSearchTerm(userMessage)
  const searchTerm = term.toLowerCase().trim()

  const allProducts = await productApi.getAll() // same source as ListingsPage

  if (!searchTerm) {
    return { term, results: [] }
  }

  const results = (allProducts || []).filter((p) => {
    if (!p) return false
    const name = (p.name || '').toLowerCase()
    const desc = (p.description || '').toLowerCase()
    return name.includes(searchTerm) || desc.includes(searchTerm)
  })

  return { term, results }
}

export default function ChatbotWidget() {
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 1,
      text: "Hi! I'm your Spartan Exchange assistant. You can ask me things like:\n\n• \"Do you have an iPhone 13?\"\n• \"Used textbook for CMPE 202\"\n• \"Show me a road bike\"",
      isBot: true,
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  // Scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
    }
  }, [isOpen])

  const handleSend = async () => {
    const text = inputValue.trim()
    if (!text) return

    const now = new Date()

    // Add user message
    const userMessage: ChatMessage = {
      id: now.getTime(),
      text,
      isBot: false,
      timestamp: now
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue('')

    // 1) FAQ reply?
    const faq = getFaqResponse(text)
    if (faq) {
      const botResponse: ChatMessage = {
        id: now.getTime() + 1,
        text: faq,
        isBot: true,
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, botResponse])
      return
    }

    // 2) Otherwise treat as product search using getAll() + filter
    setIsSearching(true)
    try {
      const { term, results } = await searchProductsLocally(text)

      if (results.length === 1) {
        // Single match → show card with link instead of redirecting
        setMessages((prev) => [
          ...prev,
          {
            id: now.getTime() + 2,
            text: `I found one match for "${term}":`,
            isBot: true,
            timestamp: new Date(),
            searchResults: results
          }
        ])
        return
      }

      if (results.length > 0) {
        const header =
          `I found ${results.length} item${results.length > 1 ? 's' : ''} for "${term}".\n\n` +
          'Click any result below to open its listing page.'
        const botResponse: ChatMessage = {
          id: now.getTime() + 2,
          text: header,
          isBot: true,
          timestamp: new Date(),
          searchResults: results
        }
        setMessages((prev) => [...prev, botResponse])
      } else {
        const botResponse: ChatMessage = {
          id: now.getTime() + 2,
          text:
            `I couldn't find any items matching "${term}". 😔\n\n` +
            'Try adjusting your wording, or use the filters and search bar on the Listings page.',
          isBot: true,
          timestamp: new Date()
        }
        setMessages((prev) => [...prev, botResponse])
      }
    } catch (err) {
      console.error('Chatbot search error:', err)
      const errorResponse: ChatMessage = {
        id: now.getTime() + 2,
        text:
          "Sorry, I encountered an error while searching. 😣\n\n" +
          "Please try again later or use the main search bar on the Listings page.",
        isBot: true,
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, errorResponse])
    } finally {
      setIsSearching(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Panel */}
      {isOpen && (
        <div className="mb-4 w-96 md:w-[450px] max-h-[80vh] bg-white rounded-xl shadow-2xl border border-gray-200 flex flex-col">
          {/* Header */}
          <div className="bg-primary-600 text-white px-4 py-3 rounded-t-xl flex items-center justify-between">
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

          {/* Messages */}
          <div className="flex-1 max-h-[75vh] overflow-y-auto p-4 space-y-3 bg-gray-50 custom-scroll">
            {messages.map((message) => (
              <div key={message.id} className="space-y-2">
                <div className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}>
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

                {/* Product Results */}
                {message.searchResults && message.searchResults.length > 0 && (
                  <div className="space-y-2">
                    {message.searchResults.map((product) => (
                      <div
                        key={product.id}
                        className="bg-white border border-gray-200 rounded-lg p-3 hover:shadow-md hover:border-primary-500 transition-all"
                      >
                        <div className="flex items-start space-x-3">
                          {(product as any).imageUrl || (product as any).image_url ? (
                            <img
                              src={(product as any).imageUrl || (product as any).image_url}
                              alt={product.name || 'Product'}
                              className="w-16 h-16 object-cover rounded"
                            />
                          ) : (
                            <div className="w-16 h-16 bg-gray-200 rounded flex items-center justify-center">
                              <Package className="h-8 w-8 text-gray-400" />
                            </div>
                          )}

                          <div className="flex-1 min-w-0">
                            <h4 className="font-semibold text-sm text-gray-900 truncate">
                              {product.name}
                            </h4>
                            {product.description && (
                              <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                {product.description}
                              </p>
                            )}

                            <div className="flex items-center justify-between mt-2">
                              <span className="text-sm font-bold text-primary-600">
                                ${Number(product.price || 0).toFixed(2)}
                              </span>
                              <div className="flex items-center space-x-1 text-xs text-gray-500">
                                <span>{product.category || 'Uncategorized'}</span>
                                {product.condition && (
                                  <>
                                    <span>•</span>
                                    <span>{product.condition}</span>
                                  </>
                                )}
                              </div>
                            </div>

                            <button
                              onClick={() => navigate(`/listings/${product.id}`)}
                              className="mt-2 inline-flex items-center text-primary-600 font-semibold text-xs hover:underline"
                            >
                              Open Listing
                              <ExternalLink className="h-3 w-3 ml-1" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {isSearching && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 shadow-sm border border-gray-200 rounded-lg px-4 py-2">
                  <p className="text-sm">Searching listings...</p>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-200 rounded-b-xl">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about an item..."
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
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  )
}
