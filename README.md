# Task Management API 🚀

A secure, multi-tenant, and scalable RESTful Task Management API built with **Python 3.12**, **FastAPI**, **PostgreSQL**, **SQLAlchemy**, and **React (Vite)**. This project allows users to securely register, authenticate using OAuth2 JWT tokens, manage personal tasks, and edit user profile details.

---

## 💡 Project Overview & Real-Life Scenario

The **Task Management API** provides a robust backend and frontend service that enables users to organize their daily workflows. Every user operates within an isolated account sandbox — users can only access and manage their own tasks.

### Real-Life Scenario Example
Imagine managing daily goals:
1. *Finish DSA Practice*
2. *Attend Tech Interview*
3. *Learn FastAPI & JWT*
4. *Buy Groceries*

After logging in, a user (e.g., **Gokul**) can:
- ➕ **Create Tasks**: `Title: Learn FastAPI`, `Priority: High`, `Due Date: 2026-07-15`
- 👁️ **View & Filter Tasks**: Retrieve personal tasks filtered by status (`pending`/`completed`) or priority (`high`).
- 🔄 **Update & Mark Complete**: Quickly mark tasks completed (`PATCH /tasks/{id}/complete`) which updates status to `Completed` and sets timestamp `updated_at`.
- ✏️ **Edit Profile**: Update account details such as user name (`PUT /profile`).
- 🔍 **Search Tasks**: Perform case-insensitive searches (e.g. `GET /tasks?search=FastAPI`).
- 📄 **Paginate Results**: Effortlessly paginate large lists (`GET /tasks?page=1&limit=10`).

### 🔒 User Data Isolation (Multi-Tenancy)
If **Gokul** (`user_id: 1`) and **Rahul** (`user_id: 2`) both use the platform:
- When Gokul calls `GET /tasks`, the backend extracts `user_id: 1` from Gokul's verified JWT token and returns **only** Gokul's tasks.
- Rahul cannot view, modify, or delete Gokul's tasks, ensuring strict data privacy.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Python 3.12 | Core Programming Language |
| FastAPI | High-Performance ASGI Web Framework |
| React 18 & Vite | Modern Frontend Framework & Build Tool |
| Axios | Promise-based HTTP Client for Browser |
| PostgreSQL / SQLite | Relational Database |
| SQLAlchemy 2.0 | Object-Relational Mapping (ORM) |
| Pydantic v2 | Data Validation & Schema Serialization |
| JWT (python-jose) | Secure Token-Based Authentication |
| Passlib (bcrypt) | Strong Password Hashing |
| Uvicorn | Lightning-fast ASGI Server |
| Pytest | Automated Testing Suite |

---

## 📁 Clean Architecture Folder Structure

```
task-manager-api/
│
├── app/
│   ├── core/               # Centralized app configuration & environment settings
│   ├── models/             # SQLAlchemy ORM database entities (User, Task)
│   ├── schemas/            # Pydantic request & response validation schemas
│   ├── routes/             # API endpoint controllers (Auth, Tasks)
│   ├── services/           # Encapsulated business logic, queries & filters
│   ├── utils/              # JWT token generation & password hashing utilities
│   ├── middleware/         # Security & authentication dependencies
│   ├── exceptions/         # Custom HTTP exception definitions
│   ├── database.py         # Database engine & session management
│   └── main.py             # FastAPI application entry point
│
├── frontend/               # React + Vite Single Page Application
│   ├── src/
│   │   ├── pages/          # Login, Register, Dashboard, Profile pages
│   │   ├── components/     # Navbar, Sidebar, TaskCard, TaskForm, SearchBar, Pagination
│   │   ├── services/       # Axios API client instance with JWT interceptor
│   │   ├── hooks/          # Custom useTasks data hook
│   │   └── context/        # Global AuthContext provider
│   ├── package.json
│   └── vite.config.js
│
├── tests/                  # Pytest test suites with in-memory SQLite isolation
├── .gitignore              # Git ignore rules for secrets, DBs, and bytecodes
├── requirements.txt        # Backend dependencies
├── .env                    # Environment variables file
└── README.md               # Complete project documentation
```

---

## 🗄️ Database Design

### Users Table (`users`)
| Column | Type | Constraints |
|--------|------|-------------|
| `id` | Integer | Primary Key, Indexed |
| `name` | String | Not Null |
| `email` | String | Unique, Indexed, Not Null |
| `password` | String | Hashed (bcrypt), Not Null |
| `created_at` | DateTime | Auto Timestamp |

### Tasks Table (`tasks`)
| Column | Type | Constraints |
|--------|------|-------------|
| `id` | Integer | Primary Key, Indexed |
| `title` | String | Not Null, Indexed |
| `description` | Text | Nullable |
| `status` | Enum | `pending` / `completed` |
| `priority` | Enum | `low` / `medium` / `high` |
| `due_date` | Date | Nullable |
| `created_at` | DateTime | Auto Timestamp |
| `updated_at` | DateTime | Auto Update Timestamp |
| `user_id` | Integer | Foreign Key (`users.id`), Not Null |

---

## 🌐 REST API Endpoints

### Authentication & Profile
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/register` | Register a new user account | ❌ No |
| `POST` | `/login` | Authenticate user & return JWT access token | ❌ No |
| `GET` | `/profile` | Get current authenticated user profile | 🔒 Yes (Bearer JWT) |
| `PUT` | `/profile` | Update current user profile details (e.g. name) | 🔒 Yes (Bearer JWT) |

### Task Management
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/tasks` | Get all user tasks (supports search, filter, sort, page) | 🔒 Yes (Bearer JWT) |
| `GET` | `/tasks/{id}` | Get specific task details by ID | 🔒 Yes (Bearer JWT) |
| `POST` | `/tasks` | Create a new task | 🔒 Yes (Bearer JWT) |
| `PUT` | `/tasks/{id}` | Update existing task details | 🔒 Yes (Bearer JWT) |
| `DELETE` | `/tasks/{id}` | Delete a task | 🔒 Yes (Bearer JWT) |
| `PATCH` | `/tasks/{id}/complete` | Mark task status as completed | 🔒 Yes (Bearer JWT) |

---

## 🚀 Running the Project

### 1. Start FastAPI Backend Server
```bash
# Install Python packages
pip install -r requirements.txt

# Launch Uvicorn server
uvicorn app.main:app --reload
```
- Interactive API Docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 2. Start React Frontend Server
```bash
# Navigate to frontend
cd frontend

# Install Node packages
npm install

# Launch Vite dev server
npm run dev
```
- React Web App UI: [http://localhost:3000](http://localhost:3000)

---

## 🧪 Automated Testing
Run the complete Pytest test suite:
```bash
pytest
```
