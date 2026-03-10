from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from app.core.dependencies import get_current_user
from app.models.user import User
from app.models.notification import Notification

router = APIRouter()

@router.get("/", response_model=List[Notification])
async def get_notifications(
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get all notifications for current user.
    """
    notifications = await Notification.find(Notification.user_id == str(current_user.id)).sort(-Notification.created_at).to_list()
    return notifications

@router.post("/mark-all-read")
async def mark_all_as_read(
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Mark all notifications as read.
    """
    await Notification.find(Notification.user_id == str(current_user.id), Notification.is_read == False).update({"$set": {"is_read": True}})
    return {"status": "success"}

@router.post("/login-event")
async def create_login_notification(
    current_user: User = Depends(get_current_user)
) -> Any:
    notification = Notification(
        user_id=str(current_user.id),
        type="login",
        title="Login Successful",
        description=f"Welcome back, {current_user.full_name}! You successfully logged in.",
        is_read=False
    )
    await notification.insert()
    return notification

@router.post("/download-event")
async def create_download_notification(
    book_name: str,
    current_user: User = Depends(get_current_user)
) -> Any:
    notification = Notification(
        user_id=str(current_user.id),
        type="download",
        title="Resource Downloaded",
        description=f"The e-book '{book_name}' has been successfully downloaded.",
        is_read=False
    )
    await notification.insert()
    return notification
