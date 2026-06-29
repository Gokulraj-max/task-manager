from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.database import engine, Base
from app.routes import auth, tasks

# Create DB tables automatically on application start
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="RESTful Task Management API with JWT Authentication, Filtering, Sorting, Search, and Pagination",
    version="1.0.0"
)

# Enable CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(tasks.router)

@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to the Task Management REST API",
        "documentation": "/docs",
        "redoc": "/redoc"
    }
