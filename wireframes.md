UI Wireframes – Spartan Exchange Campus Marketplace

Complete text-based wireframes for all screens in the application.

1. Home Page

Screen Name: Home Page
Route: /
Purpose: Landing page showcasing marketplace, featured products, and category navigation

Wireframe (ASCII Layout)
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
│  │ Product Name    Product Name    Product Name             │   │
│  │ $XX.XX          $XX.XX          $XX.XX                   │   │
│  │ [View Details]  [View Details]  [View Details]           │   │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  [Browse All Listings →]                                        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘


Main Components:

Navbar with logo, search, navigation links

Hero message

Search bar

Category icons

Featured products grid

CTA button (“Browse All Listings”)

Interactions:

Search

Category filter

Product details navigation

Browse all listings

Navigation:
/ → Home
/listings → Listings
/listings/:id → Product details
/login → Login

Notes:
Public page, responsive layout, featured items pulled from API.

2. Login Page

Screen Name: Login Page
Route: /login

Wireframe
┌─────────────────────────────────────────────────────────────────┐
│ [Navbar: Logo | Search Bar | Browse | Login]                    │
├─────────────────────────────────────────────────────────────────┤
│                    ┌─────────────────────┐                      │
│                    │   Welcome Back      │                      │
│                    │ Sign in to continue │                      │
│                    ├─────────────────────┤                      │
│                    │ Email Address       │                      │
│                    │ [________________]  │                      │
│                    │ Password            │                      │
│                    │ [________________]  │ [Eye Icon]          │
│                    │ [ ] Remember me     │                      │
│                    │ [    Sign in    ]   │                      │
│                    │ Don't have account? │                      │
│                    │ Create one now      │                      │
│                    └─────────────────────┘                      │
└─────────────────────────────────────────────────────────────────┘


Main Components:
Email + password inputs, checkbox, sign-in button, link to register.

Notes:
Redirects authenticated users, shows error messages, supports admin credentials.

3. Register Page

Route: /register

Wireframe
┌─────────────────────────────────────────────────────────────────┐
│ [Navbar: Logo | Search Bar | Browse | Login]                    │
├─────────────────────────────────────────────────────────────────┤
│                  ┌─────────────────────┐                        │
│                  │ Create your account │                        │
│                  ├─────────────────────┤                        │
│                  │ First Name          │                        │
│                  │ [________________]  │                        │
│                  │ Last Name           │                        │
│                  │ [________________]  │                        │
│                  │ Email Address       │                        │
│                  │ [________________]  │                        │
│                  │ Password            │                        │
│                  │ [________________]  │ [Eye Icon]             │
│                  │ Confirm Password    │                        │
│                  │ [________________]  │ [Eye Icon]             │
│                  │ [ Create Account ]  │                        │
│                  │ Already have account? Sign in                │
│                  └─────────────────────┘                        │
└─────────────────────────────────────────────────────────────────┘


Notes:
Validations, password match, email format checking.

4. Listings Page

Route: /listings

Wireframe
┌─────────────────────────────────────────────────────────────────┐
│ [Navbar: Logo | Search | Browse | Sell | Messages | Profile]    │
├─────────────────────────────────────────────────────────────────┤
│  Browse All Listings                                             │
│  Find great deals on textbooks, electronics, and more            │
│                                                                   │
│  ┌──────────────┐  ┌──────────────────────────────────────┐     │
│  │  FILTERS     │  │  Search & Filters                    │     │
│  │ Category     │  │ [Search Icon] [Search Input]         │     │
│  │ Price Range  │  │ Results: 25 listings                  │     │
│  │ [Clear All]  │  │ Product Grid (3 columns)              │     │
│  └──────────────┘  │ Pagination / Page Size Selector       │     │
│                     └──────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘


Notes:
Client-side filtering, hides SOLD items by default, responsive.

5. Listing Details Page

Route: /listings/:id

Wireframe
┌─────────────────────────────────────────────────────────────────┐
│ [Navbar]                                                        │
├─────────────────────────────────────────────────────────────────┤
│ [← Back]                                                        │
│ ┌──────────────────────────────────────────────────────────┐    │
│ │ [Image]   Product Name  $XX.XX [ACTIVE/SOLD]             │    │
│ │ Category, Condition                                     │    │
│ │ Description                                             │    │
│ │ Seller: [Avatar Name]                                   │    │
│ │ [Edit Listing] [Mark as Sold] [Report Listing] [Message]│    │
│ └──────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘

6. Create Listing Page

Route: /create-listing

Wireframe
┌─────────────────────────────────────────────────────────────────┐
│ [Navbar]                                                        │
├─────────────────────────────────────────────────────────────────┤
│     ┌──────────────────────────────────────────────┐            │
│     │ Title *        [______________]              │            │
│     │ Description *  [______________]              │            │
│     │ Price *        [$][__________]               │            │
│     │ Category *     [Select ▼]                    │            │
│     │ Condition *    [Select ▼]                    │            │
│     │ Photos         [Preview] [Upload Image]       │           │
│     │ [Cancel] [Create Listing]                    │            │
│     └──────────────────────────────────────────────┘            │
└─────────────────────────────────────────────────────────────────┘

7. Edit Listing Page

Route: /listings/:id/edit

Wireframe
┌─────────────────────────────────────────────────────────────────┐
│ [Navbar]                                                        │
├─────────────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────────────┐   │
│  │ Title        [Current Value]                             │   │
│  │ Description  [Current Value...]                         │   │
│  │ Price        [$][Current]                                │   │
│  │ Category     [Current ▼]                                 │   │
│  │ Condition    [Current ▼]                                 │   │
│  │ Photos       [Current Image] [X] [Upload New]            │   │
│  │ [Cancel] [Save Changes]                                   │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

8. Profile Page

Route: /profile

Wireframe
┌─────────────────────────────────────────────────────────────────┐
│ [Navbar]                                                        │
├─────────────────────────────────────────────────────────────────┤
│ ┌────────────────────────────────────────────────────────────┐  │
│ │ [Avatar]  Full Name | Email | Member since | Sales Count  │  │
│ │ [Listings] [Settings]                                      │  │
│ │ My Listings Grid (ACTIVE/SOLD badges, Edit buttons)        │  │
│ └────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

9. Chat Page

Route: /chat

Wireframe
┌─────────────────────────────────────────────────────────────────┐
│ [Navbar]                                                        │
├─────────────────────────────────────────────────────────────────┤
│ ┌──────── Conversations ───────┐ ┌──────────── Messages ───────┐│
│ │ List of conversations        │ │ Message thread               ││
│ │ with avatars + unread count  │ │ Input box + Send            ││
│ └──────────────────────────────┘ └──────────────────────────────┘│
└─────────────────────────────────────────────────────────────────┘

10. Admin Login Page

Route: /admin

Wireframe
┌─────────────────────────────────────────────────────────────────┐
│                     ┌─────────────────────┐                     │
│                     │     Admin Login     │                     │
│                     ├─────────────────────┤                     │
│                     │ Email [__________]  │                     │
│                     │ Pass  [__________]  │                     │
│                     │ [ Sign In ]         │                     │
│                     └─────────────────────┘                     │
└─────────────────────────────────────────────────────────────────┘

11. Admin Dashboard

Route: /admin/dashboard

Wireframe
┌─────────────────────────────────────────────────────────────────┐
│ [Sidebar] | [TopBar: Admin | Logout]                            │
├───────────┼─────────────────────────────────────────────────────┤
│ Dashboard │  Stats: Total Users | Active Users | Listings | Reports
│ Users     │  Recent Activity Feed
│ Listings  │
│ Reports   │
└───────────┴─────────────────────────────────────────────────────┘

12. Admin Users Page

Route: /admin/users

Wireframe
┌─────────────────────────────────────────────────────────────────┐
│ [Sidebar] | [TopBar]                                             │
├───────────┼─────────────────────────────────────────────────────┤
│ Users     │ ID | Username | Email | Status | Actions [View]     │
│           │ Pagination                                        │  │
└───────────┴─────────────────────────────────────────────────────┘

13. Admin Listings Page

Route: /admin/listings

Wireframe
┌─────────────────────────────────────────────────────────────────┐
│ [Sidebar] | [TopBar]                                             │
├───────────┼─────────────────────────────────────────────────────┤
│ Listings  │ ID | Product | Price | Seller | Condition | Status | Delete
│           │ Pagination                                         │
│           │ Delete Confirmation Modal                          │
└───────────┴─────────────────────────────────────────────────────┘

14. Admin Reports Page

Route: /admin/reports

Wireframe
┌─────────────────────────────────────────────────────────────────┐
│ [Sidebar] | [TopBar]                                             │
├───────────┼─────────────────────────────────────────────────────┤
│ Reports   │ ID | Listing | Reporter | Reason | Date | Status | View
│           │ Pagination                                         │
└───────────┴─────────────────────────────────────────────────────┘

15. 404 Error Page

Route: *

Wireframe
┌─────────────────────────────────────────────────────────────────┐
│ [Navbar]                                                        │
├─────────────────────────────────────────────────────────────────┤
│                              404                                │
│                        Page not found                           │
│                        [ Go to Home ]                           │
└─────────────────────────────────────────────────────────────────┘

