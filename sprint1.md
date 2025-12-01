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

---

# 2. Team Members & Component Ownership

| Team Member                | GitHub Handle              | Ownership / Core Contributions |
|----------------------------|----------------------------|--------------------------------|
| **Sriyavarma Saripella**   | `sriyavarmasaripella`      | Buyer-facing UI: homepage, product details, featured listings, S3 images, search UI |
| **Mohit Reddy**            | `mohitreddyamanaganti`     | Backend APIs (listing CRUD), seller & admin flows, full UI wireframes, routing fixes |
| **Dokala Yaswanth**        | `Dokala Yaswanth`          | Chat system, chatbot integration research, product → chat linking |
| **Siddharth Jetling**      | `Siddharth Jetling`        | Database schema, semantic search design, backend search/filter planning |



---

# 3. Sprint 1 Backlog (User Stories)

### User Stories

1. **US-1:** As a buyer, I want to browse featured listings  
2. **US-2:** As a seller, I need to know what information is required to create a listing  
3. **US-3:** As a buyer, I want to view product details  
4. **US-4:** As a team, we need a complete DB schema  
5. **US-5:** As a team, we need a basic API returning mock data  
6. **US-6:** As a team, we need full UI wireframes for all screens  
7. **US-7:** As a team, we must establish project structure and Git process  

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

### 4.1 Task Board Movement

Columns used: **Backlog → To Do → In Progress → Review → Done**

- All foundational tasks were completed and moved to **Done**
- Homepage & product details UI reached **Review** and were finished
- Chat & semantic search design planned but implementation postponed to Sprint 2

> Sprint board screenshots and story movement are stored in the shared Google Sheet (Task Board & Burndown tabs).

### 4.2 Burndown Summary

- Slow velocity in early Week 1 due to architecture and tool setup  
- Significant progress in Week 2  
- Completed all targeted Sprint 1 tasks  
- Burndown chart converged to ideal line by sprint end  

The **Sprint 1 Burndown Chart** is included in the shared Google Sheet (Sprint 1 tab).

---

# 5. Weekly Scrum Reports

Below are each team member’s weekly Scrum updates answering:

1. **What tasks did I work on / complete?**  
2. **What am I planning to work on next?**  
3. **What tasks are blocked waiting on another team member?**  

---

## WEEK 1 (Sept 8 – Sept 14)

### **Sriyavarma Saripella**
**1. Worked on**
- Created React app scaffolding  
- Built homepage layout (navbar, featured listings placeholder)  
- Implemented static listing cards using mock data  

**2. Planning next**
- Begin product details UI design  
- Align with backend on API structure  

**3. Blocked on**
- Need database schema confirmation  
- Need API response format from Mohit  

---

### **Mohit Reddy**
**1. Worked on**
- Set up backend folder (Express app + routes)  
- Created `/api/health` and `/api/listings` with mock data  
- Started initial UX wireframes (homepage, seller form, admin page)  

**2. Planning next**
- Extend mock endpoints  
- Digitize full set of wireframes  
- Collaborate with Sriya to connect API to frontend  

**3. Blocked on**
- Waiting for schema finalization from Siddharth  

---

### **Dokala Yaswanth**
**1. Worked on**
- Researched chat implementation (REST vs WebSockets)  
- Created rough sketches for chat page and chat pop-up  
- Started chatbot functionality outline  

**2. Planning next**
- Build chat UI wireframe  
- Discuss message flow with backend  

**3. Blocked on**
- Need final messaging table structure  

---

### **Siddharth Jetling**
**1. Worked on**
- Drafted full PostgreSQL schema (users, listings, messages)  
- Wrote initial search strategy document  
- Documented schema relations  

**2. Planning next**
- Produce SQL creation scripts for Sprint 2  
- Help backend formalize API contracts  

**3. Blocked on**
- Need confirmation of all listing fields  

---

## WEEK 2 (Sept 15 – Sept 21)

### **Sriyavarma Saripella**
**1. Worked on**
- Finished homepage UI and grid layout  
- Integrated `/api/listings` mock API  
- Built initial product details UI with route parameters  

**2. Planning next**
- Plan full search bar and filter UI  
- Integrate real data once DB is ready  

**3. Blocked on**
- Need backend route `/api/listings/:id`  

---

### **Mohit Reddy**
**1. Worked on**
- Completed full digital UI wireframes (saved as `wireframes.md`)  
- Extended Express mock API  
- Set up backend routing structure for CRUD operations  
- Assisted integration of frontend with mock API  

**2. Planning next**
- Add DB integration in Sprint 2  
- Implement `/api/listings/create`  

**3. Blocked on**
- Need hosting decision (AWS RDS vs local)  

---

### **Dokala Yaswanth**
**1. Worked on**
- Finalized chat UI wireframes  
- Documented product → chat flow  
- Planned chatbot implementation logic  

**2. Planning next**
- Add React chat placeholder page in Sprint 2  

**3. Blocked on**
- Waiting for backend messages schema  

---

### **Siddharth Jetling**
**1. Worked on**
- Finalized schema updates (condition, category, image_url)  
- Added search-related notes  
- Prepared DB documentation for team  

**2. Planning next**
- Begin SQL scripts for real table creation  

**3. Blocked on**
- Waiting for AWS hosting decision  

---

# 6. Sprint 1 Review

### Completed This Sprint:
- ✔ Repository structure and Git workflow  
- ✔ Full UI wireframes  
- ✔ Initial DB schema  
- ✔ Express backend with mock endpoints  
- ✔ Homepage UI + product details UI using mock data  
- ✔ Chat & search design finalized  

### Demo Delivered:
- Homepage rendering using React  
- API call to `/api/listings` returning mock items  
- Routing to product details page  
- Wireframes walkthrough  

---

# 7. Sprint 1 Retrospective

### **What Went Well**
- Clear division of responsibility  
- Wireframes gave strong direction  
- Good communication and teamwork  
- Backend–frontend integration began early  

### **What Could Be Improved**
- Hosting decisions delayed backend progress  
- Stories needed more detailed breakdown  
- Blocking issues should be raised sooner  

### **Action Items for Sprint 2**
- Break down user stories into smaller tasks  
- Finalize AWS hosting in Week 1 of Sprint 2  
- Keep updatingTask Board daily  
- Formalize API contracts before implementing them  

---

**End of Sprint 1 Report**
