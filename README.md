# Task Management API 🚀

A secure, multi-tenant, and scalable RESTful Task Management API built with **Python 3.12**, **FastAPI**, **PostgreSQL**, and **SQLAlchemy**. This project allows users to securely register, authenticate using OAuth2 JWT tokens, and manage their personal daily tasks with CRUD operations, search, filtering, sorting, and pagination.

---

## 💡 Project Overview & Real-Life Scenario

The **Task Management API** provides a robust backend service that enables users to organize their daily workflows. Every user operates within an isolated account sandbox — users can only access and manage their own tasks.

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
| PostgreSQL / SQLite | Relational Database |
| SQLAlchemy 2.0 | Object-Relational Mapping (ORM) |
| Pydantic v2 | Data Validation & Schema Serialization |
| JWT (python-jose) | Secure Token-Based Authentication |
| Passlib (bcrypt) | Strong Password Hashing |
| Uvicorn | Lightning-fast ASGI Server |
| Alembic | Database Migrations |
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
├── tests/                  # Pytest test suites with in-memory SQLite isolation
├── .gitignore              # Git ignore rules for secrets, DBs, and bytecodes
├── requirements.txt        # Production & development dependencies
├── .env                    # Environment variables file
└── README.md               # Project documentation
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

### Authentication
| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/register` | Register a new user account | ❌ No |
| `POST` | `/login` | Authenticate user & return JWT access token | ❌ No |
| `GET` | `/profile` | Get current authenticated user profile | 🔒 Yes (Bearer JWT) |

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

## 🚀 Getting Started

### 1. Clone & Setup
```bash
git clone https://github.com/Gokulraj-max/task-manager.git
cd task-manager
```

### 2. Virtual Environment
```bash
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run Server
```bash
uvicorn app.main:app --reload
```

### 5. Interactive Documentation
- **Swagger UI**: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- **ReDoc**: [http://127.0.0.1:8000/redoc](http://127.0.0.1:8000/redoc)

---

## 🧪 Automated Testing
Run the complete Pytest test suite:
```bash
pytest
```

---

## 🎯 Skills Demonstrated for Backend Technical Interviews
- **RESTful API Architecture**: Standard HTTP methods, status codes, and JSON serialization.
- **Relational Database Modeling**: 1-to-many ORM relationships and cascade rules with SQLAlchemy.
- **Authentication & Security**: Bcrypt password hashing, OAuth2 Bearer JWT token generation/validation.
- **Multi-Tenant Data Privacy**: Strict authorization ensuring users access only their owned records.
- **Advanced Querying**: Dynamic filters, full-text search, multi-column sorting, and offset pagination.
- **Clean Code & Test Driven Development**: Decoupled clean architecture with 100% test pass rates.
