# CommerceIQ — E-Commerce Business Intelligence Dashboard

A full-stack web application combining e-commerce operations with business intelligence capabilities.

---

## 📦 Project Structure

```
commerceiq/
├── commerceiq-backend/     # Spring Boot REST API
└── commerceiq-frontend/    # React + Vite frontend
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version |
|------|---------|
| Java | 17+ |
| Maven | 3.8+ |
| Node.js | 18+ |
| MySQL | 8.0+ |

---

### 1. Database Setup

Open MySQL and run:

```sql
CREATE DATABASE IF NOT EXISTS commerceiq_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

No further manual setup needed — Hibernate will auto-create all tables on first run, and the `DataInitializer` bean will seed demo data.

---

### 2. Backend (Spring Boot)

```bash
cd commerceiq-backend

# Edit database credentials in:
# src/main/resources/application.properties
# Change: spring.datasource.username and spring.datasource.password

# Build & run
mvn clean install
mvn spring-boot:run
```

The API will start at: **http://localhost:8080**

---

### 3. Frontend (React + Vite)

```bash
cd commerceiq-frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

The frontend will start at: **http://localhost:5173**

The Vite dev server proxies `/api` requests to `http://localhost:8080`.

---

## 🔐 Default Credentials

| Username | Password | Role |
|----------|----------|------|
| `admin` | `admin123` | Admin |
| `manager` | `manager123` | Manager |
| `staff` | `staff123` | Staff |

---

## 🏗️ Architecture

```
React Frontend (Vite + Tailwind CSS)
        ↓ HTTP (JWT Bearer Token)
Spring Boot REST API (port 8080)
        ↓ JPA / Hibernate
MySQL Database (commerceiq_db)
```

### Backend Stack

- **Spring Boot 3.2** — Application framework
- **Spring Security + JWT** — Authentication & authorization
- **Spring Data JPA + Hibernate** — ORM layer
- **MySQL** — Relational database
- **Lombok** — Boilerplate reduction

### Frontend Stack

- **React 18** — UI framework
- **Vite** — Build tool
- **Tailwind CSS** — Utility-first styling
- **React Router v6** — Client-side routing
- **Axios** — HTTP client
- **Recharts** — Data visualization

---

## 📋 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login — returns JWT |
| POST | `/api/auth/register` | Register new user (Admin only) |

### Core Modules
| Module | Base URL |
|--------|----------|
| Products | `/api/products` |
| Categories | `/api/categories` |
| Suppliers | `/api/suppliers` |
| Customers | `/api/customers` |
| Orders | `/api/orders` |
| Payments | `/api/payments` |
| Dashboard | `/api/dashboard` |
| Reports | `/api/reports` |
| Notifications | `/api/notifications` |
| Users | `/api/users` |

All endpoints (except `/api/auth/login`) require `Authorization: Bearer <token>`.

---

## 🧩 Modules

| Module | Features |
|--------|----------|
| **Dashboard** | KPIs, revenue charts, order trends, top products |
| **Products** | CRUD, search, category & supplier assignment |
| **Categories** | CRUD for product categories |
| **Suppliers** | Supplier management with contact info |
| **Inventory** | Stock monitoring, low-stock alerts, adjustments |
| **Customers** | Customer records, search, status tracking |
| **Orders** | Full order lifecycle, status updates, item management |
| **Payments** | Payment tracking by method and status |
| **Reports** | Sales, inventory, customer, and payment analytics |
| **Users** | Admin-only user & role management |

---

## 🔒 Role-Based Access Control

| Role | Access |
|------|--------|
| **ROLE_ADMIN** | Full access including user management |
| **ROLE_MANAGER** | Create/update/delete most entities |
| **ROLE_STAFF** | Read access + create orders and customers |

---

## 🛠️ Production Build

```bash
# Frontend
cd commerceiq-frontend
npm run build
# Output in dist/ — serve with Nginx or similar

# Backend
cd commerceiq-backend
mvn clean package -DskipTests
java -jar target/commerceiq-backend-1.0.0.jar
```

For production, update `application.properties`:
```properties
spring.jpa.hibernate.ddl-auto=validate
spring.datasource.url=jdbc:mysql://your-prod-host:3306/commerceiq_db
app.cors.allowed-origins=https://your-domain.com
```
