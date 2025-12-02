# Sprint 1 – Campus Marketplace (Spartan Exchange)

**Sprint Duration:** September 8, 2025 – September 21, 2025  
**Sprint Length:** 2 Weeks  
**Team:** CMPE 202 – Spartan Exchange

---

# 1. Sprint Goal

The objective of Sprint 1 was to establish the **foundation** of the Campus Marketplace project by:

- Finalizing the technology stack and project structure  
- Setting up frontend and backend scaffolding  
- Designing complete UI wireframes  
- Creating the initial PostgreSQL database schema  
- Implementing a basic homepage using mock API data  
- Establishing GitHub workflow and Scrum practices  

This sprint focuses entirely on setting up the groundwork needed for future development.

# 2. Sprint 1 Backlog (User Stories)

| User Story ID | User Story                                                                                           | Task                                                                           | Status      |
|---------------|-------------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------|-------------|
| **US-1**      | As a developer, I need a clean and consistent project structure so the team can develop in parallel. | Initialize repository & project folders                                        | ✔ Completed |
| **US-2**      | As a backend engineer, I need a functioning Spring Boot service to start building APIs.              | Scaffold Spring Boot backend                                                   | ✔ Completed |
|               |                                                                                                       | Set up listings API base structure                                             | ✔ Completed |
| **US-3**      | As a frontend engineer, I need a working UI framework with routing.                                   | Scaffold Vite + React project                                                  | ✔ Completed |
|               |                                                                                                       | Configure React Router & create placeholder pages                              | ✔ Completed |
| **US-4**      | As an admin, I need an initial dashboard layout so I can begin overseeing marketplace activity.       | Build admin dashboard UI skeleton                                              | ✔ Completed |
| **US-5**      | As a team, we need shared state management for consistent behavior across components.                 | Create and integrate React contexts                                            | ✔ Completed |
| **US-6**      | As a backend engineer, I need database connectivity to begin storing listings and user data.          | Initial DB setup & connectivity testing                                        | ✔ Completed |

---

# 3. Task Board & Burndown Summary

### 3.1 Task Board Movement (Kanban Style)

| **TO DO**                                                                                  | **DOING**                                                                  | **DONE**                                                                                     |
|--------------------------------------------------------------------------------------------|-----------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|
| 🟥 Define seller listing requirements (US-2)                                                | 🟩 Homepage UI development (Sriya – based on US-3)                          | 🟦 Project repository & folder structure initialized (US-1)                                   |
| 🟪 Define product details fields for item view (US-3 prep)                                  | 🟪 Product Details UI layout & routing (Sriya – US-3)                       | 🟦 Spring Boot backend scaffolded (US-2)                                                      |
| 🟥 Prepare API routes needed for Sprint 2 (supports US-2, US-3, US-6)                       | 🟥 Chat UI skeleton & message flow design (Yaswanth)                        | 🟦 Listings API base structure created (US-2)                                                 |
| 🟩 Finalize DB attribute list (US-6 – Siddharth)                                            | 🟦 Semantic search & filter planning (Siddharth – US-6 extension)           | 🟦 Initial PostgreSQL schema drafted (Users, Listings, Messages) – (US-6)                     |
| 🟪 Prepare chatbot interaction plan (future chat work)                                      |                                                                             | 🟪 Full UI wireframes for all screens completed (US-5)                                        |
|                                                                                            |                                                                             | 🟩 Homepage integrated with mock API data (Sriya + Mohit – US-3 support)                      |
|                                                                                            |                                                                             | 🟩 Product details routing created with params (Sriya – US-3)                                  |
|                                                                                            |                                                                             | 🟪 Initial chatbot research & direction completed (Yaswanth)                                   |


### 3.2 Burndown Summary
<img width="1580" height="780" alt="image" src="https://github.com/user-attachments/assets/25204dc6-2966-4390-8cc2-892c7d101248" />
The Sprint 1 burndown is based on 6 user stories (US-1 to US-6), estimated at 4 story points each
for a total of **24 story points**.

- Day 3–4: Project structure (US-1) completed  
- Day 5–6: Admin dashboard skeleton (US-4) completed  
- Day 7–8: Frontend framework + routing (US-3) completed  
- Day 9–10: Backend service + listings API base (US-2) completed  
- Day 11–12: Shared state (React contexts – US-5) completed  
- Day 13–14: Database setup and connectivity (US-6) completed  

Actual remaining story points:

Day:    0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  
Actual: 24  24  24  20  20  16  16  12  12   8   8   4   4   0   0  

The **ideal line** goes from 24 to 0 evenly across the 14 days.  
The actual line starts above the ideal early in the sprint (setup and scaffolding), then drops more
steeply in Week 2 as core UI, backend, and database tasks are completed, reaching **0 remaining
points by Day 14**, indicating Sprint 1 was successfully completed.

---

# 4. Weekly Scrum Reports

Below are each team member’s weekly Scrum updates answering:

1. **What tasks did I work on / complete?**  
2. **What am I planning to work on next?**  
3. **What tasks are blocked waiting on another team member?**  

---

## WEEK 1 (Sept 8 – Sept 14)

### **Sriyavarma Saripella**
**1. Worked on**
- Built homepage UI elements and static featured listings 
- Implemented general UI adjustments

**2. Planning next**
- Support backend with schema discussions
- Connect remaining UI sections to backend APIs 

**3. Blocked on**
- Awaiting finalized API formats
- Pending stable API responses from backend

---

### **Mohit Reddy**
**1. Worked on**
- Built Admin Dashboard structure 
- Updated browse, profile, and admin navigation pages 
- Performed project cleanup and folder restructuring  

**2. Planning next**
- Extend admin moderation tools
- Connect admin dashboard to backend endpoints

**3. Blocked on**
- Pending finalized schema for admin-related datasets
- Awaiting consolidated DB schema for listings & users 

---

### **Dokala Yaswanth**
**1. Worked on**
- Designed and sketched chat page and message UI
- Implemented initial chat routing and structure
- Began outlining chat flow and interactions

**2. Planning next**
- Build full chat UI wireframe
- Coordinate backend message flow and chat storage 

**3. Blocked on**
- Awaiting final messaging table/ERD
- Need final messaging table structure and ERD approval

---

### **Siddharth Jetling**
**1. Worked on**
- Developed product filtering groundwork
- Set up backend PostgreSQL basics
- Created early search and filtering strategy 

**2. Planning next**
- Expand advanced filter logic
- Align filter API with frontend consumption

**3. Blocked on**
- Waiting for backend API contract confirmation
- Awaiting final approval of unified backend API contract 

---

## WEEK 2 (Sept 15 – Sept 21)

### **Sriyavarma Saripella**
**1. Worked on**
- Integrated static UI pages with early backend structures
- Added placeholder product details and homepage routing refinements
- Updated general UI components to match overall layout direction
- Provided support for frontend–backend alignment discussions

**2. Planning next**
- Begin wiring the homepage and product card data to real API responses
- Assist in validating final database schema for listings
- Start implementing seller-side UI wiring in Sprint 2

**3. Blocked on**
- Waiting on stable API endpoints to finalize UI data binding

---

### **Mohit Reddy**
**1. Worked on**
- Extended Admin Dashboard structure with additional navigation panels
- Updated admin-specific pages for viewing listings and managing content
- Refined browse page and profile page, aligning with admin flow
- Performed merge operations and code cleanup across frontend modules 

**2. Planning next**
- Implement admin moderation logic (approve, remove listings)
- Coordinate with backend to consume report-related endpoints
- Build initial report management table for admin UI

**3. Blocked on**
- Pending final listing/report schema from backend 

---

### **Dokala Yaswanth**
**1. Worked on**
- Integrated early backend directories and branch restoration for chat work
- Implemented placeholder chat components and chat page structure 
- Began initial message container logic (UI-level only)
- Discussed message flow and session structure with backend team

**2. Planning next**
- Build message input flow and UI interactions
- Prepare initial chat-to-API connection plan
- Start designing chatbot interaction pane for Sprint 2 

**3. Blocked on**
- Messaging table structure and ERD finalization

---

### **Siddharth Jetling**
**1. Worked on**
- Implemented deeper product filtering logic in React 
- Set up filtering state management and category mapping
- Improved backend–filter interface planning
- Updated backend PostgreSQL setup and adjusted listing model fields

**2. Planning next**
- Implement full filter API structure (category, price, keyword)
- Start wiring backend filters to frontend dropdowns
- Coordinate with Sriya for product card data formatting

**3. Blocked on**
- Waiting for finalized API response formatting definitions 

---

# 6. Sprint 1 Review

### What We Planned:
- Set up the project structure and tools
- Create frontend and backend scaffolding 
- Build initial UI wireframes
- Begin designing the PostgreSQL schema
- Implement a basic homepage using mock data 
- Align team workflow, branching strategy, and sprint process

### What We Completed:
- Initialized Vite + React project
- Scaffolded Spring Boot backend with listings API placeholder
- Built homepage layout with mock listing cards
- Created Admin Dashboard base layout
- Added chat page routing and initial UI structure
- Set up PostgreSQL connection and drafted early schema
- Performed major repo cleanup and folder restructuring
- Established consistent development workflow on GitHub
 
### What Was Not Completed:
- Authentication and role-based access
- Full database schema (Listings, Users, Chat, Reports)
- CRUD functionality for listings
- Chat backend logic and chatbot integration
- Search/filter backend implementation
- Admin moderation flow

### Summary of Sprint 1:
- The team successfully completed all foundational tasks required to begin core feature development in Sprint 2.
- The core structure of the project is now in place: UI routes, backend setup, early database work, and the basic marketplace layout.
- Technical alignment was strong, and all members contributed to their respective functional areas.

---

# 7. Sprint 1 Retrospective

### What Went Well
- Smooth collaboration and communication across the team
- Clean and well-organized project structure after setup
- Clear division of work (filters, chat, admin, general UI)
- UI wireframes helped guide Sprint 1 execution
- All planned Sprint 1 items were completed on time

### What Could Be Improved
- Hosting decisions delayed backend progress  
- Stories needed more detailed breakdown  
- Blocking issues should be raised sooner  

### Action Items for Sprint 2
- Break down user stories into smaller tasks  
- Finalize AWS hosting in Week 1 of Sprint 2  
- Keep updating Task Board daily  
- Formalize API contracts before implementing them  

---

**End of Sprint 1 Report**
