from datetime import datetime
from pydantic import BaseModel
from typing import Optional, List


class User(BaseModel):
    github_id:str
    login:str
    email:Optional[str] = None
    name:Optional[str] = None
    bio:Optional[str] = None
    created_at:Optional[datetime] = datetime.utcnow()