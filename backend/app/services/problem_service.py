from ..db import db
from ..models.problem_model import Problem
from ..utility import serialize_doc
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse
from ..config import settings
from openai import OpenAI
from bson.objectid import ObjectId

collection = db["problems"]

def create_problem(problem:Problem):
    try:
        existing = get_problem_by_title(problem.title)
        if existing:
            return JSONResponse(
                status_code=status.HTTP_201_CREATED,
                content={"message":"Problem already exist on the system....","problem_id":existing[0]["_id"]}
            )
        result = collection.insert_one(problem.dict())
        
        if not result or not result.inserted_id:
            return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error":"Error creating problem...."}
        )

        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"message":"Problem created successfully....","problem_id":str(result.inserted_id)}
        ) 
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error":str(e)}
        )

def get_problem(problem_id:str):
    result = list(collection.find({"_id":ObjectId(problem_id)}))
    serialized_result = [serialize_doc(doc) for doc in result]
    return serialized_result

def get_problem_by_title(title:str):
    result = list(collection.find({"title":title}))
    serialized_result = [serialize_doc(doc) for doc in result]
    return serialized_result