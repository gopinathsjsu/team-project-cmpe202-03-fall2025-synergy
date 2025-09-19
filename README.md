[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-22041afd0340ce965d47ae6ef1cefeee28c7c493a6346c4f15d667ab976d596c.svg)](https://classroom.github.com/a/kvgvOCnV)

## Synergy Campus Marketplace (CMPE 202)

React + Spring Boot + MySQL scaffold for a campus-only marketplace (Seller, Buyer, Admin).

### Quick Start

Frontend (Vite React):

1. cd `web`
2. `npm install`
3. (optional) copy `.env.example` to `.env.local` and adjust `VITE_API_BASE`
4. `npm run dev` → visit `http://localhost:5173`

Backend (Spring Boot):

1. Ensure MySQL is running and accessible locally
   - With Docker (recommended): use `docker-compose.yml` provided (requires Docker)
   - Or install MySQL via Homebrew and start it
2. Create DB and user:
   - Login as root, then run:
```
CREATE DATABASE IF NOT EXISTS synergy;
CREATE USER IF NOT EXISTS 'synergy'@'localhost' IDENTIFIED BY 'synergy_pw';
GRANT ALL PRIVILEGES ON synergy.* TO 'synergy'@'localhost';
FLUSH PRIVILEGES;
```
3. `cd backend`
4. `mvn spring-boot:run`

API base URL: `http://localhost:8080`

### Features (MVP scaffolding)

- Listings API: create, list, mark sold
- React pages: Home, Listings, Create Listing, Chat (placeholder), Admin (placeholder)
- CORS enabled for local dev

### Project Structure

- `web/` React app (Vite)
- `backend/` Spring Boot app (JPA, Validation, MySQL)
- `docker-compose.yml` MySQL + Adminer (optional, if Docker installed)

### Next Steps

- Implement authentication/roles (Seller, Buyer, Admin)
- Search and filter UI + API
- In-app chat service (WebSocket) and optional chatbot integration
- Admin moderation endpoints and UI
- Deploy API + DB to AWS (Auto-Scaled EC2 + Load Balancer)
- Create diagrams (Component + Deployment) and wireframes; maintain Scrum artifacts and Project Journal

### Environment

- Frontend: set `VITE_API_BASE` to point to deployed backend in production
- Backend config: `backend/src/main/resources/application.yml`
