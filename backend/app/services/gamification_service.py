from datetime import datetime, timedelta
from typing import List, Optional
from app.models.user import User

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
            await user.save()
            return user
            
        last_login_date = user.last_login.date()
        
        if last_login_date == today:
            # Already logged in today
            return user
            
        if last_login_date == today - timedelta(days=1):
            # Logged in yesterday
            user.streak_count += 1
        else:
            # Missed a day
            user.streak_count = 1
            
        user.last_login = now
        
        # Check for badge updates
        await GamificationService.check_badges(user)
        
        await user.save()
        return user

    @staticmethod
    async def check_badges(user: User):
        """
        Award badges based on streaks and other criteria.
        """
        if not user.badges:
            user.badges = []
            
        # Streak Badges
        if user.streak_count >= 7 and "7-Day Streak" not in user.badges:
            user.badges.append("7-Day Streak")
        if user.streak_count >= 30 and "30-Day Streak" not in user.badges:
            user.badges.append("30-Day Streak")
            
    @staticmethod
    def get_badges_info() -> List[dict]:
        return [
            {"name": "7-Day Streak", "description": "Logged in for 7 consecutive days", "icon": "🔥"},
            {"name": "30-Day Streak", "description": "Logged in for 30 consecutive days", "icon": "💎"},
            {"name": "Bug Hunter", "description": "Fixed 10 major code bugs", "icon": "🐛"},
            {"name": "Security Expert", "description": "Solved all security challenges", "icon": "🛡️"},
        ]

gamification_service = GamificationService()
