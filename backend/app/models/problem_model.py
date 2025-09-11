from datetime import datetime
from pydantic import BaseModel
from typing import Optional, List


class Problem(BaseModel):
    title:str
    description:str
    difficulty:str
    tags:List[object]
    created_at:Optional[datetime] = datetime.utcnow()