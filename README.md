# Livra

<p align="center">
  <img src="./assets/banner.png" width="100%" alt="Livra Banner">
</p>

<p align="center">
  <strong>Digital Library Management System</strong>
</p>

<p align="center">
  A web-based library platform designed to simplify book discovery, borrowing, and library management.
</p>

---

## Overview

**Livra** is a digital library management system built to provide a simple and organized experience for both library users and administrators.

The platform allows users to browse available books, search for specific titles, manage their borrowing activity, and track borrowing history. Administrators can manage books, users, and borrowing transactions through a dedicated management system.

Livra was developed as a learning project to explore full-stack web development, REST API integration, authentication, database management, and responsive interface design.

---

## Features

### User

* User registration and login
* Browse available books
* Search and discover books
* View book details
* Borrow books
* Track borrowing status
* View borrowing history
* Manage user profile

### Admin

* Admin authentication
* Manage books
* Add, edit, and delete books
* Manage users
* Manage borrowing transactions
* Monitor borrowing activity

---

## Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Backend

* Express.js
* Node.js
* REST API

### Database

* MySQL

### Tools

* Git
* GitHub
* Postman
* Figma

---

## System Architecture

```text
                ┌─────────────────────┐
                │      Livra Web      │
                │  Next.js + React    │
                └──────────┬──────────┘
                           │
                           │ REST API
                           ▼
                ┌─────────────────────┐
                │      Backend        │
                │ Express.js + Node   │
                └──────────┬──────────┘
                           │
                           │ SQL
                           ▼
                ┌─────────────────────┐
                │       MySQL         │
                │      Database       │
                └─────────────────────┘
```

---

## Project Structure

```text
livra/
├── frontend/
│   ├── app/
│   ├── components/
│   ├── services/
│   ├── public/
│   └── ...
│
├── backend/
│   ├── controllers/
│   ├── routes/
│   ├── middleware/
│   ├── services/
│   ├── config/
│   └── ...
│
├── README.md
└── ...
```

---

## User Flow

```text
Register / Login
       │
       ▼
     Home
       │
       ├───────────────┐
       ▼               ▼
   Browse Books      Search
       │
       ▼
  Book Details
       │
       ▼
     Borrow
       │
       ▼
 Borrowing Status
       │
       ▼
 Borrowing History
```

---

## Database Overview

The system uses MySQL to store and manage application data such as:

```text
Users
  │
  ├── Authentication
  ├── Profile
  └── Role
       │
       ▼
     Books
       │
       ▼
   Borrowings
       │
       └── Borrowing Status
```

The database structure was designed to keep user, book, and borrowing data organized while maintaining relationships between related entities.

---

## Screenshots

### Homepage

<p align="center">
  <img src="./assets/home.png" width="90%" alt="Livra Homepage">
</p>

### Book Details

<p align="center">
  <img src="./assets/book-detail.png" width="90%" alt="Livra Book Details">
</p>

### Dashboard

<p align="center">
  <img src="./assets/dashboard.png" width="90%" alt="Livra Dashboard">
</p>

> Replace the image paths above with screenshots from your actual project.

---

## Getting Started

### Prerequisites

Make sure you have installed:

* Node.js
* npm
* MySQL
* Git

### Clone the Repository

```bash
git clone https://github.com/your-username/livra.git
cd livra
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at:

```text
http://localhost:3000
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

Configure your environment variables inside:

```text
.env
```

---

## API

The frontend communicates with the backend through RESTful API endpoints.

Example resources:

```text
/api/auth
/api/users
/api/books
/api/borrowings
```

The API handles authentication, book management, users, and borrowing transactions.
