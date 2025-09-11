import os
import jwt
from dotenv import load_dotenv
from datetime import datetime, timedelta
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse


base_dir = os.path.dirname(os.path.abspath(__file__))
env_path = os.path.join(base_dir, '.env')
load_dotenv(env_path)

class Settings:
    MONGO_URI = os.getenv("MONGO_URI").strip('"\'')
    DB_NAME = os.getenv("DB_NAME").strip('"\'')
    OPENAI_KEY = os.getenv("OPENAI_KEY").strip('"\'')
    GITHUB_CLIENT_ID = os.getenv("GITHUB_CLIENT_ID").strip('"\'')
    GITHUB_CLIENT_SECRET = os.getenv("GITHUB_CLIENT_SECRET").strip('"\'')
    ACCESS_TOKEN_EXPIRY=os.getenv("ACCESS_TOKEN_EXPIRY").strip('"\'')
    JWT_SECRET_KEY=os.getenv("JWT_SECRET_KEY").strip('"\'')
    ALGORITHM=os.getenv("ALGORITHM").strip('"\'')


    def create_access_token(self,data:dict,expires_delta:timedelta=None):
        try:
            to_encode = {
              "github_id":data["github_id"]   
            }
            if expires_delta:
                expire = datetime.utcnow() + expires_delta
            else:
                expire = datetime.utcnow() + timedelta(minutes=float(Settings.ACCESS_TOKEN_EXPIRY))
            to_encode.update({"exp":expire})
            print("Algorithm:", Settings.ALGORITHM, type(Settings.ALGORITHM))
            encoded_jwt = jwt.encode(to_encode,str(Settings.JWT_SECRET_KEY),algorithm=str(Settings.ALGORITHM))
            return encoded_jwt
        except Exception as e:
            raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )
    
    def verify_token(self,token:str):
        try:
            print(token,Settings.JWT_SECRET_KEY,Settings.ALGORITHM)
            payload = jwt.decode(jwt=token,key=Settings.JWT_SECRET_KEY,algorithms=[Settings.ALGORITHM])
            return payload
        except jwt.ExpiredSignatureError:
            raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token Expired"
        )
        except jwt.InvalidTokenError:
            raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Token"
        )

settings = Settings()