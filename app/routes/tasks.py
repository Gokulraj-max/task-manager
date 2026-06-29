from typing import Optional
from fastapi import APIRouter, Depends, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.user import User
from app.models.task import TaskStatus, TaskPriority
from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse, TaskPaginatedResponse
from app.middleware.auth import get_current_user
from app.services import task_service

router = APIRouter(prefix="/tasks", tags=["Tasks"])

@router.get("", response_model=TaskPaginatedResponse)
def get_all_tasks(
    search: Optional[str] = Query(None, description="Search term for title or description"),
    status_filter: Optional[str] = Query(None, alias="status", description="Filter tasks by status"),
    priority_filter: Optional[str] = Query(None, alias="priority", description="Filter tasks by priority"),
    sort: Optional[str] = Query("created_at", description="Sort by field: due_date, created_at, title, priority, status"),
    order: Optional[str] = Query("desc", description="Sort order: asc or desc"),
    page: int = Query(1, ge=1, description="Page number"),
    limit: int = Query(10, ge=1, le=100, description="Items per page"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Sanitize empty strings sent by query params to None
    clean_search = search if search and search.strip() != "" else None
    
    clean_status = None
    if status_filter and status_filter.strip() != "":
        try:
            clean_status = TaskStatus(status_filter.strip())
        except ValueError:
            clean_status = None

    clean_priority = None
    if priority_filter and priority_filter.strip() != "":
        try:
            clean_priority = TaskPriority(priority_filter.strip())
        except ValueError:
            clean_priority = None

    return task_service.get_tasks(
        user_id=current_user.id,
        db=db,
        search=clean_search,
        status_filter=clean_status,
        priority_filter=clean_priority,
        sort=sort,
        order=order,
        page=page,
        limit=limit
    )

@router.get("/{id}", response_model=TaskResponse)
def get_task(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return task_service.get_task_by_id(task_id=id, user_id=current_user.id, db=db)

@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_new_task(
    task_data: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return task_service.create_task(task_data=task_data, user_id=current_user.id, db=db)

@router.put("/{id}", response_model=TaskResponse)
def update_existing_task(
    id: int,
    task_data: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return task_service.update_task(task_id=id, task_data=task_data, user_id=current_user.id, db=db)

@router.delete("/{id}")
def delete_existing_task(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return task_service.delete_task(task_id=id, user_id=current_user.id, db=db)

@router.patch("/{id}/complete", response_model=TaskResponse)
def mark_task_as_completed(
    id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return task_service.mark_task_complete(task_id=id, user_id=current_user.id, db=db)
