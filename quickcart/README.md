# Quick Cart 🛒
_A prototype e-commerce web application_

Quick Cart is a full-stack e-commerce application that replicates core workflows of modern shopping platforms (e.g., Flipkart, Amazon) with a focus on **clean architecture, security, and containerized deployment**.  

The application supports **two primary roles**:  
- **Customers** → register, browse products, add to cart/wishlist, checkout, track orders.  
- **Sellers** → register as sellers, add and manage products.  

Authentication and role-based access control are handled by **Keycloak**.  
The system is fully containerized with **Docker Compose** for easy deployment.

---

## 🚀 Tech Stack
- **Backend:** Java, Spring Boot, Spring Security, Spring Data JPA  
- **Architecture:** Domain-Driven Design (DDD), Clean Architecture  
- **Database:** PostgreSQL  
- **Authentication:** Keycloak (OIDC, JWT)  
- **Frontend:** ReactJS + Redux + Tailwind CSS _(to be developed)_  
- **Infrastructure:** Docker, Docker Compose, EC2 (for deployment)  
- **Testing:** JUnit, Postman  

---

## 📌 Features Implemented (Current Progress)
- Requirement gathering and system design (Architecture, ERD, Flow diagrams).  
- Dockerized infrastructure for **Backend + PostgreSQL + Keycloak**.  
- Keycloak setup with **realm, clients, and roles** (Customer, Seller, Admin).  
- Backend integration with Keycloak:  
  - Obtain and refresh access tokens using client credentials.  
  - Fetch roles from realm.  
  - Register new users via backend → map roles → create/update profile in DB.  
  - Store tokens in in-memory singleton beans with auto-refresh.  
- Implemented **User Registration Flow** (Keycloak + DB profile sync).  
- Entities and models structured using **DDD and Clean Architecture principles**.  

---

## 🛠️ Setup & Installation

### Prerequisites
- Docker & Docker Compose  
- Git  
- Java 17+ (if running backend outside Docker)  

### Clone the repository
```bash
git clone https://github.com/<your-username>/quickcart-backend.git
cd quickcart-backend
```

### Run with Docker Compose
```bash
docker-compose up --build
```

This starts:
- **Backend** → http://localhost:8081  
- **Keycloak** → http://localhost:8080 (admin: `admin` / `admin`)  
- **PostgreSQL** → exposed only to containers  

### Access Keycloak
1. Login to Keycloak Admin Console: http://localhost:8081  
2. Realm: `quickcart`  
3. Roles: `customer`, `seller`, `admin`  
4. Clients configured for backend + frontend

⚠ **Requires admin registration, realm creation and roles assignment in the keycloak dashboard to successfully work**

---

## 🔗 API Endpoints (Implemented So Far)

### User Management
- `POST /api/auth/register` → Register a new user (creates in Keycloak + DB profile).  
- `GET /api/auth/roles` → Fetch roles from Keycloak realm.  
- (More APIs in progress…)

### Example Response (Register User)
```json
{
    "success": true,
    "message": "User registered successfully",
    "data": {},
    "timestamp": "2025-09-22T13:08:57.000979513"
}
```

---

## 📅 Planned Work
- **Backend:**  
  - Product management (list, add, update, delete).  
  - Cart and wishlist modules.  
  - Order placement and history tracking.  

- **Frontend:**  
  - ReactJS interface with product browsing, cart, checkout.  
  - Integration with backend APIs and Keycloak.  

- **Testing & Deployment:**  
  - Unit and integration tests.  
  - User acceptance testing (UAT).  
  - Deployment on EC2 with S3-hosted frontend.  

---

## 📂 Repository Structure
```
quickcart-backend/
├── src/                # Spring Boot source code
│   ├── domain/         # Domain entities (DDD)
│   ├── application/    # Use cases / services
│   ├── infrastructure/ # Persistence, Keycloak integration
│   └── api/            # Controllers
├── docker-compose.yml
├── README.md
└── docs/               # Diagrams (Architecture, ERD, Flows)
```

---

## 👨‍💻 Author

**Raju Gownda** | [rajugowda.in](https://rajugowda.in)

---
