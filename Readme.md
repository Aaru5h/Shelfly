#  Shelfly – Smart Inventory & Product Management Platform

Shelfly is a modern inventory and product management system designed for small and medium-sized businesses. It provides fast, intelligent, and structured inventory handling with features like advanced search, filtering, sorting, dashboard insights, and secure authentication.

---

##  Problem Statement

Many businesses still rely on spreadsheets or outdated tools for managing inventory, causing inefficiency and errors. These systems lack essential features like proper filtering, sorting, pagination, and real-time insights.

**Shelfly** solves these issues by offering a centralized, intuitive, and scalable inventory management platform with robust CRUD operations, smart search capabilities, and real-time stock monitoring.

---

##  System Architecture

Frontend (Next.js + TailwindCSS / shadcn/ui)
↓
Backend API (Node.js + Express.js + Prisma ORM)
↓
Database (MySQL / PlanetScale or MongoDB Atlas)

pgsql
Copy code

---

##  Key Features

-  **Authentication & Authorization**  
  Secure JWT-based login with role-based access (Admin / Staff)

-  **CRUD Operations**  
  Create, Read, Update, Delete products and categories

-  **Advanced Searching**  
  Keyword-based, partial, and full-text product search

-  **Filtering**  
  By category, availability, price range, stock status

-  **Sorting**  
  Sort by price, quantity, category, or date added

-  **Pagination**  
  Efficient server-side pagination for large datasets

-  **Dashboard Insights**  
  Total items, low-stock alerts, recent activity overview

-  **Analytics (Optional)**  
  Charts via Recharts or Chart.js

-  **AI Integration (Optional)**  
  Gemini API for stock forecasting or trend analysis

---

##  Tech Stack

### **Frontend**
- Next.js  
- React  
- TailwindCSS / shadcn/ui  
- Axios  

### **Backend**
- Node.js  
- Express.js  
- Prisma ORM  

### **Database**
- MySQL (PlanetScale) OR MongoDB Atlas  

### **Authentication**
- JWT (JSON Web Token)

### **Hosting**
- Vercel (Frontend)
- Render / Railway (Backend)
- PlanetScale / MongoDB Atlas (Database)

---

##  API Overview

| Endpoint | Method | Description | Access |
|---------|--------|-------------|--------|
| `/api/auth/signup` | POST | Register new user | Public |
| `/api/auth/login` | POST | Login and get JWT | Public |
| `/api/products` | GET | Get products with search, filter, pagination | Authenticated |
| `/api/products` | POST | Add new product | Authenticated |
| `/api/products/:id` | PUT | Update product | Authenticated |
| `/api/products/:id` | DELETE | Delete product | Authenticated |
| `/api/categories` | GET | Get all categories | Authenticated |
| `/api/categories` | POST | Add new category | Admin |
| `/api/categories/:id` | PUT | Edit category | Admin |
| `/api/categories/:id` | DELETE | Delete category | Admin |
| `/api/dashboard` | GET | Inventory stats & analytics | Authenticated |

---

##  Summary

Shelfly modernizes traditional inventory systems by offering fast search, intelligent filtering, clean UI, real-time insights, and seamless scalability.  
It demonstrates strong full-stack skills across **Next.js, Express.js, Prisma, SQL/NoSQL databases**, and optional **AI integration**, making it ideal for portfolios, hackathons, and enterprise use.

---

## Hosted Link

https://shelfly-upzi.vercel.app/login