import math
from typing import Optional
from sqlalchemy.orm import Session
from sqlalchemy import or_, asc, desc
from app.models.task import Task, TaskStatus, TaskPriority
from app.schemas.task import TaskCreate, TaskUpdate
from app.exceptions import ItemNotFoundException

def create_task(task_data: TaskCreate, user_id: int, db: Session) -> Task:
    new_task = Task(
        title=task_data.title,
        description=task_data.description,
        status=task_data.status or TaskStatus.PENDING,
        priority=task_data.priority or TaskPriority.MEDIUM,
        due_date=task_data.due_date,
        user_id=user_id
    )
    db.add(new_task)
    db.commit()
    db.refresh(new_task)
    return new_task

def get_task_by_id(task_id: int, user_id: int, db: Session) -> Task:
    task = db.query(Task).filter(Task.id == task_id, Task.user_id == user_id).first()
    if not task:
        raise ItemNotFoundException(item_name="Task", item_id=task_id)
    return task

def get_tasks(
    user_id: int,
    db: Session,
    search: Optional[str] = None,
    status_filter: Optional[TaskStatus] = None,
    priority_filter: Optional[TaskPriority] = None,
    sort: Optional[str] = "created_at",
    order: Optional[str] = "desc",
    page: int = 1,
    limit: int = 10
) -> dict:
    query = db.query(Task).filter(Task.user_id == user_id)

    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Task.title.ilike(search_pattern),
                Task.description.ilike(search_pattern)
            )
        )

    if status_filter:
        query = query.filter(Task.status == status_filter)

    if priority_filter:
        query = query.filter(Task.priority == priority_filter)

    total = query.count()
    total_pages = math.ceil(total / limit) if total > 0 else 1

    # Sorting logic
    sort_column_map = {
        "due_date": Task.due_date,
        "created_at": Task.created_at,
        "title": Task.title,
        "priority": Task.priority,
        "status": Task.status
    }
    target_column = sort_column_map.get(sort.lower() if sort else "created_at", Task.created_at)
    
    if order and order.lower() == "asc":
        query = query.order_by(asc(target_column))
    else:
        query = query.order_by(desc(target_column))

    offset = (page - 1) * limit
    tasks = query.offset(offset).limit(limit).all()

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": total_pages,
        "data": tasks
    }

def update_task(task_id: int, task_data: TaskUpdate, user_id: int, db: Session) -> Task:
    task = get_task_by_id(task_id, user_id, db)
    update_dict = task_data.model_dump(exclude_unset=True)

    for key, value in update_dict.items():
        setattr(task, key, value)

    db.commit()
    db.refresh(task)
    return task

def delete_task(task_id: int, user_id: int, db: Session):
    task = get_task_by_id(task_id, user_id, db)
    db.delete(task)
    db.commit()
    return {"detail": "Task deleted successfully"}

def mark_task_complete(task_id: int, user_id: int, db: Session) -> Task:
    task = get_task_by_id(task_id, user_id, db)
    task.status = TaskStatus.COMPLETED
    db.commit()
    db.refresh(task)
    return task
