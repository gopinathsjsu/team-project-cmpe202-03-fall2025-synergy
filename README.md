# Campus Marketplace

A campus-only marketplace application similar to Facebook Marketplace, designed for students to buy and sell textbooks, gadgets, essentials, and non-essentials within their campus community.

## 🎯 Project Overview

**Team Name:** Synergy  
**Course:** CMPE 202 - Software Engineering  
**Semester:** Fall 2025  
**Sprint Duration:** 6 sprints × 2 weeks each (Starting September 8th, 2025)

## 👥 Team Members

*[To be updated with actual team member names and contributions]*

| Team Member | Primary Contributions | Secondary Contributions |
|-------------|----------------------|------------------------|
| Member 1 | Backend Development (Spring Boot) | Database Design |
| Member 2 | Frontend Development (React.js) | UI/UX Design |
| Member 3 | Database & Cloud Deployment (PostgreSQL, AWS) | API Integration |
| Member 4 | Chat System & AI Integration | Testing & Quality Assurance |

## 🏗️ Technology Stack

### Frontend
- **React.js** - Modern UI framework for building responsive web applications
- **HTML5/CSS3** - Structure and styling
- **JavaScript (ES6+)** - Client-side logic

### Backend
- **Spring Boot** - Java-based framework for building RESTful APIs
- **Spring Security** - Authentication and authorization
- **Spring Data JPA** - Database operations and ORM

### Database
- **PostgreSQL** - Relational database for data persistence
- **AWS RDS** - Managed database service

### Cloud Infrastructure
- **AWS EC2** - Auto-scaled compute instances
- **AWS Application Load Balancer** - Traffic distribution
- **AWS S3** - File storage for images
- **AWS CloudWatch** - Monitoring and logging

### Additional Services
- **OpenAI ChatGPT API** - AI-powered search chatbot
- **WebSocket** - Real-time chat functionality

## 🎯 Key Features

### Core Functionality
- ✅ **User Management** - Registration, authentication, and role-based access
- ✅ **Listing Management** - Create, edit, and manage product listings with photos
- ✅ **Search & Filter** - Advanced search by category, price range, and keywords
- ✅ **In-App Chat** - Real-time messaging between buyers and sellers
- ✅ **Transaction Management** - Mark items as sold, track transaction status
- ✅ **Admin Panel** - Moderation tools and user management
- ✅ **Reporting System** - Report inappropriate listings or users
- ✅ **AI Chatbot** - ChatGPT-powered search assistant for finding items

### User Roles
1. **Seller** - Create and manage product listings
2. **Buyer** - Search, browse, and purchase items
3. **Admin** - Moderate content and manage users

## 🏛️ System Architecture

### Component Diagram
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React.js      │    │   Spring Boot   │    │   PostgreSQL    │
│   Frontend      │◄──►│   Backend API   │◄──►│   Database      │
│                 │    │                 │    │                 │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   AWS S3        │    │   AWS EC2       │    │   AWS RDS       │
│   File Storage  │    │   Auto Scaling  │    │   Managed DB    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### Deployment Diagram
```
┌─────────────────────────────────────────────────────────────────┐
│                        AWS Cloud                                │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   Load Balancer │  │   EC2 Instance  │  │   EC2 Instance  │ │
│  │                 │  │   (Spring Boot) │  │   (Spring Boot) │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
│           │                     │                     │         │
│           └─────────────────────┼─────────────────────┘         │
│                                 │                               │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐ │
│  │   AWS RDS       │  │   AWS S3        │  │   CloudWatch    │ │
│  │   PostgreSQL    │  │   File Storage  │  │   Monitoring    │ │
│  └─────────────────┘  └─────────────────┘  └─────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
                    ┌─────────────────┐
                    │   React.js      │
                    │   Frontend      │
                    │   (Local Dev)   │
                    └─────────────────┘
```

## 🚀 Getting Started

### Prerequisites
- Java 17 or higher
- Node.js 16 or higher
- PostgreSQL 13 or higher
- AWS CLI configured
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-team/campus-marketplace.git
   cd campus-marketplace
   ```

2. **Backend Setup**
   ```bash
   cd backend
   ./mvnw clean install
   ./mvnw spring-boot:run
   ```

3. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Database Setup**
   ```bash
   # Create database
   createdb campus_marketplace
   
   # Run migrations
   ./mvnw flyway:migrate
   ```

### Environment Variables
Create `.env` files for configuration:

**Backend (.env)**
```env
DB_URL=jdbc:postgresql://localhost:5432/campus_marketplace
DB_USERNAME=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret
AWS_ACCESS_KEY=your_aws_key
AWS_SECRET_KEY=your_aws_secret
OPENAI_API_KEY=your_openai_key
```

**Frontend (.env)**
```env
REACT_APP_API_URL=http://localhost:8080/api
REACT_APP_WS_URL=ws://localhost:8080/ws
```

## 📋 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### Listing Endpoints
- `GET /api/listings` - Get all listings with filters
- `POST /api/listings` - Create new listing
- `GET /api/listings/{id}` - Get specific listing
- `PUT /api/listings/{id}` - Update listing
- `DELETE /api/listings/{id}` - Delete listing

### Chat Endpoints
- `GET /api/chat/conversations` - Get user conversations
- `POST /api/chat/messages` - Send message
- `GET /api/chat/messages/{conversationId}` - Get conversation messages

### AI Chatbot Endpoints
- `POST /api/chatbot/search` - AI-powered item search

## 🗄️ Database Schema

### Core Tables
- `users` - User accounts and profiles
- `listings` - Product listings
- `categories` - Product categories
- `conversations` - Chat conversations
- `messages` - Chat messages
- `transactions` - Purchase transactions
- `reports` - User reports

## 🎨 UI Wireframes

*[Wireframes will be added here - created using tools like Pencil or hand-drawn]*

### Key Screens
1. **Homepage** - Featured listings and search
2. **Login/Register** - User authentication
3. **Create Listing** - Seller form for new items
4. **Listing Details** - Item view with chat option
5. **Chat Interface** - Real-time messaging
6. **User Dashboard** - Manage listings and transactions
7. **Admin Panel** - Moderation and user management

## 🏃‍♂️ Agile Development Process

### Scrum Methodology
- **Sprint Duration:** 2 weeks
- **Daily Standups:** Weekly team meetings
- **Sprint Planning:** Beginning of each sprint
- **Sprint Review:** End of each sprint
- **Retrospectives:** Continuous improvement

### Project Artifacts
- **Product Backlog:** [Link to Google Sheet/Project Board]
- **Sprint Backlog:** [Link to Sprint-specific tasks]
- **Burndown Chart:** [Link to progress tracking]
- **Project Journal:** [Link to GitHub Project Journal]

### XP Core Values Implementation
1. **Communication** - Daily standups, pair programming, and regular team meetings
2. **Simplicity** - Focus on MVP features, clean code, and minimal viable architecture

## 📊 Project Timeline

| Sprint | Duration | Focus Area | Deliverables |
|--------|----------|------------|--------------|
| Sprint 1 | Week 1-2 | Project Setup & Planning | Architecture, Database Design, Basic UI |
| Sprint 2 | Week 3-4 | Core Backend | User Management, Listing APIs |
| Sprint 3 | Week 5-6 | Frontend Development | React Components, User Interface |
| Sprint 4 | Week 7-8 | Chat System | Real-time messaging, WebSocket integration |
| Sprint 5 | Week 9-10 | AI Integration & Cloud Deployment | ChatGPT API, AWS deployment |
| Sprint 6 | Week 11-12 | Testing & Polish | Bug fixes, performance optimization, demo prep |

## 🧪 Testing Strategy

### Backend Testing
- Unit tests for service layers
- Integration tests for API endpoints
- Database integration tests

### Frontend Testing
- Component unit tests (Jest/React Testing Library)
- Integration tests for user workflows
- End-to-end tests (Cypress)

### Performance Testing
- Load testing for API endpoints
- Database performance optimization
- Frontend performance monitoring

## 🚀 Deployment

### AWS Infrastructure
- **EC2 Auto Scaling Group** - Handles traffic spikes
- **Application Load Balancer** - Distributes requests
- **RDS PostgreSQL** - Managed database with backups
- **S3 Bucket** - Static file storage
- **CloudWatch** - Monitoring and alerting

### CI/CD Pipeline
- GitHub Actions for automated testing
- Automated deployment to AWS
- Environment-specific configurations

## 📈 Monitoring & Analytics

### Application Monitoring
- AWS CloudWatch for system metrics
- Custom logging for business events
- Error tracking and alerting

### User Analytics
- User engagement metrics
- Popular categories and listings
- Chat usage statistics

## 🔒 Security Considerations

- JWT-based authentication
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- HTTPS enforcement
- Role-based access control

## 🤖 AI Chatbot Features

The integrated ChatGPT-powered chatbot provides:
- Natural language search for items
- Category-based recommendations
- Price range suggestions
- Availability status queries

Example queries:
- "Do you have a used textbook for CMPE 202?"
- "Show me laptops under $500"
- "What electronics are available?"

## 📝 Project Journal

[Link to GitHub Project Journal](https://github.com/your-team/campus-marketplace/projects/1)

### Weekly Scrum Reports
Each team member maintains weekly reports answering:
1. What tasks did I work on/complete?
2. What am I planning to work on next?
3. What tasks are blocked waiting on another team member?

## 📋 Project Board

[Link to Google Sheet/Project Board](https://docs.google.com/spreadsheets/d/your-sheet-id)

### Backlog Management
- Product Backlog with user stories
- Sprint Backlog with task breakdown
- Burndown Chart for progress tracking

## 🎯 Demo Day

**Date:** Tuesday, December 2nd, 2025 at 6:00 PM PST  
**Location:** [To be announced]

### Demo Features
- User registration and authentication
- Creating and managing listings
- Search and filtering functionality
- Real-time chat system
- AI chatbot integration
- Admin moderation tools

## 📊 Grading Rubric

### Team Score (100 points)
- **Implementation (70%)** - Working software demonstration
- **Process & Documentation (30%)** - Scrum artifacts, diagrams, XP values

### Individual Contributions
- Component ownership and completion
- GitHub commit frequency and quality
- Code review participation
- Documentation contributions

## 🤝 Contributing

### Development Workflow
1. Create feature branch from `main`
2. Implement changes with tests
3. Submit pull request for review
4. Merge after approval

### Code Standards
- Follow Java/Spring Boot best practices
- Use ESLint for JavaScript/React
- Write comprehensive tests
- Document all public APIs

## 📞 Support & Contact

For questions or issues:
- Create GitHub issues for bugs
- Use team Slack channel for discussions
- Contact team lead for urgent matters

## 📄 License

This project is developed for educational purposes as part of CMPE 202 coursework.

---

**Last Updated:** [Current Date]  
**Version:** 1.0.0  
**Status:** In Development
