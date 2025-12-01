# Sprint 1 – Campus Marketplace (Spartan Exchange)

**Sprint Duration:** September 8, 2025 – September 21, 2025  
**Sprint Length:** 2 Weeks  
**Team:** CMPE 202 – Spartan Exchange  

---

# 1. Sprint Goal

The objective of Sprint 1 was to establish the **foundation** of the Campus Marketplace project by:

- Finalizing the technology stack and repository structure  
- Setting up frontend and backend scaffolding  
- Designing complete UI wireframes for all screens  
- Creating the initial PostgreSQL database schema  
- Implementing a basic homepage using mock API data  
- Establishing GitHub workflow and Scrum processes  

This sprint focuses entirely on building the groundwork needed for future feature development.

---

# 2. Team Members & Component Ownership

| Team Member                | GitHub Handle              | Ownership / Core Contributions |
|----------------------------|----------------------------|--------------------------------|
| **Sriyavarma Saripella**   | `sriyavarmasaripella`      | Buyer-facing UI: homepage, product details, featured listings, future search UI, S3 images |
| **Mohit Reddy**            | `mohitreddyamanaganti`     | Backend APIs (listing CRUD), admin flows, seller flows, full UI wireframes, routing fixes |
| **Dokala Yaswanth**        | `Dokala Yaswanth`          | Chat system, chatbot research, chat UX design, product → chat linking |
| **Siddharth Jetling**      | `Siddharth Jetling`        | Database schema design, semantic search design, backend search and filter planning |


---

# 3. Sprint 1 Backlog (User Stories)

### User Stories

1. **US-1:** As a buyer, I want to browse featured listings  
2. **US-2:** As a seller, I need to know what information is required to create a listing  
3. **US-3:** As a buyer, I want to view product details  
4. **US-4:** As a team, we need a complete database schema  
5. **US-5:** As a team, we need a basic API returning mock data  
6. **US-6:** As a team, we need full UI wireframes for all screens  
7. **US-7:** As a team, we must establish project structure and Git workflow  

### Sprint 1 Completion Summary

| User Story | Status |
|------------|--------|
| US-4 | ✅ Completed |
| US-5 | ✅ Completed |
| US-6 | ✅ Completed |
| US-7 | ✅ Completed |
| US-1 | ⚠️ Completed using mock API (real data in Sprint 2) |
| US-3 | ⚠️ Static UI + routing completed |

---

# 4. Task Board & Burndown Summary

Below is the **visual representation** of the Sprint 1 workflow and progress.

---

## 4.1 Sprint 1 Task Board (Visual Kanban)

### Sprint 1 Task Board (Kanban Style)
## 4.1 Sprint 1 Task Board (Sticky-Note Kanban)

| **TO DO**                                                   | **DOING**                                                          | **DONE**                                                                   |
|-------------------------------------------------------------|---------------------------------------------------------------------|-----------------------------------------------------------------------------|
| 🟥 Define seller listing requirements (US-2)                | 🟩 Homepage UI development (Sriya – US-1)                          | 🟦 Project repo structure setup (Mohit)                                    |
| 🟪 Define product details fields for item view (US-3 prep)  | 🟪 Product Details UI development (Sriya – US-3)                   | 🟩 Express backend skeleton: `/api/health`, `/api/listings` (Mohit)        |
| 🟩 Finalize DB attribute list (Siddharth)                   | 🟥 Chat UI & flow design (Yaswanth)                                | 🟦 Initial PostgreSQL schema (Users, Listings, Messages) (Siddharth)       |
|                                                             | 🟦 Semantic search planning (Siddharth)                             | 🟪 Final UI wireframes for all screens completed (Mohit)                   |
|                                                             |                                                                     | 🟦 Homepage integrated with mock API data (Sriya + Mohit)                  |
|                                                             |                                                                     | 🟩 Product details routing created with params (Sriya)                     |
|                                                             |                                                                     | 🟪 Initial chatbot research & plan completed (Yaswanth)                    |



### Interpretation
- All foundational tasks moved to **DONE**
- Homepage and product details UI moved **In Progress → Review → Done**
- Chat + semantic search planning done (implementation postponed to Sprint 2)

---

## 4.1.1 User Story Movement Table

| User Story | Description | Start State | End State |
|-----------|-------------|-------------|-----------|
| US-1 | Browse featured listings | Backlog | Review → Done |
| US-2 | Seller listing requirements | Backlog | Done |
| US-3 | Product details page | Backlog | Review → Done |
| US-4 | Database schema design | To Do | Done |
| US-5 | Mock API skeleton | To Do | Done |
| US-6 | Full UI wireframes | In Progress | Done |
| US-7 | Repo structure & Git workflow | To Do | Done |

This fulfills **“Update the story on your Task Board.”**

---

## 4.2 Sprint 1 Burndown Chart (ASCII Representation)
 | Day | Ideal SP | Actual SP | Progress Bar                   |
| --- | -------- | --------- | ------------------------------ |
| 1   | 26       | 28        | ██████████████████████████████ |
| 2   | 24       | 28        | ██████████████████████████████ |
| 3   | 22       | 26        | ████████████████████████████   |
| 4   | 20       | 26        | ████████████████████████████   |
| 5   | 18       | 24        | ██████████████████████████     |
| 6   | 16       | 22        | ████████████████████████       |
| 7   | 14       | 20        | ██████████████████████         |
| 8   | 12       | 16        | ███████████████████            |
| 9   | 10       | 14        | █████████████████              |
| 10  | 8        | 12        | ███████████████                |
| 11  | 6        | 8         | ████████████                   |
| 12  | 4        | 6         | ██████████                     |
| 13  | 2        | 2         | ████                           |
| 14  | 0        | 0         |                                |



### Interpretation
- Week 1: Slow progress due to setup & architecture  
- Week 2: Strong progress; majority of user stories completed  
- Final SP = 0 → **Sprint Goal Achieved**

This fulfills **“Track your team’s Burndown Chart.”**

---

# 5. Weekly Scrum Reports

Each member’s weekly updates (Daily Scrum questions):

**1. What tasks did I work on?**  
**2. What am I planning to work on next?**  
**3. What tasks are blocked?**  

---

## WEEK 1 (Sept 8 – Sept 14)

### **Sriyavarma Saripella**
1. **Worked on**
   - React app initialization  
   - Homepage layout (navbar + featured section)  
   - Static listing cards using mock data  
2. **Planning next**
   - Product details UI  
   - Align with backend API structure  
3. **Blocked on**
   - Schema confirmation  
   - API response formats  

---

### **Mohit Reddy**
1. **Worked on**
   - Backend Express setup  
   - `/api/health` & `/api/listings` mock endpoints  
   - Initial wireframe sketches  
2. **Planning next**
   - Digitize wireframes  
   - Expand mock endpoints  
3. **Blocked on**
   - Database schema from Siddharth  

---

### **Dokala Yaswanth**
1. **Worked on**
   - Chat implementation research  
   - Basic chat UX sketches  
   - Chatbot outline  
2. **Planning next**
   - Chat wireframe finalization  
3. **Blocked on**
   - Message table design  

---

### **Siddharth Jetling**
1. **Worked on**
   - Full database schema  
   - Search strategy documentation  
   - Schema relationship mapping  
2. **Planning next**
   - SQL scripts for Sprint 2  
3. **Blocked on**
   - Final listing fields  

---

## WEEK 2 (Sept 15 – Sept 21)

### **Sriyavarma Saripella**
1. **Worked on**
   - Completed homepage UI  
   - Integrated `/api/listings` mock API  
   - Product details UI (routing with params)  
2. **Planning next**
   - Search bar + filters  
3. **Blocked on**
   - Backend route `/api/listings/:id`  

---

### **Mohit Reddy**
1. **Worked on**
   - Completed digital wireframes (homepage, listings, admin, chat)  
   - Extended mock API  
   - Backend routing cleanup  
   - Assisted frontend integration  
2. **Planning next**
   - Database integration  
3. **Blocked on**
   - AWS hosting decision  

---

### **Dokala Yaswanth**
1. **Worked on**
   - Chat wireframes complete  
   - Product → chat linking logic  
2. **Planning next**
   - Placeholder chat page in Sprint 2  
3. **Blocked on**
   - Message schema  

---

### **Siddharth Jetling**
1. **Worked on**
   - Finalized schema (added image_url, category, etc.)  
   - Added search documentation  
2. **Planning next**
   - SQL scripts for DB creation  
3. **Blocked on**
   - AWS environment setup  

---

# 6. Sprint 1 Review

### Completed This Sprint
- ✔ Repo structure established  
- ✔ UI wireframes completed  
- ✔ Database schema finalized  
- ✔ Express backend skeleton created  
- ✔ Homepage + product details UI using mock API  
- ✔ Chat & search planning completed  

### Demo Delivered
- Homepage rendering  
- Mock API integrated  
- Product details routing  
- UI wireframes walkthrough  

---

# 7. Sprint 1 Retrospective

### What Went Well
- Strong collaboration  
- Clear ownership across team  
- Solid wireframes guiding UI development  
- Backend-frontend integration began smoothly  

### What Could Be Improved
- Hosting choices delayed backend progress  
- Stories needed smaller breakdown  
- Blocking issues should be raised earlier  

### Action Items for Sprint 2
- Break stories into smaller tasks  
- Finalize AWS hosting  
- Keep task board updated daily  
- Finalize API contracts before development  

---


