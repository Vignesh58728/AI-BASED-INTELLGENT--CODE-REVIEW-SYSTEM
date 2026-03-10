import asyncio
import os
import sys

# Add the backend directory to sys.path
sys.path.append(os.getcwd())

from app.db.session import init_db
from app.models.user import User

async def list_users():
    try:
        await init_db()
        users = await User.find_all().to_list()
        print(f"TOTAL USERS: {len(users)}")
        for i, u in enumerate(users):
            print(f"--- User {i+1} ---")
            print(f"Email: {u.email}")
            print(f"Username: {u.username}")
            print(f"Name: {u.full_name}")
            print(f"Role: {u.role}")
            print(f"Photo: {'Set' if u.photo else 'Not Set'}")
    except Exception as e:
        print(f"ERROR: {e}")

if __name__ == "__main__":
    asyncio.run(list_users())
