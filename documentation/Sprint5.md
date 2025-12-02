# Sprint 5 – Campus Marketplace (Spartan Exchange)

**Sprint Duration:** November 3, 2025 – November 16, 2025  
**Sprint Length:** 2 Weeks  
**Team:** CMPE 202 – Spartan Exchange  

---

# 1. Sprint Goal

Sprint 5 focused on **stabilizing the application, improving chat functionality, polishing UI/UX, and preparing for Demo Day**.  
A major emphasis this sprint was enhancing the chat system to support **separate conversations for each product**, allowing users to maintain multiple parallel chat threads depending on the item they are buying or selling.

---

# 2. Sprint 5 Backlog (User Stories)

| User Story ID | User Story                                                                                         | Task                                                                                     | Status      |
|---------------|-----------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------|-------------|
| **US-25**     | As a buyer/seller, I want a separate chat thread for each product I interact with.                 | Create multi-conversation chat layout (sidebar + active chat window)                     | ✔ Completed |
|               |                                                                                                     | Implement product-linked conversations (one chat thread per item)                        | ✔ Completed |
|               |                                                                                                     | Add conversation switching + unread indicators                                           | ✔ Completed |
| **US-26**     | As a buyer/seller, I want chat to feel responsive during demo.                                      | Optimize chat polling and message refresh intervals                                      | ✔ Completed |
|               |                                                                                                     | Improve chat UI responsiveness (scroll, timestamps, grouping)                            | ✔ Completed |
| **US-27**     | As an admin, I want a reliable system during moderation demonstrations.                             | Final report filters polishing                                                            | ✔ Completed |
|               |                                                                                                     | Fix admin table bugs + loading/error states                                              | ✔ Completed |
| **US-28**     | As a team, we want stable deployment for Demo Day.                                                  | Verify EC2 + RDS connectivity, load balancer health checks                               | ✔ Completed |
|               |                                                                                                     | Add CloudWatch logs + alarms                                                             | ✔ Completed |
| **US-29**     | As a user, I want a polished UI with no broken pages.                                               | UI polish: spacing, alignment, improved navigation                                       | ✔ Completed |
| **US-30**     | As a team, we need complete documentation for project submission.                                   | Finalize README, diagrams, sprint summaries, architecture notes                          | ✔ Completed |

---

# 3. Task Board & Burndown Summary

## 3.1 Sprint 5 Task Board (Kanban)

| **TO DO**                                                                      | **DOING**                                                                              | **DONE**                                                                                                 |
|--------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------|
| 🟥 Review multi-thread chat layout                                             | 🟦 Implement product-specific conversations (one per listing) (US-25)                   | 🟦 Multi-conversation chat UI implemented (sidebar + active chat window) (US-25)                           |
| 🟥 Refine admin UI feedback messages                                           | 🟩 Improve chat responsiveness & message ordering (US-26)                               | 🟦 Product → Chat linking completed with proper conversation creation (US-25)                              |
| 🟥 Check performance of listing filters under load                             | 🟦 Admin report filters & table cleanup (US-27)                                         | 🟩 Chat polling optimization + unread/read states (US-26)                                                  |
| 🟥 Validate AWS stability                                                      | 🟦 Configure CloudWatch alarms + AWS health checks (US-28)                              | 🟦 Admin dashboard stable with improved layouts + error/empty states (US-27)                               |
| 🟥 Update remaining diagrams                                                   | 🟪 Finalize README + architectural documentation (US-30)                               | 🟦 AWS deployment stability verified (EC2 + RDS + LB) (US-28)                                              |
| 🟥 Polish minor UI issues                                                      |                                                                                         | 🟩 Full UI/UX polishing completed (US-29)                                                                 |
|                                                                                |                                                                                         | 🟪 All documentation + sprint summaries completed (US-30)                                                 |

---

## 3.2 Burndown Chart

<img width="1979" height="980" alt="image" src="https://github.com/user-attachments/assets/aaaf35a1-2a44-47bd-9a56-62e7aab784c2" />

---

# 4. Weekly Scrum Reports

## WEEK 9 (Nov 3 – Nov 9)

### **Sriyavarma Saripella**
**1. Worked on**
- Final UI polish for homepage, listings, product details  
- Improved error/loading/empty states  
- Verified UI behavior in AWS environment  

**2. Planning next**
- Assist with chat UI refinement  

**3. Blocked on**
- None  

---

### **Mohit Reddy**
**1. Worked on**
- Admin report UI cleanup  
- Fixed admin layout inconsistencies and improved UX  
- Documented admin flow behavior in README  

**2. Planning next**
- Testing moderation workflow end-to-end  

**3. Blocked on**
- None  

---

### **Dokala Yaswanth**
**1. Worked on**
- Implemented **multi-thread chat system**, allowing separate conversations for each product  
- Created chat sidebar to switch between different product conversations  
- Improved chat UI performance (scroll handling, grouping, timestamps)  
- Ensured stable chat backend integration on AWS  

**2. Planning next**
- Improve message refresh logic for smoother switching  
- Finalize product-linked conversation behavior for demo  

**3. Blocked on**
- None  

---

### **Siddharth Jetling**
**1. Worked on**
- Improved search/filter performance implementation  
- Configured CloudWatch alarms + AWS log monitoring  
- Performed backend cleanup and bug fixing  

**2. Planning next**
- Backend assistance during demo prep  

**3. Blocked on**
- None  

---

## WEEK 10 (Nov 10 – Nov 16)

### **Sriyavarma Saripella**
**1. Worked on**
- Final UI fixes for demo polish  
- Full end-to-end testing (buyer → seller → chat → admin)  

**2. Planning next**
- Demo preparation  

**3. Blocked on**
- None  

---

### **Mohit Reddy**
**1. Worked on**
- Final admin checks for reports + analytics  
- Improved error message handling and admin workflows  

**2. Planning next**
- Support final demonstration walkthrough  

**3. Blocked on**
- None  

---

### **Dokala Yaswanth**
**1. Worked on**
- Completed testing of multi-conversation chat system on AWS  
- Ensured consistent conversation creation for different product listings  
- Added final indexing and backend cleanup for chat-related queries  

**2. Planning next**
- Support final chat testing during Demo Day  

**3. Blocked on**
- None  

---

### **Siddharth Jetling**
**1. Worked on**
- Final backend reliability checks  
- Assisted UI team with search endpoints  
- Supported AWS scaling tests  

**2. Planning next**
- Monitor backend during demo  

**3. Blocked on**
- None  

---

# 5. Sprint 5 Review

### What We Planned
- Improve chat system  
- Strengthen AWS deployment  
- Finalize admin tools  
- Polish UI/UX  
- Full system testing  
- Complete documentation  

### What We Completed
- Fully functional **multi-conversation chat system** (separate chat threads per product)  
- Chat responsiveness improvements (polling, grouping, read states)  
- Admin reporting fixes and UI stabilization  
- AWS deployment verified with health checks and CloudWatch logs  
- Full UI polish across all screens  
- All documentation (README, diagrams, sprint reports) completed  

### What Was Not Completed
- WebSockets for instant chat (future enhancement)  
- Advanced chatbot intelligence (reserved for later sprints)  

### Summary of Sprint 5
Sprint 5 successfully prepared the system for Demo Day by finalizing all remaining tasks, stabilizing chat behavior with multiple product conversations, ensuring UI consistency, and completing deployment reliability work. The system is now fully ready for final presentation.

---

# 6. Sprint 5 Retrospective

### What Went Well
- Multi-thread chat system worked reliably across product listings  
- AWS infrastructure stable and responsive  
- UI/UX quality dramatically improved  
- Documentation finished early for review  

### What Could Be Improved
- Multi-conversation chat could have been scoped earlier  
- More detailed admin/report analytics would be beneficial  
- More automated testing would reduce manual verification  

### Action Items (Future Work)
- Add WebSocket-based real-time messaging  
- Expand chatbot capabilities beyond simple queries  
- Add more admin analytics & dashboards  
- Add caching for faster listing search  
