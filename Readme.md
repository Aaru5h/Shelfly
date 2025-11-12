Shelfly – Smart Inventory & Product Management
Platform
Authentication & Authorization Secure user registration and login with JWT; role-based access (Admin / Staff)
CRUD Operations Create, Read, Update, Delete product and category entries
Advanced Searching Keyword-based, partial, and full-text search for quick product lookup
Filtering Filter by category, availability, stock status, and price range
Sorting Sort products by price, quantity, category, or date added
Pagination Server-side pagination to efficiently handle large product lists
Dashboard Insights Display total items, low-stock alerts, and recent activity
Analytics (Optional) Visualize inventory stats using Recharts or Chart.js
AI Integration (Optional) Use Gemini API for smart stock forecasting or trend analysis
1. Project Title
Shelfly – Smart Inventory & Product Management Platform
2. Problem Statement
In many small and medium-sized businesses, managing product inventory remains inefficient and
error-prone. From keeping track of stock levels to searching for specific items, users often rely on
manual spreadsheets or outdated systems lacking proper filtering, sorting, and pagination
mechanisms. Shelfly aims to provide an intuitive, centralized solution to manage inventory data
efficiently. It offers robust CRUD operations, advanced search and filter capabilities, real-time stock
insights, and server-side pagination to ensure seamless performance even with large datasets.
3. System Architecture
Frontend (Next.js + TailwindCSS / shadcn/ui) ® Backend API (Node.js + Express.js + Prisma
ORM) ® Database (MySQL / MongoDB Atlas)
5. Key Features
6. Tech Stack
Frontend Next.js, React, TailwindCSS / shadcn/ui, Axios
Backend Node.js, Express.js, Prisma ORM
Database MySQL (PlanetScale) / MongoDB Atlas
Authentication JWT
AI Integration Gemini API (Optional)
Hosting Vercel (frontend), Render / Railway (backend), AWS / MongoDB Atlas
7. API Overview
/api/auth/signup POST Register a new user Public
/api/auth/login POST Authenticate user and issue JWT Public
/api/products GET Retrieve paginated, searchable, and filterable list
of products
Authenticated
/api/products POST Add a new product to inventory Authenticated
/api/products/:id PUT Update existing product details Authenticated
/api/products/:id DELETE Delete a product entry Authenticated
/api/categories GET Retrieve all categories (with optional filters) Authenticated
/api/categories POST Add a new category Admin
/api/categories/:id PUT Update category details Admin
/api/categories/:id DELETE Remove category Admin
/api/dashboard GET Fetch analytics and inventory overview Authenticated
10. Summary
Shelfly transforms traditional inventory tracking into a modern, data-driven experience. With
advanced searching, sorting, filtering, and pagination, it ensures fast and intelligent product
management. The project demonstrates end-to-end proficiency in Next.js, Node.js, Express,
Prisma, and MySQL/MongoDB, making it a strong candidate for portfolio, hackathons, or
enterprise-level demonstrations.
