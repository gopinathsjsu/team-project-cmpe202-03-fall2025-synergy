*Sprint Duration:* November 17, 2025 – November 30, 2025  
*Sprint Length:* 2 Weeks  
*Team:* CMPE 202 – Spartan Exchange  

---

# 1. Sprint Goal

Sprint 6 was the *final sprint*, dedicated to completing all remaining features, finalizing the chatbot, stabilizing the system, and preparing for Demo Day.  
This sprint focused on:

- Completing the *Chatbot Assistant*  
- Final cleanup of the *multi-conversation chat system*  
- UI/UX polishing across buyer, seller, and admin views  
- Ensuring AWS deployment stability  
- Full-system testing and documentation completion  

The sprint delivered the production-ready version of Spartan Exchange.

---

# 2. Sprint 6 Backlog (User Stories)

| User Story ID | User Story                                                                                          | Task                                                                                         | Status      |
|---------------|------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------|-------------|
| *US-31*     | As a user, I want the chatbot to understand my queries and show relevant items.                     | Implement final chatbot logic and improved responses                                        | ✔ Completed |
|               |                                                                                                      | Connect chatbot to search results and display related listings                               | ✔ Completed |
| *US-32*     | As a buyer/seller, I want consistent chat behavior across all product conversations.                | Fix chat refresh issues + improve polling intervals                                         | ✔ Completed |
|               |                                                                                                      | Ensure conversation switching works smoothly across product threads                          | ✔ Completed |
| *US-33*     | As an admin, I want stable analytics and moderation tools before demo day.                          | Final polish on admin analytics charts                                                      | ✔ Completed |
|               |                                                                                                      | Validate and refine admin report flows                                                       | ✔ Completed |
| *US-34*     | As a team, we need the platform fully tested before Demo Day.                                        | Full-system testing (UI + backend + AWS)                                                    | ✔ Completed |
| *US-35*     | As a team, we need complete documentation for final submission.                                      | Finalize README, diagrams, architecture report, sprint summaries                             | ✔ Completed |

---

# 3. Task Board & Burndown Summary

## 3.1 Sprint 6 Task Board (Kanban)

| *TO DO*                                                                           | *DOING*                                                                                  | *DONE*                                                                                                      |
|-------------------------------------------------------------------------------------|---------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------|
| 🟥 Validate chatbot fallback responses                                               | 🟩 Chatbot → search integration and output formatting (US-31)                              | 🟦 Chatbot final logic implemented and connected to search results (US-31)                                   |
| 🟥 Review chat ordering across product-based conversations                           | 🟦 Chat UI improvements and conversation switching fixes (US-32)                            | 🟦 Chat polling, ordering, timestamps, and unread indicators stabilized (US-32)                               |
| 🟥 Validate admin analytics data                                                     | 🟦 Admin analytics and report flow polishing (US-33)                                        | 🟦 Admin analytics panel finalized with stable chart rendering (US-33)                                        |
| 🟥 Verify AWS health checks and connectivity                                         | 🟦 Final system-wide testing on deployed environment (US-34)                                | 🟦 AWS deployment stable under load testing; CloudWatch logs validated (US-34)                                |
| 🟥 Update architecture and deployment diagrams                                       | 🟪 README + documentation completion (US-35)                                               | 🟪 Documentation complete (README, diagrams, sprint reports) (US-35)                                          |
| 🟥 Apply final UI polish across buyer/seller/admin views                             |                                                                                             | 🟩 UI/UX polishing across all screens (US-34)                                                                 |

### Interpretation
- Chatbot and chat system finalization were the primary goals.  
- Chat remained *polling-based*, not real-time — consistent with your implementation.  
- Deployment and testing were completed successfully.  

---

# 3.2 Sprint 6 Burndown Chart (ASCII)
![WhatsApp Image 2025-12-01 at 8 11 15 PM](https://github.com/user-attachments/assets/25c3a77a-46c3-400a-9f05-d27581c707eb)


---

# 4. Weekly Scrum Reports

## WEEK 11 (Nov 17 – Nov 23)

### *Sriyavarma Saripella*
*1. Worked on*
- UI refinements for marketplace browsing, listing views, and product details  
- Integrated chatbot UI presentation with response cards  
- Verified UI behavior in AWS deployment  

*2. Planning next*
- Assist in final UX adjustments before demo  

*3. Blocked on*
- None  

---

### *Mohit Reddy*
*1. Worked on*
- Finalized admin analytics charts and report table behavior  
- Improved moderation UI feedback and error states  
- Completed admin-side documentation  

*2. Planning next*
- Prepare admin panel demo sequence  

*3. Blocked on*
- None  

---

### *Dokala Yaswanth*
*1. Worked on*
- Refined *multi-conversation chat system* behavior across different products  
- Fixed message refresh issues and improved polling smoothness  
- Validated chat functionality across multiple users in AWS  
- Cleaned up chat-related queries and improved DB indexing  

*2. Planning next*
- Support full-system testing for chat-heavy flows  

*3. Blocked on*
- None  

---

### *Siddharth Jetling*
*1. Worked on*
- Completed chatbot backend logic integration  
- Tuned search endpoints for better chatbot responses  
- Conducted backend reliability checks on AWS  

*2. Planning next*
- Perform final endpoint validations before demo  

*3. Blocked on*
- None  

---

## WEEK 12 (Nov 24 – Nov 30)

### *Sriyavarma Saripella*
*1. Worked on*
- Final UI polish across all components  
- Updated loading/error states for chatbot interactions  

*2. Planning next*
- Demo Day prep  

*3. Blocked on*
- None  

---

### *Mohit Reddy*
*1. Worked on*
- Final admin analytics validation  
- Reviewed styling inconsistencies and fixed minor issues  

*2. Planning next*
- Assist with final presentation steps  

*3. Blocked on*
- None  

---

### *Dokala Yaswanth*
*1. Worked on*
- Verified chat behavior across all product conversations in production environment  
- Improved chat state management and message grouping  
- Ensured clean transitions between chat threads  

*2. Planning next*
- Provide chat/backend support during demo  

*3. Blocked on*
- None  

---

### *Siddharth Jetling*
*1. Worked on*
- Final chatbot backend adjustments  
- System-wide backend testing (search, chat, auth)  
- Ensured stable AWS scaling behavior  

*2. Planning next*
- Backend support during demo  

*3. Blocked on*
- None  

---

# 5. Sprint 6 Review

### What We Planned
- Finalize chatbot features  
- Stabilize chat system  
- Improve admin tools  
- Polish UI/UX  
- Validate AWS deployment  
- Prepare for Demo Day  

### What We Completed
- Chatbot fully implemented with search integration  
- Stable multi-conversation chat behavior  
- Admin analytics & moderation refined  
- Deployment stable on AWS (EC2, LB, RDS, CloudWatch)  
- UI/UX polished across all flows  
- All documentation completed  
- Demo Day preparations finalized  

### What Was Not Completed
- No missing Sprint 6 items  
- Real-time WebSocket chat intentionally excluded (not part of project scope)  

### Summary of Sprint 6
Sprint 6 delivered the final production-ready version of Spartan Exchange.  
The chatbot, chat system, analytics, AWS deployment, and full documentation were successfully completed, making the platform fully ready for demonstration and grading.

---

# 6. Sprint 6 Retrospective

### What Went Well
- Chatbot and chat systems completed on time  
- AWS deployment stable in final tests  
- UI polish enhanced the entire user experience  
- Documentation finished ahead of schedule  
- Collaboration was strongest this sprint  

### What Could Be Improved
- Chat thread logic could have been scoped earlier  
- Chatbot responses could include more intelligent suggestions  
- Automated tests would reduce manual testing needs  

### Action Items (Post-Project)
- Add WebSocket support for real-time messaging (future)  
- Enhance chatbot with more complex intent handling  
- Expand admin analytics into a full dashboard  
- Add improved search ranking & caching  

---

*End of Sprint 6 Report*
