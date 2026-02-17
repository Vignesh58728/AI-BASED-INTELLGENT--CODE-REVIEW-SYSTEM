from typing import Any, Dict, Optional, Union
from sqlalchemy.orm import Session
from app.models.progress import Progress
from app.schemas.progress import ProgressCreate, ProgressUpdate

def get_by_user_id(db: Session, user_id: int) -> Optional[Progress]:
    return db.query(Progress).filter(Progress.user_id == user_id).first()

def create(db: Session, *, obj_in: ProgressCreate) -> Progress:
    db_obj = Progress(
        user_id=obj_in.user_id,
        scores=obj_in.scores,
        current_module=obj_in.current_module,
        current_stage=obj_in.current_stage,
        failed_stage=obj_in.failed_stage
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update(
    db: Session, *, db_obj: Progress, obj_in: Union[ProgressUpdate, Dict[str, Any]]
) -> Progress:
    if isinstance(obj_in, dict):
        update_data = obj_in
    else:
        update_data = obj_in.model_dump(exclude_unset=True)
    
    for field in update_data:
        setattr(db_obj, field, update_data[field])
    
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj
