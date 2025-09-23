import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, MessageCircle, Bookmark } from 'lucide-react'

const mockListings = [
  {
    id: '1',
    title: 'Calculus Textbook - Stewart 8th Edition',
    price: 45,
    image: 'https://placehold.co/800x400?text=Calculus%20Textbook',
    category: 'Textbooks',
    seller: 'John Doe',
    posted: '2 hours ago',
    description: 'Gently used calculus textbook, minimal highlights, excellent condition. Perfect for CMPE/CSE math requirements.'
  },
  {
    id: '2',
    title: 'MacBook Pro 13" - 2020 Model',
    price: 1200,
    image: 'https://placehold.co/800x400?text=MacBook%20Pro',
    category: 'Electronics',
    seller: 'Jane Smith',
    posted: '1 day ago',
    description: 'M1 MacBook Pro, 8GB RAM, 256GB SSD, great battery life. Includes charger and case.'
  },
]

const ListingDetailsPage = () => {
  const { id } = useParams()
  const listing = mockListings.find(l => l.id === id)

  if (!listing) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-gray-600">Listing not found.</p>
        <Link to="/" className="text-primary-600 hover:text-primary-700">← Back to home</Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <Link to="/" className="inline-flex items-center text-gray-600 hover:text-gray-800">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to listings
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Image and details */}
        <div className="lg:col-span-2">
          <div className="card mb-4">
            <img src={listing.image} alt={listing.title} className="w-full h-80 object-cover rounded-lg" />
          </div>

          <div className="card">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{listing.title}</h1>
            <p className="text-3xl font-bold text-primary-600 mb-4">${listing.price}</p>
            <div className="flex items-center text-sm text-gray-500 space-x-4 mb-4">
              <span>{listing.category}</span>
              <span>•</span>
              <span>{listing.posted}</span>
              <span>•</span>
              <span>Seller: {listing.seller}</span>
            </div>
            <p className="text-gray-700 leading-relaxed">{listing.description}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <div className="card">
            <button className="btn-primary w-full flex items-center justify-center space-x-2 mb-3">
              <MessageCircle className="h-4 w-4" />
              <span>Chat with seller</span>
            </button>
            <button className="btn-secondary w-full flex items-center justify-center space-x-2">
              <Bookmark className="h-4 w-4" />
              <span>Save</span>
            </button>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-2">Seller information</h3>
            <p className="text-sm text-gray-600">{listing.seller}</p>
            <p className="text-sm text-gray-500">Verified student</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ListingDetailsPage
