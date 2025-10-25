# Quick Cart 🛒
_A prototype e-commerce web application_

Quick Cart is a full-stack e-commerce application that replicates core workflows of modern shopping platforms (e.g., Flipkart, Amazon) with a focus on **clean architecture, security, and containerized deployment**.  

The application supports **two primary roles**:  
- **Customers** → register, browse products, add to cart/wishlist, checkout, track orders.  
- **Sellers** → register as sellers, add and manage products.  

Authentication and role-based access control are handled by **Keycloak**.  
The system is fully containerized with **Docker Compose** for easy deployment.

<br>

## 🚀 Tech Stack
- **Backend:** Java, Spring Boot, Spring Security, Spring Data JPA  
- **Architecture:** Domain-Driven Design (DDD), Clean Architecture  
- **Database:** PostgreSQL  
- **Authentication:** Keycloak (OIDC, JWT)  
- **Frontend:** ReactJS + Redux + Tailwind CSS _(to be developed)_  
- **Infrastructure:** Docker, Docker Compose, EC2 (for deployment)  
- **Testing:** JUnit, Postman  

<br>

## 🛠️ Setup & Installation

### Prerequisites
- Docker & Docker Compose  
- Git  
- Java 21+ (if running backend outside Docker)  

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
- **pgadmin** → http://localhost:5050
- **Keycloak** → http://localhost:8080 (admin: `admin` / `admin`)  
- **PostgreSQL** → exposed only to containers

```
run spring boot application via IDE (on local setup)
```

This starts:
- **Backend** → http://localhost:8081 (admin: admin@gmail.com, pwd: Admin@123)

### Access Keycloak
1. Login to Keycloak Admin Console: http://localhost:8080 
2. Realm: `quickcart`  
3. Roles: `customer`, `seller`, `admin`  
4. Clients configured for backend + frontend

<br>

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


<br>

## 👨‍💻 Author

**Raju Gownda** | [rajugowda.in](https://rajugowda.in)

