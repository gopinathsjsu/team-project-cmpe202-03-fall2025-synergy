# Sprint 2 – Campus Marketplace (Spartan Exchange)

**Sprint Duration:** September 22, 2025 – October 5, 2025  
**Sprint Length:** 2 Weeks  
**Team:** CMPE 202 – Spartan Exchange

---

# 1. Sprint Goal

The primary objective of Sprint 2 was to build **core marketplace functionality** on top of the foundation established in Sprint 1. This sprint focused on implementing real backend features, enabling user flows, and connecting the UI to the live API.

Key goals:

- Implement **authentication UI** and basic role-based routing  
- Build **CRUD operations for listings**  
- Integrate **frontend with Spring Boot APIs**  
- Finalize **PostgreSQL schema** (Listings, Users, Chats, Reports)  
- Add **seller-side product creation and management**  
- Implement **admin moderation** for listings  
- Start wiring the **chat backend** for buyer–seller conversations  

---

# 2. Sprint 2 Backlog (User Stories)

| User Story ID | User Story                                                                                           | Task                                                                                  | Status      |
|---------------|-------------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------|-------------|
| **US-7**      | As a user, I need authentication UI so I can log in and access my account.                           | Build signup/login UI                                                                 | ✔ Completed |
|               |                                                                                                       | Implement role-based routing on frontend                                              | ✔ Completed |
| **US-8**      | As a seller, I need to create and manage product listings.                                            | Build create-listing UI                                                               | ✔ Completed |
|               |                                                                                                       | Enable listing creation with validation (POST)                                        | ✔ Completed |
|               |                                                                                                       | Implement edit/delete listing flows                                                   | ✔ Completed |
| **US-9**      | As a buyer, I need to view live listings backed by real data.                                         | Connect homepage and product details to backend listings API                          | ✔ Completed |
| **US-10**     | As an admin, I need tools to moderate listings and remove inappropriate content.                      | Implement admin review / moderation API                                               | ✔ Completed |
|               |                                                                                                       | Build admin moderation UI & actions (approve, remove, mark as reviewed)              | ✔ Completed |
| **US-11**     | As a team member, I need a complete database schema to support listings, users, chat and reports.     | Finalize DB schema (Listings, Users, Chats, Reports)                                  | ✔ Completed |
| **US-12**     | As a buyer/seller, I want chat functionality so I can communicate about a listing.                    | Implement chat backend models + basic messaging endpoints                             | In Progress |
|               |                                                                                                       | Connect chat UI to backend                                                            | In Progress |

---

# 3. Task Board & Burndown Summary

### 3.1 Task Board Movement (Kanban Style)

| **TO DO**                                                                                          | **DOING**                                                                | **DONE**                                                                                               |
|----------------------------------------------------------------------------------------------------|---------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------|
| 🟥 Implement report management backend (supports US-10, US-11)                                      | 🟦 Chat backend API (Yaswanth – US-12)                                    | 🟩 Authentication UI + role-based routing (Sriya – US-7)                                                |
| 🟥 Connect chat UI to backend (US-12)                                                              | 🟪 Seller listing form validation (Mohit – US-8)                           | 🟦 CRUD endpoints for listings (create, edit, delete) – US-8                                            |
| 🟦 Deploy PostgreSQL on AWS RDS (US-11 extension / prep for Sprint 3)                              | 🟩 Homepage → product details live data integration (Sriya – US-9)         | 🟦 Admin review + delete listing API wiring (Mohit – US-10)                                             |
| 🟪 Design extended admin moderation flow (reports, flags)                                         | 🟦 Semantic search & filter planning (Siddharth – US-9 extension)          | 🟦 Database schema finalized (Users, Listings, Chats, Reports) – US-11                                  |
|                                                                                                    |                                                                           | 🟪 Completed seller UI (create/edit/delete flows) – US-8                                               |
|                                                                                                    |                                                                           | 🟩 Listings grid updated to real data – US-9                                                            |
|                                                                                                    |                                                                           | 🟩 Admin dashboard integrated with moderation endpoints – US-10                                        |

### Interpretation

- All **core marketplace stories (US-7 → US-11)** moved to **Done**.  
- **Chat (US-12)** remains **In Progress** and will continue in Sprint 3.  
- Authentication is available on the **UI side**, with backend JWT scheduled for Sprint 3.  

---

### 3.2 Sprint 2 Burndown Summary

<img width="1979" height="980" alt="image" src="https://github.com/user-attachments/assets/eaeeb57f-43ff-4fdb-8d7d-8d81253e5b94" />

---

# 4. Weekly Scrum Reports

Below are each team member’s weekly Scrum updates answering:

1. **What tasks did I work on / complete?**  
2. **What am I planning to work on next?**  
3. **What tasks are blocked waiting on another team member?**  

---

## WEEK 3 (Sept 22 – Sept 28)

### **Sriyavarma Saripella**
**1. Worked on**
- Implemented login/signup UI (frontend only)
- Added role-based routing between buyer, seller, and admin views
- Integrated homepage and product details pages with live listing data from backend
  
**2. Planning next**
- Add seller-side listing creation UI
- Improve route guards once backend JWT is available

**3. Blocked on**
- Waiting for backend JWT authentication endpoints (planned for Sprint 3)

---

### **Mohit Reddy**
**1. Worked on**
- Created seller listing form with validation (title, price, category, condition, images)
- Hooked create, edit, and delete listing flows to backend CRUD endpoints
- Updated admin dashboard table to show key listing fields and status

**2. Planning next**
- Build basic report management and moderation tools
- Fix edge cases in seller flows (failed updates, validation errors)

**3. Blocked on**
- Awaiting finalized report schema and flags from backend (US-11 extension)  

---

### **Dokala Yaswanth**
**1. Worked on**
- Implemented chat models and messaging schema in the backend draft
- Designed chat API endpoints for creating chat sessions and posting messages
- Updated chat UI layout to align with backend message structure

**2. Planning next**
- Wire chat UI to backend endpoints
- Decide between WebSocket or polling approach for next sprint

**3. Blocked on**
- Pending final chat table migration and deployment to the shared database 

---

### **Siddharth Jetling**
**1. Worked on**
- Finalized PostgreSQL schema for Listings, Users, Chats, and Reports
- Connected listing CRUD endpoints to the database
- Implemented server-side filtering (category, price range, keyword) 

**2. Planning next**
- Prepare for JWT backend authentication (Sprint 3)
- Optimize keyword search performance and indexing

**3. Blocked on**
- Needs a larger sample dataset to tune search and filter performance

---

## WEEK 4 (Sept 29 – Oct 5)

### **Sriyavarma Saripella**
**1. Worked on**
- Completed seller UI for creating and editing listings
- Refined product details page to display all fields coming from backend
- Polished homepage layout with real data and loading states

**2. Planning next**
- Start designing enhanced search UI (filters, sort dropdowns)
- Support admin UI polish in the next sprint

**3. Blocked on**
- Waiting for updated filter/sort parameters from backend

---

### **Mohit Reddy**
**1. Worked on**
- Completed admin review and moderation UI (approve, hide, mark as flagged)
- Added basic report management prototype to the admin dashboard
- Verified seller CRUD flows end-to-end with the database

**2. Planning next**
- Create structured admin tables with action buttons (Approve / Reject / Hide)
- Add visual states for reviewed / flagged listings
- Improve error messages and empty-state handling for admin views

**3. Blocked on**
- Backend support for advanced report filters (date range, status)


---

### **Dokala Yaswanth**
**1. Worked on**
- Finalized chat message UI (grouping, timestamps, sender alignment)
- Connected chat page to draft message endpoints in backend (local environment)
- Tested basic buyer–seller conversation flows in dev mode

**2. Planning next**
- Implement chatbot flow for search assistance in Sprint 3
- Add notification hooks once backend events are available

**3. Blocked on**
- Needs stable, deployed chat endpoints before enabling real-time features

---

### **Siddharth Jetling**
**1. Worked on**
- Completed listing CRUD integration with database for all flows
- Added keyword search and category/price filters at API layer
- Finalized admin endpoints used by moderation dashboard 

**2. Planning next**
- Start AWS deployment planning for backend and database (Sprint 3)
- Explore caching for popular listing queries

**3. Blocked on**
- Waiting on final decision for AWS environment and credentials

---

# 6. Sprint 2 Review

### What We Planned
- Implement authentication UI and role-based routing  
- Build seller listing CRUD functionality  
- Connect homepage and product details to backend APIs  
- Finalize PostgreSQL schema (Listings, Users, Chats, Reports)  
- Implement admin moderation tools (approve/remove/flag)  
- Begin backend chat functionality  
- Prepare groundwork for AWS deployment  
- Improve overall UI consistency and page linking  

---

### What We Completed
- **Authentication UI** (login/signup) with **role-based routing on frontend** (US-7)  
- **Seller listing CRUD** (create, edit, delete) with validation and database integration (US-8)  
- **Live homepage + product details** connected with backend Spring Boot listings API (US-9)  
- **Admin moderation** backend endpoints + UI actions (approve, hide, flag) (US-10)  
- **Admin dashboard tables** created with action buttons (Approve/Reject/Flag) and status states  
- **Final PostgreSQL schema** implemented (Listings, Users, Chat, Reports) (US-11)  
- **Chat backend groundwork**: models, endpoints, and early UI connected to local backend (US-12 – partially completed)  
- **Seller workflows** polished (UI + DB consistency + routing)  

---

### What Was Not Completed
- Backend **JWT authentication** (POST `/auth/login`, token validation, security filters) – moved to **Sprint 3**  
- Complete buyer–seller chat workflow (UI + backend + real-time support)  
- Chatbot search assistant integration  
- Full admin reporting system (filters, date range, sorting)  

---

### Summary of Sprint 2
Sprint 2 delivered the **core marketplace features** that convert the platform from a static system (Sprint 1) into a **functional, data-driven application**. Sellers can now create and manage listings, buyers can browse real items, and admins have moderation control. The finalized schema and API infrastructure enable strong development velocity in Sprint 3.

While chat and backend authentication were partially completed, they are positioned as the primary focus for the next sprint.

---

# 7. Sprint 2 Retrospective

### What Went Well
- Smooth collaboration between frontend and backend teams  
- Seller CRUD and admin moderation implemented efficiently  
- Strong improvements in routing, UI structure, and shared components  
- Completed PostgreSQL schema enabled smooth backend development  
- Admin dashboard now fully functional with actions  
- Team maintained steady commit activity and resolved dependencies quickly  

---

### What Could Be Improved
- JWT backend authentication was pushed to Sprint 3 due to late start  
- Chat backend planning should begin earlier in future sprints  
- Admin reporting features needed clearer backend requirements  
- Some API formats were modified during the sprint causing UI rework  
- Search and filtering optimization requires more tuning and data indexing  

---

### Action Items for Sprint 3
- Complete **JWT backend authentication** and secure all routes  
- Finalize **full chat system** (UI + backend + real-time messaging)  
- Implement **chatbot search assistant** for item discovery  
- Expand **report management** and add admin filters  
- Deploy backend + PostgreSQL to AWS (EC2 + RDS)  
- Improve search and filter performance with indexing/caching  
- Continue UI polishing and add better loading/error states  

**End of Sprint 2 Report**
