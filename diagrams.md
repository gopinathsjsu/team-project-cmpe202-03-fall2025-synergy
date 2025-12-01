# System Architecture Diagrams

## 📌 Component Diagram  
![Component Diagram](https://raw.githubusercontent.com/gopinathsjsu/team-project-cmpe202-03-fall2025-synergy/main/component%20diagram.png)

## 📌 Deployment Diagram  
![Deployment Diagram](https://raw.githubusercontent.com/gopinathsjsu/team-project-cmpe202-03-fall2025-synergy/main/depployment%20diagram.png)

---

# Diagram Explanations

### **Component Diagram**
Shows logical structure of the system, highlighting client components, Spring Boot controllers/services, data layer, and external dependencies. Interfaces indicate REST communication, and internal dependencies reflect service responsibilities (auth, listings, profile, chat, reports, admin, file storage, embeddings).

### **Deployment Diagram**
Depicts runtime architecture from user browsers through CDN/static hosting to the Spring Boot backend, along with supporting infrastructure (PostgreSQL database, AWS S3 bucket, embeddings microservice). Communication paths (HTTPS/JDBC) and deployment artifacts (SPA bundle, Spring Boot JAR, embeddings container) are illustrated.

---

# Assumptions
- React SPA is hosted via Vite dev server during development or as static assets behind a CDN in production.  
- Embeddings service runs in a Docker container within the same VPC and is accessed over HTTP.  
- PostgreSQL is managed (e.g., AWS RDS) and reachable from the backend server.  
- Chatbot widget remains integrated client-side, consuming existing backend REST APIs (even if LLM features were reverted, the widget structure persists for future use).
