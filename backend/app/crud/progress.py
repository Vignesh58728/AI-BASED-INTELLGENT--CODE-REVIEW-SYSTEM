from typing import Any, Dict, Optional, Union
from beanie import PydanticObjectId
from app.models.progress import Progress
from app.models.user import User

async def get_by_user_id(user_id: str) -> Optional[Progress]:
    return await Progress.find_one(Progress.user.id == PydanticObjectId(user_id))

async def create(*, obj_in: Dict[str, Any]) -> Progress:
    user = await User.get(obj_in["user_id"])
    if not user:
        raise ValueError("User not found")
        
    db_obj = Progress(
        user=user,
        scores=obj_in.get("scores", {}),
        current_module=obj_in.get("current_module", "school"),
        current_stage=obj_in.get("current_stage", "beginner"),
        failed_stage=obj_in.get("failed_stage")
    )
    await db_obj.insert()
    return db_obj

async def update(
    *, db_obj: Progress, obj_in: Union[Dict[str, Any], Any]
) -> Progress:
    if isinstance(obj_in, dict):
        update_data = obj_in
    else:
        # Assuming Pydantic model
        update_data = obj_in.model_dump(exclude_unset=True)
    
    for field, value in update_data.items():
        setattr(db_obj, field, value)
    
    await db_obj.save()
    return db_obj
