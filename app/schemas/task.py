from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, date
from typing import Optional, List
from app.models.task import TaskStatus, TaskPriority

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200, description="Task title is required")
    description: Optional[str] = Field(None, description="Optional task detailed description")
    status: Optional[TaskStatus] = TaskStatus.PENDING
    priority: Optional[TaskPriority] = TaskPriority.MEDIUM
    due_date: Optional[date] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    priority: Optional[TaskPriority] = None
    due_date: Optional[date] = None

class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str]
    status: TaskStatus
    priority: TaskPriority
    due_date: Optional[date]
    created_at: datetime
    updated_at: datetime
    user_id: int

    model_config = ConfigDict(from_attributes=True)

class TaskPaginatedResponse(BaseModel):
    total: int
    page: int
    limit: int
    total_pages: int
    data: List[TaskResponse]
