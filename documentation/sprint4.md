# Sprint 4 – Campus Marketplace (Spartan Exchange)

*Sprint Duration:* October 20, 2025 – November 2, 2025  
*Sprint Length:* 2 Weeks  
*Team:* CMPE 202 – Spartan Exchange  

---

# 1. Sprint Goal

The objective of Sprint 4 was to *complete all remaining high-value features and prepare the system for the final Demo Day*.  
This sprint focused on:

- Implementing the *Chatbot assistant* for natural-language item search  
- Adding *real-time or near real-time chat improvements*  
- Enhancing *admin analytics and reporting tools*  
- Polishing *UI/UX across all flows*  
- Completing *AWS deployment stabilization, logging, and monitoring*  
- Final bug fixes and documentation cleanup  

---

# 2. Sprint 4 Backlog (User Stories)

| User Story ID | User Story                                                                                         | Task                                                                                           | Status      |
|---------------|-----------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------|------------|
| *US-19*     | As a user, I want a chatbot assistant so I can ask for items using natural language.                | Implement chatbot UI panel                                                                     | ✔ Completed |
|               |                                                                                                     | Connect chatbot to search API (semantic + keyword)                                             | ✔ Completed |
|               |                                                                                                     | Display chatbot responses as item cards                                                         | ✔ Completed |
| *US-20*     | As a buyer/seller, I want near real-time chat so conversations feel responsive.                    | Add periodic polling for message refresh                                                        | ✔ Completed |
|               |                                                                                                     | Implement unread indicators + message read-state                                               | ✔ Completed |
| *US-21*     | As an admin, I want analytics so I can monitor marketplace activity.                               | Add basic analytics API (listing count, reports count, user count)                             | ✔ Completed |
|               |                                                                                                     | Build admin analytics UI dashboard (charts + tables)                                           | ✔ Completed |
| *US-22*     | As a user, I need a polished experience so the final product feels smooth and reliable.             | UI polish (loading states, empty states, error handling)                                       | ✔ Completed |
|               |                                                                                                     | Refine navigation, modals, and forms                                                           | ✔ Completed |
| *US-23*     | As a team, we need stable deployment for demo day.                                                  | Finalize AWS deployment (EC2, RDS, Load Balancer health checks)                                | ✔ Completed |
|               |                                                                                                     | Add backend logs + monitoring (CloudWatch)                                                     | ✔ Completed |
| *US-24*     | As a team, I want all documentation completed for grading.                                          | Update README, diagrams, report, and sprint summaries                                          | ✔ Completed |

---

# 3. Task Board & Burndown Summary

## 3.1 Sprint 4 Task Board (Kanban)

| *TO DO*                                                                                | *DOING*                                                                   | *DONE*                                                                                           |
|------------------------------------------------------------------------------------------|------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------|
| 🟥 Add chatbot fallback responses                                                        | 🟦 Implement chatbot → search API mapping (US-19)                            | 🟦 Chatbot UI integrated + response cards displayed (US-19)                                         |
| 🟥 Review UI consistency across buyer/seller/admin                                       | 🟩 Add message polling + unread indicators (US-20)                           | 🟦 Message read/unread + polling system implemented (US-20)                                         |
| 🟥 Finalize list of analytics to show                                                    | 🟦 Build admin analytics charts (traffic, listings, reports) (US-21)         | 🟦 Admin analytics panel functional with dynamic charts (US-21)                                     |
| 🟥 Prepare final demo script                                                             | 🟩 Add missing loading/empty/error UI states (US-22)                        | 🟩 Marketplace UI fully polished (forms, buttons, navigation) (US-22)                               |
| 🟥 Review AWS cost/instance settings                                                     | 🟦 Configure CloudWatch logs + alarms (US-23)                                | 🟦 AWS deployment stabilized, health checks passed (US-23)                                          |
| 🟥 Update component & deployment diagrams                                                | 🟪 Documentation finalization (US-24)                                        | 🟪 README + reports + sprint summaries updated (US-24)                                              |

### Interpretation

- Sprint 4 focused on *polish + chatbot + analytics + deployment stability*  
- All stories *US-19 → US-24* moved to *Done*  
- System is now complete and demo-ready  

---

## 3.2 Sprint 4 Burndown Chart (ASCII Representation)
![WhatsApp Image 2025-12-01 at 5 28 16 PM](https://github.com/user-attachments/assets/28f3c6d8-d3a9-43da-950a-50bed2908720)

---

# 4. Weekly Scrum Reports

## WEEK 7 (Oct 20 – Oct 26)

### *Sriyavarma Saripella*
*1. Worked on*
- Implemented UI polish for homepage, listing cards, and product details  
- Added improved empty/error states for listings  
- Enhanced routing transitions and loading animations  

*2. Planning next*
- Assist in chatbot UI integration  
- Add small refinements before demo  

*3. Blocked on*
- None  

---

### *Mohit Reddy*
*1. Worked on*
- Built admin analytics page (charts, stats, report counts)  
- Expanded admin report filtering options  
- Updated admin dashboard styling  

*2. Planning next*
- Finish documentation required for admin features  
- Add optional admin actions (soft delete, restore)  

*3. Blocked on*
- None  

---

### *Dokala Yaswanth*
*1. Worked on*
- Added message refresh/polling mechanism for near real-time chat  
- Added “read/unread” and timestamp formatting  
- Helped verify chat backend endpoints on AWS  
- Did NOT build chatbot logic this sprint (planned for next iteration)  

*2. Planning next*
- Support chatbot integration once endpoints are ready  
- Improve chat performance and reduce polling frequency  

*3. Blocked on*
- Chatbot API contract from backend team  

---

### *Siddharth Jetling*
*1. Worked on*
- Implemented JWT backend authentication (final testing)  
- Tuned database indexes for better filter/search performance  
- Configured AWS CloudWatch monitoring and logs  
- Fixed backend issues found during UI integration  

*2. Planning next*
- Help finalize chatbot backend integration  
- Conduct performance pass before demo  

*3. Blocked on*
- Pending final sample dataset for search testing  

---

## WEEK 8 (Oct 27 – Nov 2)

### *Sriyavarma Saripella*
*1. Worked on*
- Completed chatbot UI layout and reply formatting  
- Integrated chatbot suggestions with listing cards  
- Performed final UI polish across pages  

*2. Planning next*
- Prepare demo walkthrough for UI flows  

*3. Blocked on*
- None  

---

### *Mohit Reddy*
*1. Worked on*
- Completed admin analytics charts with dynamic data  
- Added UI improvements to admin tables  
- Assisted team with documentation for Sprint 4  

*2. Planning next*
- Final demo preparation  

*3. Blocked on*
- None  

---

### *Dokala Yaswanth*
*1. Worked on*
- Verified chat integration end-to-end in AWS environment  
- Added minor improvements to chat UI responsiveness  
- Finalized chat-related DB queries and cleanup scripts  

*2. Planning next*
- Assist in chatbot backend testing (Sprint 5 if needed)  

*3. Blocked on*
- None  

---

### *Siddharth Jetling*
*1. Worked on*
- Ensured all backend APIs stable under AWS deployment  
- Updated JWT configs based on team feedback  
- Helped integrate chatbot search endpoint  
- Conducted final backend testing  

*2. Planning next*
- Backend support during final demo  

*3. Blocked on*
- None  

---

# 5. Sprint 4 Review

### What We Planned
- Implement chatbot assistant  
- Improve chat system with read/unread + polling  
- Build admin analytics dashboard  
- Polish major UI screens  
- Finalize AWS deployment stability  
- Prepare documentation + demo  

### What We Completed
- Chatbot UI + integration with search results  
- Near real-time chat features with polling + read states  
- Admin analytics dashboard with charts and aggregated data  
- Full UI polish across the platform  
- AWS deployment fully stabilized (EC2 + RDS + CloudWatch)  
- All documentation (README, diagrams, sprint reports) updated  
- System is fully ready for final demo  

### What Was Not Completed
- WebSocket-based real-time chat (future enhancement)  
- Advanced chatbot intelligence (kept v1 simple for deadline)  

### Summary of Sprint 4
Sprint 4 successfully completed the *last major features and UI polish* required before Demo Day. The system is now robust, deployed, user-friendly, and fully documented. All team members contributed across features, testing, deployment, and final adjustments.

---

# 6. Sprint 4 Retrospective

### What Went Well
- Smooth integration of chat, chatbot, analytics, and AWS deployment  
- UI quality improved significantly this sprint  
- Team communication and parallel work were highly effective  
- Final documentation completed ahead of time  

### What Could Be Improved
- Real-time chat could be started earlier  
- Chatbot integration required clearer backend specs  
- Some analytics queries were added late in the sprint  

### Action Items for Future Work
- Add WebSocket-based real-time messaging  
- Expand chatbot with smarter recommendations  
- Add more detailed admin analytics  
- Implement caching layer for search performance  
- Add automated test coverage to prevent regressions  

---

*End of Sprint 4 Report*
