from fastapi import APIRouter, Depends,Request
from pydantic import BaseModel
from ..services import user_service
from ..models.user_model import User

router = APIRouter(prefix="/users",tags=["users"])

class GithubExchangeRequest(BaseModel):
    code: str
    redirect_uri: str

@router.post("/")
def create_user(user:User):
    return user_service.create_user(user=user)

@router.get("/me")
def get_current_user(request:Request):
    return user_service.get_current_user(request)

@router.get("/{github_id}")
def get_user_by_githubid(github_id):
    return user_service.get_user_by_githubId(github_id=github_id)

@router.post("/auth/{code}")
def codeToToken(code:str):
    return user_service.exchangeCodeForToken(code)

@router.post("/github/exchange")
async def github_exchange_endpoint(request:GithubExchangeRequest):
    return await user_service.github_exchange(request)