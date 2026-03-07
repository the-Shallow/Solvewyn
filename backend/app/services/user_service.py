from ..db import db
from ..models.user_model import User
from ..utility import serialize_doc
from fastapi import HTTPException, status,Request
from fastapi.responses import JSONResponse
from ..config import settings
from openai import OpenAI
from bson.objectid import ObjectId
import requests
import httpx

collection = db["users"]

def create_user(user:User):
    try:
        existing = get_user_by_githubId(user.github_id)
        if existing:
            print(existing)
            jwt_token = settings.create_access_token(existing[0],None)
            response =  JSONResponse(
                status_code=status.HTTP_200_OK,
                content={"message":"User already exist on the system....","user_id":existing[0]["_id"]}
            )
            print(jwt_token)
            response.set_cookie(key="jwt_token",value=jwt_token,httponly=True,secure=False,samesite="lax")
            return response
    
        result = collection.insert_one(user.dict())
        
        if not result or not result.inserted_id:
            return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error":"Error creating user..."}
        )

        jwt_token = settings.create_access_token(user.dict(),None)
        response = JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"message":"User created successfully....","user_id":str(result.inserted_id)}
        ) 
        response.set_cookie(key="jwt_token",value=jwt_token,httponly=True,secure=False,samesite="lax")
        return response
    except Exception as e:
        print(e)
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error":str(e)}
        )

def get_problem(problem_id:str):
    result = list(collection.find({"_id":ObjectId(problem_id)}))
    serialized_result = [serialize_doc(doc) for doc in result]
    return serialized_result

def get_user_by_githubId(github_id:str):
    result = list(collection.find({"github_id":github_id}))
    serialized_result = [serialize_doc(doc) for doc in result]
    return serialized_result


def get_current_user(requests:Request):
    try:
        token = requests.cookies.get("jwt_token")
        print(token)
        if not token:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="No token"
            )

        payload = settings.verify_token(token=token)
        return get_user_by_githubId(payload["github_id"])
    except Exception as e:
        print(e)
        return JSONResponse(
            status_code=e.status_code,
            content={"error":str(e.detail)}
        )


def exchangeCodeForToken(code:str):
    try:
        print(code)
        res = requests.post("https://github.com/login/oauth/access_token",
                            data={
                                "client_id":settings.GITHUB_CLIENT_ID,
                                "client_secret":settings.GITHUB_CLIENT_SECRET,
                                "code":code
                            },
                            headers={
                                "Accept":"application/json"
                            })
        
        print(res.json())
        access_token = res.json().get("access_token")
        print(access_token)
        user_data = fetch_user_token(access_token)

        print(user_data['id'],user_data["login"])

        if not user_data:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
                content={"error":"Error fetching user data..."}
            )
    
        user = User(github_id=str(user_data["id"]),login=str(user_data["login"]),email=str(user_data["email"]))
        print(user)
        user_create = create_user(user)
        return user_create
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error":str(e)}
        )
    
def fetch_user_token(token:str):
    try:
        print(f"Bearer {token}")
        user_res = requests.get("https://api.github.com/user",
                                headers={"Authorization":f"Bearer {token}"})
        user_data = user_res.json()
        return user_data
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error":str(e)}
        )
    
async def github_exchange(req):
    if not settings.GITHUB_CLIENT_ID or not settings.GITHUB_CLIENT_SECRET:
        raise HTTPException(status_code=500, detail="Github OAuth env vars not set.")

    async with httpx.AsyncClient(timeout=20) as client:
        token_res = await client.post(
            "https://github.com/login/oauth/access_token",
            headers={"Accept": "application/json"},
            json = {
                "client_id": settings.GITHUB_CLIENT_ID,
                "client_secret": settings.GITHUB_CLIENT_SECRET,
                "code": req.code,
                "redirect_uri": req.redirect_uri,
            },
        )

        token_data = token_res.json()
        access_token = token_data.get("access_token")
        if not access_token:
            raise HTTPException(status_code=400, detail="Github token exchange failed.")

        user_res = await client.get(
            "https://api.github.com/user",
            headers={
                "Accept":"application/json",
                "Authorization": f"Bearer {access_token}"
            }
        )

        gh = user_res.json()

        if user_res.status_code != 200 or "id" not in gh:
            raise HTTPException(status_code=400, detail="Fetching Github user info failed.")

        user_data = {
            "github_id": str(gh.get("id")),
            "login": gh.get("login"),
            "email": gh.get("email"),
            "name": gh.get("name"),
            "bio": gh.get("bio"),
            }

        return {
            "access_token": access_token,
            "github": {
                "id": str(gh.get("id")),
                "login": gh.get("login"),
                "email": gh.get("email"),
                "name": gh.get("name"),
                "bio": gh.get("bio"),
            },
            "user": user_data,
        }