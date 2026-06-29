from sqlalchemy.orm import Session
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserUpdate
from app.utils.hashing import hash_password, verify_password
from app.utils.jwt import create_access_token
from app.exceptions import UserAlreadyExistsException, InvalidCredentialsException

def register_user(user_data: UserCreate, db: Session) -> User:
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        raise UserAlreadyExistsException(email=user_data.email)
    
    hashed_pwd = hash_password(user_data.password)
    new_user = User(
        name=user_data.name,
        email=user_data.email,
        password=hashed_pwd
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

def authenticate_user(login_data: UserLogin, db: Session) -> dict:
    user = db.query(User).filter(User.email == login_data.email).first()
    if not user or not verify_password(login_data.password, user.password):
        raise InvalidCredentialsException()
    
    access_token = create_access_token(data={"sub": str(user.id)})
    return {"access_token": access_token, "token_type": "bearer"}

def update_user_profile(user: User, update_data: UserUpdate, db: Session) -> User:
    if update_data.name is not None:
        user.name = update_data.name
    if update_data.email is not None and update_data.email != user.email:
        existing = db.query(User).filter(User.email == update_data.email).first()
        if existing:
            raise UserAlreadyExistsException(email=update_data.email)
        user.email = update_data.email

    db.commit()
    db.refresh(user)
    return user
