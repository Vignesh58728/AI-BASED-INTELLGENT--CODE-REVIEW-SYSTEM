from datetime import datetime, timedelta
from typing import List, Optional
from app.models.user import User
from app.models.sql_models import SQLUser
from app.db.session import USE_SQL, SessionLocal

class GamificationService:
    @staticmethod
    async def update_streak(user: User) -> User:
        """
        Updates the user's login streak.
        Logic:
        - If last login was yesterday: streak += 1
        - If last login was today: do nothing
        - If last login was more than 1 day ago: streak = 1
        """
        now = datetime.utcnow()
        today = now.date()
        
        if not user.last_login:
            user.streak_count = 1
            user.last_login = now
            await GamificationService._save_user(user)
            return user
            
        last_login_date = user.last_login.date() if hasattr(user.last_login, "date") else user.last_login
        if not isinstance(last_login_date, datetime) and hasattr(last_login_date, "date"):
             last_login_date = last_login_date.date()
        
        # Handle cases where it might be a date already or needs conversion
        if hasattr(last_login_date, "date"):
            last_login_date = last_login_date.date()

        if last_login_date == today:
            return user
            
        if last_login_date == today - timedelta(days=1):
            user.streak_count += 1
        else:
            user.streak_count = 1
            
        user.last_login = now
        await GamificationService.check_badges(user)
        await GamificationService._save_user(user)
        return user

    @staticmethod
    async def _save_user(user: User):
        if USE_SQL:
            db = SessionLocal()
            try:
                # Need to refresh/merge if it came from a different session
                if isinstance(user, SQLUser):
                    db.add(user)
                    db.commit()
                    db.refresh(user)
                else:
                    # If it's not SQLUser but we are in SQL mode (unlikely but possible during transitions)
                    local_user = db.query(SQLUser).filter(SQLUser.id == user.id).first()
                    if local_user:
                        local_user.streak_count = user.streak_count
                        local_user.last_login = user.last_login
                        local_user.badges = user.badges
                        db.commit()
            finally:
                db.close()
        else:
            await user.save()

    @staticmethod
    async def check_badges(user: User):
        """
        Award badges based on streaks and other criteria.
        """
        if not user.badges:
            user.badges = []
        
        # Ensure we are working with a list (JSON fields in SQL might return lists)
        badges = list(user.badges) if user.badges else []
            
        # Streak Badges
        changed = False
        if user.streak_count >= 7 and "7-Day Streak" not in badges:
            badges.append("7-Day Streak")
            changed = True
        if user.streak_count >= 30 and "30-Day Streak" not in badges:
            badges.append("30-Day Streak")
            changed = True
            
        if changed:
            user.badges = badges

    @staticmethod
    def get_badges_info() -> List[dict]:
        return [
            {"name": "7-Day Streak", "description": "Logged in for 7 consecutive days", "icon": "🔥"},
            {"name": "30-Day Streak", "description": "Logged in for 30 consecutive days", "icon": "💎"},
            {"name": "Bug Hunter", "description": "Fixed 10 major code bugs", "icon": "🐛"},
            {"name": "Security Expert", "description": "Solved all security challenges", "icon": "🛡️"},
        ]

gamification_service = GamificationService()
