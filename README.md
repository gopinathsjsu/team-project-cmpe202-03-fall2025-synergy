# 📚 Campus Marketplace – Team Synergy

A campus-only buy & sell platform for students to list, discover, and trade items such as textbooks, electronics, and essentials.  
Built as part of **CMPE 202 – Software Engineering (Fall 2025)** using Agile Scrum practices across six sprints.

---

## 👥 Team Members

| Name | Roll No. |
|------|----------|
| Siddharth Jetling| 019149702 |
| Mohit Reddy Amanaganti | 018690373 |
| Yashwanth Venkata Satya Naga Sai Dokala | 019118190 |
| sriyavarma saripella  | 019130553 |

*(Replace placeholder names and roll numbers with actual team details)*

---

## 🧱 Tech Stack Used

### **Frontend**
- React.js  
- React Router  
- Axios  

### **Backend**
- Spring Boot  
- Spring Web  
- Spring Security (JWT Authentication)  
- Spring Data JPA  

### **Database**
- PostgreSQL (Hosted on AWS RDS)

### **Cloud & Deployment**
- AWS EC2 (Backend Hosting)  
- AWS Application Load Balancer  
- AWS S3 (Image storage)  
- Docker / docker-compose  

### **Additional Services**
- AI Semantic Search (Embeddings-based search)  
- In-App Chat System (Buyer ↔ Seller messaging)

---

## 🎯 Feature Set

### ✔ Unified Buyer–Seller Role
Every student user can:
- Create, edit, and delete product listings  
- Upload listing images to S3  
- Browse and search for items  
- Filter by category and price  
- Chat directly with other users  
- Report incomplete or inappropriate listings  

### ✔ Admin Role
Admins can:
- Delete or disable listings  
- Review user reports  
- Moderate platform content  

### ✔ Search & AI Integration
- Category and price filtering  
- Keyword search  
- AI-powered natural language search  
  - *“Do you have CMPE 202 books?”*  
  - *“Show me laptops under $300”*

### ✔ Real-Time Communication
- Buyer ↔ Seller chat  
- Conversations tied to listings  
- Instant message updates  

### ✔ Cloud Deployment
- Backend deployed on AWS EC2  
- Auto-scaling using Load Balancer  
- Images stored securely in S3  
- PostgreSQL database managed via AWS RDS  

---

## 📂 Documentation

All required project documentation is stored inside the **`documentation/`** folder:

- Weekly Scrum Reports (Sprint 1–6)   
- Product Backlog, Sprint Backlogs & Burndown Charts  
- UI Wireframes  
- Component Diagram  
- Deployment Diagram  
- 💡 XP Core Values Reflection  

This folder contains **all diagrams, design decisions, and project documentation** required for CMPE 202.

---

# 🏃‍♂️ How to Run the Project

You can run the entire project using Docker in one step.

## Prerequisites

- Docker and Docker Compose installed on your machine

## Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone <repo-url>
cd team-project-cmpe202-03-fall2025-synergy
```

### 2️⃣ Run Using Docker Compose

```bash
docker compose up --build
```

This command will:
- Build all necessary Docker images
- Start all services (frontend, backend, database)
- Set up the networking between containers

### 3️⃣ Access the Application

Once the containers are running, you can access:

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend** | http://localhost:3000 | Web application interface |
| **Backend API** | http://localhost:8080 | REST API endpoints |
| **PostgreSQL Database** | Running inside Docker | Database service (internal) |

## Stopping the Application

To stop all services:

```bash
docker compose down
```

To stop and remove all volumes (including database data):

```bash
docker compose down -v
```

## Troubleshooting

- If ports 3000 or 8080 are already in use, stop other applications using these ports
- Ensure Docker Desktop is running before executing commands
- For permission issues on Linux, you may need to run commands with `sudo`
