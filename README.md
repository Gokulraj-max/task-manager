# Task Management API

A secure and scalable RESTful Task Management API built with **Python**, **FastAPI**, **PostgreSQL**, and **SQLAlchemy**. This project allows users to register, authenticate using JWT, and manage their personal tasks with features such as CRUD operations, search, filtering, and pagination.

---

## Features

### Authentication
- User Registration
- User Login
- JWT Authentication
- Password Hashing (bcrypt)
- Protected Routes
- User Profile

### Task Management
- Create Task
- View All Tasks
- View Single Task
- Update Task
- Delete Task
- Mark Task as Completed
- Mark Task as Pending

### Search & Filter
- Search tasks by title
- Search tasks by description
- Filter by status
- Filter by priority

### Pagination
- Retrieve tasks page by page
- Configurable page size

### Security
- JWT Token Authentication
- Password Hashing
- Input Validation
- Environment Variable Configuration

---

## Tech Stack

| Technology | Purpose |
|------------|---------|
| Python 3.12 | Programming Language |
| FastAPI | Backend Framework |
| PostgreSQL | Database |
| SQLAlchemy | ORM |
| Pydantic | Data Validation |
| JWT | Authentication |
| Passlib (bcrypt) | Password Hashing |
| Uvicorn | ASGI Server |
| Alembic | Database Migration |
| Pytest | Testing |

---

## Project Structure

```
task-manager/
│
├── app/
│   ├── models/
│   ├── schemas/
│   ├── routes/
│   ├── services/
│   ├── utils/
│   ├── database.py
│   ├── config.py
│   └── main.py
│
├── tests/
├── requirements.txt
├── .env
└── README.md
```

---

## Database Design

### Users

| Field | Type |
|------|------|
| id | Integer |
| name | String |
| email | String |
| password | String |
| created_at | DateTime |

### Tasks

| Field | Type |
|------|------|
| id | Integer |
| title | String |
| description | Text |
| status | String |
| priority | String |
| due_date | Date |
| created_at | DateTime |
| updated_at | DateTime |
| user_id | Foreign Key |

---

## REST API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /register | Register a new user |
| POST | /login | Login and receive JWT token |
| GET | /profile | Get logged-in user profile |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /tasks | Get all tasks |
| GET | /tasks/{id} | Get a task by ID |
| POST | /tasks | Create a task |
| PUT | /tasks/{id} | Update a task |
| DELETE | /tasks/{id} | Delete a task |
| PATCH | /tasks/{id}/complete | Mark task as completed |

### Search

```
GET /tasks?search=meeting
```

### Filter

```
GET /tasks?status=completed

GET /tasks?priority=high
```

### Pagination

```
GET /tasks?page=1&limit=10
```

---

## Authentication Flow

```
User Registration
        ↓
Password Hashing
        ↓
Store User in Database
        ↓
User Login
        ↓
Verify Password
        ↓
Generate JWT Token
        ↓
Access Protected APIs
```

---

## Running the Project

### Clone the Repository

```bash
git clone https://github.com/Gokulraj-max/task-manager.git
```

### Navigate to Project

```bash
cd task-manager
```

### Create Virtual Environment

```bash
python -m venv venv
```

### Activate Virtual Environment

Windows

```bash
venv\Scripts\activate
```

Linux / macOS

```bash
source venv/bin/activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Configure Environment Variables

Create a `.env` file:

```env
DATABASE_URL=postgresql://username:password@localhost/taskdb
SECRET_KEY=your_secret_key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Start the Server

```bash
uvicorn app.main:app --reload
```

---

## API Documentation

FastAPI automatically generates interactive API documentation.

- Swagger UI: `http://127.0.0.1:8000/docs`
- ReDoc: `http://127.0.0.1:8000/redoc`

---

## Testing

Run all tests:

```bash
pytest
```

---

## Future Improvements

- Role-Based Access Control (Admin/User)
- Task Categories
- File Attachments
- Email Notifications
- Soft Delete
- Activity Logs
- Docker Support
- Redis Caching
- CI/CD Pipeline

---

## Skills Demonstrated

- RESTful API Development
- CRUD Operations
- JWT Authentication
- Password Hashing
- SQLAlchemy ORM
- PostgreSQL
- FastAPI
- Pydantic Validation
- Exception Handling
- Pagination
- Search & Filtering
- Clean Architecture
- API Documentation
- Backend Security

---

## Author

**Govindh**

Backend Developer | Python | FastAPI | PostgreSQL
