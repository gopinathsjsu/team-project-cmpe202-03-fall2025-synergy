# Sprint 3 – Campus Marketplace (Spartan Exchange)

**Sprint Duration:** October 6, 2025 – October 19, 2025  
**Sprint Length:** 2 Weeks  
**Team:** CMPE 202 – Spartan Exchange  

---

# 1. Sprint Goal

The primary objective of Sprint 3 was to **complete the security layer, finish core database work, and implement buyer–seller chat features**, while preparing the system for deployment.

Key goals included:

- Implementing **JWT-based backend authentication** and protecting all sensitive routes  
- Designing and finalizing the **complete PostgreSQL database schema**  
- Completing the **buyer–seller chat system backend + frontend integration**  
- Improving admin report management with filters and metrics  
- Preparing backend + database for **AWS deployment**  
- Enhancing listing search, filtering, and general performance  

(Chatbot development will be completed in **Sprint 4**.)

---

# 2. Sprint 3 Backlog (User Stories)

| User Story ID | User Story                                                                                         | Task                                                                                       | Status      |
|---------------|-----------------------------------------------------------------------------------------------------|--------------------------------------------------------------------------------------------|------------|
| **US-13**     | As a user, I want secure authentication so only authorized users can access protected features.    | Implement JWT login endpoint                                                                | ✔ Completed |
|               |                                                                                                     | Add Spring Security filters for JWT validation                                              | ✔ Completed |
|               |                                                                                                     | Enforce role-based access on all sensitive APIs                                             | ✔ Completed |
| **US-14**     | As a buyer or seller, I want chat functionality to negotiate item details.                         | Build chat schema (Conversations, Messages)                                                 | ✔ Completed |
|               |                                                                                                     | Implement chat APIs (create conversation, send/receive messages)                           | ✔ Completed |
|               |                                                                                                     | Connect chat UI to backend                                                                  | ✔ Completed |
| **US-15**     | As a team member, I need a complete database schema for the entire marketplace.                    | Build complete DB schema (Users, Listings, Chats, Messages, Reports)                       | ✔ Completed |
|               |                                                                                                     | Implement relationships, foreign keys, indexes                                              | ✔ Completed |
| **US-16**     | As an admin, I want better report management for quicker moderation.                               | Add backend filters for status/date/type                                                    | ✔ Completed |
|               |                                                                                                     | Improve admin reports UI (filter panel, better table states)                               | ✔ Completed |
| **US-17**     | As a team, we need backend deployed so we can test features externally.                            | Deploy backend to AWS EC2 + connect to AWS RDS PostgreSQL                                   | ✔ Completed |
|               |                                                                                                     | Configure environment variables, SSL, and load balancer rules                              | ✔ Completed |
| **US-18**     | As a buyer, I want faster search and filtering.                                                    | Tune DB indexes & queries for search/filter performance                                     | ✔ Completed |
|               |                                                                                                     | Improve frontend filters (loading indicators, clear/reset)                                 | ✔ Completed |

---

# 3. Task Board & Burndown Summary

## 3.1 Sprint 3 Task Board (Kanban Style)

| **TO DO**                                                                                         | **DOING**                                                                                     | **DONE**                                                                                                  |
|---------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| 🟥 Document JWT auth rules and token expiry behavior (US-13)                                      | 🟦 Connect chat UI to live chat APIs and display history (US-14)                               | 🟦 JWT login endpoint with token generation (US-13)                                                        |
| 🟥 Prepare admin-side metrics for reporting (US-16 extension)                                     | 🟦 Implement admin report filters & table improvements (US-16)                                 | 🟦 Spring Security filter validating JWT tokens on protected endpoints (US-13)                             |
| 🟥 Prepare AWS deployment checklist                                                               | 🟩 Configure EC2, RDS connection, environment variables (US-17)                                | 🟦 Full DB schema created (Users, Listings, Chats, Messages, Reports) – (US-15)                            |
| 🟥 Add UI improvements to search and filtering                                                    | 🟦 Database indexing + tuning for search & performance (US-18)                                | 🟦 Chat backend implemented (conversation creation, message send/receive) – (US-14)                        |
|                                                                                                   |                                                                                                | 🟦 Chat UI wired to backend (US-14)                                                                       |
|                                                                                                   |                                                                                                | 🟦 Admin report filters added + improved UI states (US-16)                                                 |
|                                                                                                   |                                                                                                | 🟦 Backend deployed on AWS EC2 + connected to RDS PostgreSQL (US-17)                                      |
|                                                                                                   |                                                                                                | 🟩 Search/filter UX improvements completed (US-18)                                                        |

### Interpretation
- Major backend tasks (JWT, schema, chat API, search indexing) were finished.  
- Chat UI integration completed successfully.  
- All database work (schema + relationships + indexing) was completed this sprint.  
- Admin report filtering and AWS deployment were delivered as expected.  

(Chatbot deliberately **excluded from Sprint 3**.)

---

## 3.2 Sprint 3 Burndown Chart (ASCII Representation)

<img width="1979" height="980" alt="image" src="https://github.com/user-attachments/assets/cb653773-46bd-4337-b63b-1e41dbf0e87b" />


---

# 4. Weekly Scrum Reports

## WEEK 5 (Oct 6 – Oct 12)

### **Sriyavarma Saripella**
**1. Worked on**
- Improved frontend routing to support protected routes (JWT-ready)  
- Updated UI to handle listing search, filter, and reset interactions  
- Added UI states for admin report filters and view modes  

**2. Planning next**
- Integrate chat UI polish after backend deployment  
- Help test JWT once backend integration is live  

**3. Blocked on**
- Backend JWT availability for full UI guard implementation  

---

### **Mohit Reddy**
**1. Worked on**
- Enhanced admin reports screen with filter panel, improved table layout  
- Implemented “Approve / Reject / Flag” actions using new endpoints  
- Improved error handling, empty states, and action feedback  

**2. Planning next**
- Assist with AWS testing for admin routes  
- Refine seller workflow styling (success/error banners)  

**3. Blocked on**
- Pending final admin metrics decisions (future sprint)  

---

### **Dokala Yaswanth**
**1. Worked on**
- Designed and implemented the **complete PostgreSQL schema**  
  (Users, Listings, Chats, Messages, Reports)  
- Built all foreign keys, relationships, and cascade rules  
- Added DB indexes for search, chat, and listing filters  
- Implemented the full **chat backend**:  
  - Create conversation  
  - Fetch conversation history  
  - Send/store messages  
- Connected chat UI to backend message endpoints (local environment)  

**2. Planning next**
- Begin chatbot feature in Sprint 4  
- Add performance improvements to chat queries  
- Support real-time upgrades later (WebSockets or polling)  

**3. Blocked on**
- Chatbot specifications pending for Sprint 4  
- Awaiting final decision on real-time messaging support  

---

### **Siddharth Jetling**
**1. Worked on**
- Implemented JWT backend authentication (token generation + security layer)  
- Added role-based restrictions for admin/seller/buyer endpoints  
- Tuned search performance and added DB indexing  
- Assisted with AWS EC2 + RDS setup and tested DB connectivity  

**2. Planning next**
- Add caching for high-traffic listing queries  
- Improve search scoring and weighting logic  

**3. Blocked on**
- Requires a large dataset for proper search tuning  

---

## WEEK 6 (Oct 13 – Oct 19)

### **Sriyavarma Saripella**
**1. Worked on**
- Completed chat UI integration and refined message layout  
- Improved product detail page with seller info and related items  
- Assisted in AWS UI verification (routing, listing load, filters)  

**2. Planning next**
- UI polish before final demo (Sprint 4)  

**3. Blocked on**
- None  

---

### **Mohit Reddy**
**1. Worked on**
- Ensured admin moderation works end-to-end in AWS environment  
- Improved admin styling and action flows  
- Final testing of seller CRUD in cloud setup  

**2. Planning next**
- Work on report analytics UI in Sprint 4  

**3. Blocked on**
- Awaiting backend analytics endpoints  

---

### **Dokala Yaswanth**
**1. Worked on**
- Completed backend chat integration tests (local + AWS)  
- Optimized chat queries and added indexes for faster loading  
- Finalized schema documentation and ER diagrams  

**2. Planning next**
- Begin chatbot logic exploration (Sprint 4)  
- Add message read-status logic  

**3. Blocked on**
- Chatbot endpoint requirements pending  

---

### **Siddharth Jetling**
**1. Worked on**
- Final AWS deployment with correct environment configs  
- Load balancer health checks + auto-scaling setup  
- Improved search and filtering performance  

**2. Planning next**
- Investigate CloudWatch logs for performance tuning  

**3. Blocked on**
- Awaiting final UI metrics from frontend team  

---

# 5. Sprint 3 Review

### What We Planned
- Implement JWT backend authentication  
- Build full chat backend + integrate with UI  
- Complete full database schema  
- Improve admin reporting module  
- Deploy backend + DB to AWS  
- Improve search/filter performance  

### What We Completed
- Full JWT login, token issuance, and Spring Security JWT filter  
- Role-based access control across buyer/seller/admin routes  
- Complete PostgreSQL schema + indexing + relationships  
- Chat backend fully implemented and UI connected  
- Admin report filtering (status/date/type)  
- AWS EC2 + RDS deployment successful  
- Search and filter performance improvements completed  

### What Was Not Completed
- Chatbot assistant (moved to Sprint 4)  
- Real-time messaging (future enhancement)  
- Advanced reporting metrics and analytics  

### Summary of Sprint 3
Sprint 3 completed **all core backend and database tasks**, delivered a working chat system, implemented secure authentication, and deployed the system to AWS. The system is now **feature-complete**, and ready for Sprint 4 enhancements such as chatbot functionality and improved analytics.

---

# 6. Sprint 3 Retrospective

### What Went Well
- JWT, chat, and schema work aligned perfectly across backend and frontend  
- AWS deployment successful with no major blockers  
- Team collaboration and task ownership were very strong  
- Admin tools became significantly more usable  
- Database performance improvements impacted the entire platform positively  

### What Could Be Improved
- Chatbot planning should start earlier  
- Need more automated backend tests for JWT & chat  
- Reporting and analytics requirements should be clearer upfront  
- Real-time chat design should be planned before implementation  

### Action Items for Sprint 4
- Implement chatbot search assistant  
- Add real-time messaging (WebSockets or long-polling)  
- Build admin analytics dashboard  
- Improve search ranking and indexing  
- Expand test coverage (chat, authentication, admin flows)  
