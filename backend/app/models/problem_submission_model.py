from datetime import datetime
from pydantic import BaseModel
from typing import Optional


class ProblemSubmission(BaseModel):
    problem_id:str
    user_id:str
    code:str
    title:str
    language:str
    created_at:Optional[datetime] = datetime.utcnow()