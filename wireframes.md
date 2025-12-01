# UI Wireframes - Spartan Exchange Campus Marketplace

Complete set of text-based wireframes for all screens in the application.


## 1. Home Page

**Screen Name:** Home Page  
**Route:** `/`  
**Purpose:** Landing page showcasing marketplace, featured products, and category navigation

**Wireframe (ASCII Layout):**

┌─────────────────────────────────────────────────────────────────┐
│ [Navbar: Logo | Search Bar | Browse | Sell | Messages | Profile]│
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│              Welcome to Spartan Exchange                        │
│         Your Campus Marketplace for Everything                  │
│                                                                 │
│    [Search Input: "Search for textbooks, gadgets..."] [Search]  │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐         │
│  │Textbooks │  │Electronics│ │Furniture │  │  Gaming  │         │
│  │  [Icon]  │  │  [Icon]  │  │  [Icon]  │  │  [Icon]  │         │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘         │
│                                                                 │
│  Featured Listings                                              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │ [Product Image]  [Product Image]  [Product Image]        │   │
│  │ Product Name    Product Name    Product Name           │     │
│  │ $XX.XX          $XX.XX          $XX.XX                 │     │
│  │ [View Details]  [View Details]  [View Details]         │     │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  [Browse All Listings →]                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

**Main Components:**
- Navbar (with logo, search, navigation links)
- Hero section with welcome message
- Search bar
- Category icons (Textbooks, Electronics, Furniture, Gaming)
- Featured products grid (3-4 products)
- "Browse All Listings" call-to-action button

**Interactions:**
- Search bar: Navigate to listings page with search query
- Category icons: Filter listings by category
- Product cards: Navigate to listing details page
- Browse button: Navigate to listings page

**Navigation:**
- `/` → Home (current)
- `/listings` → Browse all listings
- `/listings/:id` → Product details
- `/login` → Login page (if not authenticated)

**Notes:**
- Public page, accessible to all users
- Featured products load from API
- Responsive grid layout

## 2. Login Page

**Screen Name:** Login Page  
**Route:** `/login`  
**Purpose:** User authentication to access protected features

**Wireframe (ASCII Layout):**
┌─────────────────────────────────────────────────────────────────┐
│ [Navbar: Logo | Search Bar | Browse | Login]                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                                                                 │
│                    ┌─────────────────────┐                      │
│                    │   Welcome Back      │                      │
│                    │ Sign in to continue │                      │
│                    ├─────────────────────┤                      │
│                    │                     │                      │
│                    │ [Email Icon]        │                      │
│                    │ Email Address       │                      │
│                    │ [________________]  │                      │
│                    │                     │                      │
│                    │ [Lock Icon]         │                      │
│                    │ Password            │                      │
│                    │ [________________]  │ [Eye Icon]           │
│                    │                     │                      │
│                    │ [ ] Remember me     │                      │
│                    │                     │                      │
│                    │ [    Sign in    ]   │                      │
│                    │                     │                      │
│                    │ Don't have account? │                      │
│                    │ Create one now     │                       │
│                    └─────────────────────┘                      │
│                                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

**Main Components:**
- Navbar (minimal, with login link)
- Centered login card
- Email input field with icon
- Password input field with icon and show/hide toggle
- Remember me checkbox
- Sign in button
- Register link

**Interactions:**
- Email input: Text entry
- Password input: Text entry (masked)
- Eye icon: Toggle password visibility
- Remember me: Checkbox selection
- Sign in button: Submit form, authenticate user
- Register link: Navigate to register page

**Navigation:**
- `/login` → Login (current)
- `/register` → Register page
- `/` → Home (after successful login)
- `/profile` → Profile (after successful login, if redirected)

**Notes:**
- Redirects authenticated users
- Shows error messages for invalid credentials
- Admin login: admin@campusmarket.com / admin123

## 3. Register Page

**Screen Name:** Register Page  
**Route:** `/register`  
**Purpose:** New user account creation

**Wireframe (ASCII Layout):**
```
┌─────────────────────────────────────────────────────────────────┐
│ [Navbar: Logo | Search Bar | Browse | Login]                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                                                                 │
│                  ┌─────────────────────┐                        │
│                  │ Create your account  │                       │
│                  │ Or sign in to        │                       │
│                  │ existing account     │                       │
│                  ├─────────────────────┤                        │
│                  │                     │                        │
│                  │ [User Icon]         │                        │
│                  │ First Name          │                        │
│                  │ [________________]  │                        │
│                  │                     │                        │
│                  │ [User Icon]         │                        │
│                  │ Last Name           │                        │
│                  │ [________________]  │                        │
│                  │                     │                        │
│                  │ [Mail Icon]         │                        │
│                  │ Email Address       │                        │
│                  │ [________________]  │                        │
│                  │                     │                        │
│                  │ [Lock Icon]         │                        │
│                  │ Password            │                        │
│                  │ [________________]  │ [Eye Icon]             │
│                  │                     │                        │
│                  │ [Lock Icon]         │                        │
│                  │ Confirm Password    │                        │ 
│                  │ [________________]  │ [Eye Icon]             │
│                  │                     │                        │
│                  │ [   Create Account   ]                       │
│                  │                     │                        │
│                  │ Already have account?│                       │
│                  │ Sign in             │                        │ 
│                  └─────────────────────┘                        │
│                                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

**Main Components:**
- Navbar
- Centered registration card
- First name input
- Last name input
- Email input
- Password input with show/hide toggle
- Confirm password input with show/hide toggle
- Create account button
- Login link

**Interactions:**
- All input fields: Text entry
- Password toggles: Show/hide password
- Create account: Validate and submit form
- Login link: Navigate to login page

**Navigation:**
- `/register` → Register (current)
- `/login` → Login page
- `/` → Home (after successful registration)

**Notes:**
- Validates password match
- Validates email format
- Shows error messages for validation failures
- Auto-generates username from email if not provided


## 4. Listings Page

**Screen Name:** Listings Page  
**Route:** `/listings`  
**Purpose:** Browse and filter all available product listings

**Wireframe (ASCII Layout):**
```
┌─────────────────────────────────────────────────────────────────┐
│ [Navbar: Logo | Search | Browse | Sell | Messages | Profile]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Browse All Listings                                            │
│  Find great deals on textbooks, electronics, and more           │
│                                                                 │
│  ┌──────────────┐  ┌──────────────────────────────────────┐     │
│  │              │  │  Search & Filters                    │     │
│  │  FILTERS     │  │  ────────────────────────────────────│     │
│  │              │  │                                      │     │
│  │  Category    │  │  [Search Icon] [Search Input]        │     │
│  │  [Dropdown] │  │                                       │     │
│  │              │  │  Results: 25 listings                │     │
│  │  Price Range │  │                                      │     │
│  │  Min: [___]  │  │  ┌────────┐ ┌────────┐ ┌────────┐    │     │
│  │  Max: [___]  │  │  │[Image] │ │[Image] │ │[Image] │    │     │
│  │              │  │  │Product │ │Product │ │Product │    │     │
│  │  [Clear]     │  │  │$XX.XX  │ │$XX.XX  │ │$XX.XX  │    │     │
│  │              │  │  │[ACTIVE]│ │[ACTIVE]│ │[SOLD]  │    │     │
│  │  [Clear All] │  │  │[View]  │ │[View]  │ │[View]  │    │     │
│  │              │  │  └────────┘ └────────┘ └────────┘    │     │
│  │              │  │                                      │     │
│  │              │  │  ┌────────┐ ┌────────┐ ┌────────┐    │     │
│  │              │  │  │[Image] │ │[Image] │ │[Image] │    │     │
│  │              │  │  │Product │ │Product │ │Product │    │     │
│  │              │  │  │$XX.XX  │ │$XX.XX  │ │$XX.XX  │    │     │
│  │              │  │  │[ACTIVE]│ │[ACTIVE]│ │[ACTIVE]│    │     │
│  │              │  │  │[View]  │ │[View]  │ │[View]  │    │     │
│  │              │  │  └────────┘ └────────┘ └────────┘    │     │
│  │              │  │                                      │     │
│  │              │  │  [< Previous] [1] [2] [3] [Next >]   │     │
│  │              │  │  Show: [10 ▼] per page               │     │  
│  └──────────────┘  └──────────────────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

**Main Components:**
- Navbar
- Page header with title and description
- Left sidebar: Filter panel
  - Category dropdown
  - Price range inputs (min/max)
  - Clear filter buttons
- Main content area:
  - Search bar
  - Results count
  - Product grid (3 columns)
  - Pagination controls
  - Page size selector

**Interactions:**
- Category filter: Dropdown selection
- Price filters: Numeric input
- Search bar: Real-time filtering
- Product cards: Navigate to details
- Pagination: Change page
- Page size: Change items per page
- Clear filters: Reset all filters

**Navigation:**
- `/listings` → Listings (current)
- `/listings/:id` → Product details
- `/listings?category=Textbooks` → Filtered listings

**Notes:**
- Filters out SOLD items from main view
- Client-side filtering and pagination
- Responsive: 1 col mobile, 2 cols tablet, 3 cols desktop
- Shows match percentage for semantic search results

## 5. Listing Details Page

**Screen Name:** Listing Details Page  
**Route:** `/listings/:id`  
**Purpose:** View detailed information about a specific product listing

**Wireframe (ASCII Layout):**

┌─────────────────────────────────────────────────────────────────┐
│ [Navbar: Logo | Search | Browse | Sell | Messages | Profile]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  [← Back to Listings]                                            │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │  ┌──────────────┐  Product Name                          │  │
│  │  │              │  $XX.XX                                 │  │
│  │  │              │  [ACTIVE] or [SOLD]                    │  │
│  │  │  [Image]     │                                         │  │
│  │  │              │  Category: Electronics                  │  │
│  │  │              │  Condition: Like New                    │  │
│  │  │              │                                         │  │
│  │  └──────────────┘  Description:                           │  │
│  │                    Lorem ipsum dolor sit amet...          │  │
│  │                    Full product description text...        │  │
│  │                                                          │  │
│  │  Seller Information:                                      │  │
│  │  [Avatar] Seller Name                                     │  │
│  │                                                          │  │
│  │  [Edit Listing] (if seller)                              │  │
│  │  [Mark as Sold] (if seller)                               │  │
│  │  [Report Listing] (if not seller)                        │  │
│  │  [Message Seller]                                         │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Main Components:**
- Navbar
- Back navigation link
- Product image (large)
- Product name
- Price
- Status badge (ACTIVE/SOLD)
- Category
- Condition
- Description text
- Seller information with avatar
- Action buttons:
  - Edit Listing (seller only)
  - Mark as Sold (seller only)
  - Report Listing (non-seller)
  - Message Seller

**Interactions:**
- Back link: Navigate to listings
- Edit button: Navigate to edit page (seller only)
- Mark as Sold: Update status to SOLD
- Report button: Open report modal
- Message Seller: Start chat conversation
- Product image: Click to view full size

**Navigation:**
- `/listings/:id` → Details (current)
- `/listings/:id/edit` → Edit listing (seller)
- `/listings` → Back to listings
- `/chat` → Chat page (after message)

**Notes:**
- Public page (no auth required to view)
- Conditional buttons based on user role
- Report modal opens on report button click
- SOLD status displayed prominently

---

## 6. Create Listing Page

**Screen Name:** Create Listing Page  
**Route:** `/create-listing`  
**Purpose:** Create a new product listing for sale

**Wireframe (ASCII Layout):**
```
┌─────────────────────────────────────────────────────────────────┐
│ [Navbar: Logo | Search | Browse | Sell | Messages | Profile]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│                    ┌─────────────────────┐                      │
│                    │   Create Listing     │                      │
│                    ├─────────────────────┤                      │
│                    │                     │                      │
│                    │ Title *             │                      │
│                    │ [________________]  │                      │
│                    │                     │                      │
│                    │ Description *       │                      │
│                    │ [________________]  │                      │
│                    │ [________________]  │                      │
│                    │ [________________]  │                      │
│                    │                     │                      │
│                    │ Price ($) *         │                      │
│                    │ [$] [________]      │                      │
│                    │                     │                      │
│                    │ Category *          │                      │
│                    │ [Select ▼]         │                      │
│                    │                     │                      │
│                    │ Condition *         │                      │
│                    │ [Select ▼]         │                      │
│                    │                     │                      │
│                    │ Photos              │                      │
│                    │ [Image Preview]     │                      │
│                    │ [Upload Image]      │                      │
│                    │                     │                      │
│                    │ [Cancel] [Create Listing]                  │
│                    └─────────────────────┘                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Main Components:**
- Navbar
- Centered form card
- Title input (required)
- Description textarea (required)
- Price input with $ icon (required)
- Category dropdown (required)
- Condition dropdown (required)
- Image upload section with preview
- Cancel button
- Create Listing button

**Interactions:**
- All inputs: Text entry and selection
- Image upload: File picker, preview image
- Cancel: Navigate back or to listings
- Create Listing: Validate and submit form

**Navigation:**
- `/create-listing` → Create (current)
- `/listings` → Listings (after cancel or success)
- `/listings/:id` → New listing details (after creation)

**Notes:**
- Protected route (requires authentication)
- Form validation on submit
- Image upload to S3
- Shows success toast on creation

---

## 7. Edit Listing Page

**Screen Name:** Edit Listing Page  
**Route:** `/listings/:id/edit`  
**Purpose:** Edit an existing product listing

**Wireframe (ASCII Layout):**
```
┌─────────────────────────────────────────────────────────────────┐
│ [Navbar: Logo | Search | Browse | Sell | Messages | Profile]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│                    ┌─────────────────────┐                      │
│                    │   Edit Listing       │                      │
│                    ├─────────────────────┤                      │
│                    │                     │                      │
│                    │ Title *             │                      │
│                    │ [Current Title____]  │                      │
│                    │                     │                      │
│                    │ Description *       │                      │
│                    │ [Current desc...]    │                      │
│                    │ [________________]  │                      │
│                    │                     │                      │
│                    │ Price ($) *         │                      │
│                    │ [$] [Current Price] │                      │
│                    │                     │                      │
│                    │ Category *          │                      │
│                    │ [Current Category ▼]│                      │
│                    │                     │                      │
│                    │ Condition *         │                      │
│                    │ [Current Condition▼]│                      │
│                    │                     │                      │
│                    │ Photos              │                      │
│                    │ [Current Image]     │                      │
│                    │ [X] [Upload New]    │                      │
│                    │                     │                      │
│                    │ [Cancel] [Save Changes]                   │
│                    └─────────────────────┘                      │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Main Components:**
- Navbar
- Centered form card
- Pre-filled form fields:
  - Title
  - Description
  - Price
  - Category
  - Condition
- Current image preview with remove option
- Upload new image button
- Cancel button
- Save Changes button

**Interactions:**
- Form fields: Edit existing values
- Image: View current, remove, or upload new
- Cancel: Navigate back to listing details
- Save Changes: Validate and submit updates

**Navigation:**
- `/listings/:id/edit` → Edit (current)
- `/listings/:id` → Listing details (after save or cancel)

**Notes:**
- Protected route (requires authentication)
- Only seller can edit their own listings
- Pre-fetches existing listing data
- Shows error if user is not the seller

---

## 8. Profile Page

**Screen Name:** Profile Page  
**Route:** `/profile`  
**Purpose:** View and manage user profile, listings, and account information

**Wireframe (ASCII Layout):**
```
┌─────────────────────────────────────────────────────────────────┐
│ [Navbar: Logo | Search | Browse | Sell | Messages | Profile]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │  Profile Information                                     │  │
│  │  ┌────────┐                                              │  │
│  │  │[Avatar]│  Full Name                                   │  │
│  │  │        │  email@example.com                           │  │
│  │  └────────┘  Member since: Month Year                     │  │
│  │              Total Sales: X                               │  │
│  │                                                          │  │
│  │  [Listings] [Settings]                                   │  │
│  │                                                          │  │
│  │  ──────────────────────────────────────────────────────  │  │
│  │                                                          │  │
│  │  My Listings                                             │  │
│  │                                                          │  │
│  │  ┌────────┐ ┌────────┐ ┌────────┐                      │  │
│  │  │[Image] │ │[Image] │ │[Image] │                      │  │
│  │  │Product │ │Product │ │Product │                      │  │
│  │  │$XX.XX  │ │$XX.XX  │ │$XX.XX  │                      │  │
│  │  │[ACTIVE]│ │[SOLD]  │ │[ACTIVE]│                      │  │
│  │  │[Edit]  │ │        │ │[Edit]  │                      │  │
│  │  └────────┘ └────────┘ └────────┘                      │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Main Components:**
- Navbar
- Profile header section:
  - User avatar
  - Full name
  - Email
  - Join date
  - Total sales count
- Tab navigation (Listings, Settings)
- Listings grid:
  - Product cards with images
  - Price
  - Status badges (ACTIVE/SOLD)
  - Edit button (for active listings)

**Interactions:**
- Tab navigation: Switch between Listings and Settings
- Product cards: Navigate to listing details
- Edit button: Navigate to edit page
- Avatar: Click to change (future feature)

**Navigation:**
- `/profile` → Profile (current)
- `/profile?tab=listings` → Listings tab
- `/profile?tab=settings` → Settings tab
- `/listings/:id` → Listing details
- `/listings/:id/edit` → Edit listing

**Notes:**
- Protected route (requires authentication)
- Fetches user data and listings from API
- Shows all listings including SOLD
- SOLD listings marked prominently, no edit button

---

## 9. Chat Page

**Screen Name:** Chat Page  
**Route:** `/chat`  
**Purpose:** View conversations and send messages to sellers/buyers

**Wireframe (ASCII Layout):**
```
┌─────────────────────────────────────────────────────────────────┐
│ [Navbar: Logo | Search | Browse | Sell | Messages | Profile]    │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                                                          │  │
│  │  Conversations                    Messages                │  │
│  │  ──────────────                  ──────────────          │  │
│  │                                                          │  │
│  │  ┌──────────────┐              ┌──────────────────────┐  │  │
│  │  │[Avatar] Name│              │                      │  │  │
│  │  │Last message │              │                      │  │  │
│  │  │[Unread: 2]  │              │  [Avatar] Seller    │  │  │
│  │  └──────────────┘              │  Hello, is this...  │  │  │
│  │                                │  10:30 AM           │  │  │
│  │  ┌──────────────┐              │                      │  │  │
│  │  │[Avatar] Name │              │  You                 │  │  │
│  │  │Last message │              │  Yes, it's available│  │  │
│  │  └──────────────┘              │  10:32 AM           │  │  │
│  │                                │                      │  │  │
│  │  ┌──────────────┐              │  [Avatar] Seller    │  │  │
│  │  │[Avatar] Name │              │  Great! When can... │  │  │
│  │  │Last message │              │  10:35 AM           │  │  │
│  │  └──────────────┘              │                      │  │  │
│  │                                │                      │  │  │
│  │                                │  [Type message...]   │  │  │
│  │                                │  [        Send      ]│  │  │
│  │                                └──────────────────────┘  │  │
│  │                                                          │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Main Components:**
- Navbar
- Split view layout:
  - Left panel: Conversations list
    - Conversation items with avatar, name, last message, unread count
  - Right panel: Active conversation
    - Conversation header with seller/buyer name
    - Message bubbles (sent/received)
    - Message input field
    - Send button

**Interactions:**
- Conversation items: Select conversation, load messages
- Message input: Type message
- Send button: Send message
- Messages: Auto-refresh or real-time updates

**Navigation:**
- `/chat` → Chat (current)
- `/listings/:id` → Listing details (from message)

**Notes:**
- Protected route (requires authentication)
- Real-time or polling-based message updates
- Unread message indicators
- Empty state when no conversations

---

## 10. Admin Login Page

**Screen Name:** Admin Login Page  
**Route:** `/admin`  
**Purpose:** Admin authentication to access admin dashboard

**Wireframe (ASCII Layout):**
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                   │
│                                                                   │
│                    ┌─────────────────────┐                      │
│                    │   Admin Login       │                      │
│                    ├─────────────────────┤                      │
│                    │                     │                      │
│                    │ [Mail Icon]         │                      │
│                    │ Email Address       │                      │
│                    │ [________________]  │                      │
│                    │                     │                      │
│                    │ [Lock Icon]         │                      │
│                    │ Password            │                      │
│                    │ [________________]  │ [Eye Icon]          │
│                    │                     │                      │
│                    │ [    Sign in    ]   │                      │
│                    │                     │                      │
│                    └─────────────────────┘                      │
│                                                                   │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

**Main Components:**
- Centered login card (no navbar)
- Email input field
- Password input field with show/hide toggle
- Sign in button

**Interactions:**
- Email input: Text entry
- Password input: Text entry (masked)
- Eye icon: Toggle password visibility
- Sign in: Authenticate admin user

**Navigation:**
- `/admin` → Admin login (current)
- `/admin/dashboard` → Admin dashboard (after login)

**Notes:**
- Separate from user login
- Default credentials: admin@campusmarket.com / admin123
- No navbar on admin pages

---

## 11. Admin Dashboard

**Screen Name:** Admin Dashboard  
**Route:** `/admin/dashboard`  
**Purpose:** Overview of platform statistics and key metrics

**Wireframe (ASCII Layout):**
```
┌─────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ [TopBar: Admin Name | Logout]                       │
├───────────┼─────────────────────────────────────────────────────┤
│           │                                                     │
│ Dashboard │  Overview                                           │
│ Users     │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────┐│
│ Listings  │  │Total     │ │Active    │ │Total     │ │Open    ││
│ Reports   │  │Users     │ │Users     │ │Listings │ │Reports ││
│           │  │  150     │ │  120     │ │  500     │ │   5    ││
│           │  └──────────┘ └──────────┘ └──────────┘ └────────┘│
│           │                                                     │
│           │  Recent Activity                                    │
│           │  ┌──────────────────────────────────────────────┐  │
│           │  │ • New user registered: John Doe             │  │
│           │  │ • Listing created: MacBook Pro               │  │
│           │  │ • Report submitted: Listing #123            │  │
│           │  └──────────────────────────────────────────────┘  │
│           │                                                     │
└───────────┴─────────────────────────────────────────────────────┘
```

**Main Components:**
- Sidebar navigation
- Top bar with admin name and logout
- Overview section with 4 stat cards:
  - Total Users
  - Active Users
  - Total Listings
  - Open Reports
- Recent Activity feed

**Interactions:**
- Sidebar links: Navigate to different admin pages
- Stat cards: Click to view detailed page
- Logout: Sign out admin user

**Navigation:**
- `/admin/dashboard` → Dashboard (current)
- `/admin/users` → Users page
- `/admin/listings` → Listings page
- `/admin/reports` → Reports page
- `/admin` → Admin login (after logout)

**Notes:**
- Protected admin route
- Stats load from API
- Real-time or periodic updates

---

## 12. Admin Users Page

**Screen Name:** Admin Users Page  
**Route:** `/admin/users`  
**Purpose:** View and manage all user accounts

**Wireframe (ASCII Layout):**
```
┌─────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ [TopBar: Admin Name | Logout]                       │
├───────────┼─────────────────────────────────────────────────────┤
│           │                                                     │
│ Dashboard │  Users                                              │
│ Users     │  ┌──────────────────────────────────────────────┐  │
│ Listings  │  │ ID │ Username │ Email      │ Status │ Actions│  │
│ Reports   │  ├────┼──────────┼────────────┼────────┼────────┤  │
│           │  │ 1  │ john_doe │ john@...   │ ACTIVE │ [View] │  │
│           │  │ 2  │ jane_sm │ jane@...   │ ACTIVE │ [View] │  │
│           │  │ 3  │ bob_wil │ bob@...    │ BANNED │ [View] │  │
│           │  └──────────────────────────────────────────────┘  │
│           │                                                     │
│           │  [< Previous] [1] [2] [3] [Next >]                  │
│           │                                                     │
└───────────┴─────────────────────────────────────────────────────┘
```

**Main Components:**
- Sidebar navigation
- Top bar
- Users table with columns:
  - ID
  - Username
  - Email
  - Status (ACTIVE/BANNED)
  - Actions (View button)
- Pagination controls

**Interactions:**
- Table rows: View user details
- View button: Open user details modal or page
- Pagination: Navigate between pages
- Status: Filter by status (future)

**Navigation:**
- `/admin/users` → Users (current)
- `/admin/dashboard` → Dashboard
- `/admin/listings` → Listings
- `/admin/reports` → Reports

**Notes:**
- Protected admin route
- Table pagination
- Status filtering (future feature)

---

## 13. Admin Listings Page

**Screen Name:** Admin Listings Page  
**Route:** `/admin/listings`  
**Purpose:** View and manage all product listings

**Wireframe (ASCII Layout):**
```
┌─────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ [TopBar: Admin Name | Logout]                       │
├───────────┼─────────────────────────────────────────────────────┤
│           │                                                     │
│ Dashboard │  Listings                                           │
│ Users     │  ┌──────────────────────────────────────────────┐   │
│ Listings  │  │ID│Product│Price│Seller│Condition│Status│Actions│ │
│ Reports   │  ├──┼───────┼─────┼──────┼─────────┼──────┼───────┤ │
│           │  │1 │MacBook│$500│John  │Like New │ACTIVE│[Delete]│ │
│           │  │2 │Textbk │$30 │Jane  │Good     │ACTIVE│[Delete]│ │
│           │  │3 │Desk   │$100│Bob   │Fair     │SOLD  │[Delete]│ │
│           │  └──────────────────────────────────────────────┘   │
│           │                                                     │
│           │  [< Previous] [1] [2] [3] [Next >]                  │
│           │                                                     │
│           │  [Delete Confirmation Dialog]                       │
│           │  Are you sure you want to delete this listing?      │
│           │  [Cancel] [Delete]                                  │
│           │                                                     │
└───────────┴─────────────────────────────────────────────────────┘

**Main Components:**
- Sidebar navigation
- Top bar
- Listings table with columns:
  - ID
  - Product name
  - Price
  - Seller ID
  - Condition
  - Status
  - Actions (Delete button)
- Pagination controls
- Delete confirmation dialog

**Interactions:**
- Delete button: Open confirmation dialog
- Confirmation dialog: Confirm or cancel deletion
- Pagination: Navigate between pages
- Table: Sortable columns (future)

**Navigation:**
- `/admin/listings` → Listings (current)
- `/admin/dashboard` → Dashboard
- `/admin/users` → Users
- `/admin/reports` → Reports

**Notes:**
- Protected admin route
- Delete removes listing from database
- Toast notifications for success/error
- Instant UI update after deletion

## 14. Admin Reports Page

**Screen Name:** Admin Reports Page  
**Route:** `/admin/reports`  
**Purpose:** View and manage user-submitted reports

**Wireframe (ASCII Layout):**
┌─────────────────────────────────────────────────────────────────┐
│ [Sidebar] │ [TopBar: Admin Name | Logout]                       │
├───────────┼─────────────────────────────────────────────────────┤
│           │                                                     │
│ Dashboard │  Reports                                            │
│ Users     │  ┌──────────────────────────────────────────────┐   │
│ Listings  │  │ID│Listing│Reporter│Reason│Date│Status│Actions│   │
│ Reports   │  ├──┼───────┼────────┼──────┼────┼──────┼───────┤   │
│           │  │1 │#123   │User A  │Spam  │... │OPEN  │[View] │   │  
│           │  │2 │#456   │User B  │Fake │... │OPEN  │[View]  │   │
│           │  │3 │#789   │User C  │Other│... │CLOSED│[View]  │   |
│           │  └──────────────────────────────────────────────┘   │
│           │                                                     │
│           │  [< Previous] [1] [2] [3] [Next >]                  │
│           │                                                     │
└───────────┴─────────────────────────────────────────────────────┘

**Main Components:**
- Sidebar navigation
- Top bar
- Reports table with columns:
  - ID
  - Listing ID
  - Reporter username
  - Reason
  - Date
  - Status (OPEN/CLOSED)
  - Actions (View/Resolve)
- Pagination controls

**Interactions:**
- View button: View report details
- Resolve button: Mark report as resolved
- Status filter: Filter by OPEN/CLOSED
- Pagination: Navigate between pages

**Navigation:**
- `/admin/reports` → Reports (current)
- `/admin/dashboard` → Dashboard
- `/admin/users` → Users
- `/admin/listings` → Listings

**Notes:**
- Protected admin route
- Reports submitted by users
- Status tracking (OPEN/CLOSED)
- Link to reported listing

## 15. 404 Error Page

**Screen Name:** 404 Error Page  
**Route:** `*` (catch-all)  
**Purpose:** Display error message for non-existent pages

**Wireframe (ASCII Layout):**
```
┌─────────────────────────────────────────────────────────────────┐
│ [Navbar: Logo | Search | Browse | Login/Profile]                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│                                                                 │
│                          404                                    │
│                    Page not found                               │
│                                                                 │
│                    [Go to Home]                                 │
│                                                                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘

**Main Components:**
- Navbar
- Centered error message
- 404 heading
- "Page not found" text
- "Go to Home" button

**Interactions:**
- Go to Home button: Navigate to home page

**Navigation:**
- `*` → 404 (current)
- `/` → Home page

**Notes:**
- Catch-all route for undefined paths
- Simple error display
- Easy navigation back to home

## Navigation Flow Diagram

                    ┌─────────┐
                    │  Home   │
                    └────┬────┘
                         │
        ┌────────────────┼────────────────┐
        │                │                │
   ┌────▼────┐      ┌────▼────┐     ┌────▼────┐
   │ Listings│      │  Login  │     │ Register│
   └────┬────┘      └────┬────┘     └────┬────┘
        │                │                │
        │                └────────┬───────┘
        │                         │
   ┌────▼────────┐          ┌─────▼─────┐
   │Listing      │          │  Profile  │
   │Details      │          └─────┬─────┘
   └────┬────────┘                │
        │                         │
   ┌────▼────────┐          ┌─────▼─────┐
   │Create/Edit  │          │   Chat    │
   │Listing      │          └───────────┘
   └─────────────┘
   
   Admin Flow:
   ┌──────────┐
   │Admin     │
   │Login     │
   └────┬─────┘
        │
   ┌────▼──────────┐
   │Admin          │
   │Dashboard      │
   └────┬──────────┘
        │
   ┌────┼────┬────────┐
   │    │    │        │
┌──▼─┐ ┌▼──┐ ┌▼────┐ ┌▼────┐
│User│ │List│ │Report│ │Dash │
│s   │ │ings│ │s     │ │board│
└────┘ └────┘ └──────┘ └─────┘

## Component Hierarchy
App
├── Navbar (all pages except admin)
│   ├── Logo
│   ├── Search Bar
│   └── Navigation Links
├── HomePage
│   ├── Hero Section
│   ├── Search Bar
│   ├── Category Icons
│   └── Featured Products Grid
├── LoginPage
│   └── Login Form
├── RegisterPage
│   └── Registration Form
├── ListingsPage
│   ├── Filter Sidebar
│   ├── Search Bar
│   ├── Product Grid
│   └── Pagination
├── ListingDetailsPage
│   ├── Product Image
│   ├── Product Info
│   ├── Seller Info
│   └── Action Buttons
├── CreateListingPage
│   └── Listing Form
├── EditListingPage
│   └── Pre-filled Listing Form
├── ProfilePage
│   ├── Profile Header
│   ├── Tab Navigation
│   └── Listings Grid
├── ChatPage
│   ├── Conversations List
│   └── Message Thread
└── AdminApp
    ├── Sidebar
    ├── TopBar
    └── Admin Pages (Dashboard, Users, Listings, Reports)


## Notes on Design Patterns

1. **Consistent Navigation:** Navbar appears on all public/protected pages
2. **Modal Patterns:** Report listing, delete confirmations use modals
3. **Toast Notifications:** Success/error messages appear as toasts
4. **Loading States:** Spinners shown during API calls
5. **Error States:** Clear error messages with retry options
6. **Empty States:** Helpful messages when no data available
7. **Responsive Design:** Mobile-first, adapts to tablet/desktop
8. **Protected Routes:** Authentication required for certain pages
9. **Role-Based Access:** Different UI for sellers, buyers, admins
10. **Real-time Updates:** Chat and notifications update dynamically


## End of Wireframes Document

