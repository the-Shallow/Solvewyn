from urllib import response
from ..db import db
from ..models.problem_submission_model import ProblemSubmission
from ..utility import serialize_doc
from fastapi import HTTPException, status
from fastapi.responses import JSONResponse
from ..config import settings
from openai import OpenAI
import requests
from bson.objectid import ObjectId
import re
from bs4 import BeautifulSoup
import json

submission_collection = db["problem_submissions"]
problem_collection = db["problems"]

def create_submission(problem_submission:ProblemSubmission):
    try:

        result = submission_collection.insert_one(problem_submission.dict())
        
        if not result or not result.inserted_id:
            return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error":"Error uploading submission to app...."}
        )

        return JSONResponse(
            status_code=status.HTTP_201_CREATED,
            content={"message":"Submission uploaded successfully...."}
        ) 
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error":str(e)}
        )

def get_submissions_by_user(user_id:str):
    try:
        result = list(submission_collection.aggregate([
            {
                "$addFields":{
                    "problemid":{"$toObjectId":"$problem_id"}
                }
            },
            {
                "$lookup":{
                    "from":"problems",
                    "localField":"problemid",
                    "foreignField":"_id",
                    "as":"problem_info"
                }
            },
            {"$unwind":"$problem_info"},
            {"$match":{"user_id":user_id}},
            {
                "$project":{
                    "_id":0,
                    "problem_id":"$problem_id",
                    "problem_title":"$problem_info.title",
                    "problem_description":"$problem_info.description",
                    "problem_difficulty":"$problem_info.difficulty",
                    "problem_tags":"$problem_info.tags",
                    "language":1,
                }
            },
        ]))

        if not result:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
            content={"error":"Error fetching submission data...."}
            )
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message":"Submission fetched successfully....","submissions":result}
        )
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error":str(e)}
        )

def get_submission_data_by_problem(problem_id:str,user_id:str):
    try:
        result = list(submission_collection.aggregate([
            {
                "$addFields":{
                    "problemid":{"$toObjectId":"$problem_id"}
                }
            },
            {
                "$lookup":{
                    "from":"problems",
                    "localField":"problemid",
                    "foreignField":"_id",
                    "as":"problem_info"
                }
            },
            {"$unwind":"$problem_info"},
            {"$match":{"user_id":user_id, "problem_id":problem_id}},
            {
                "$project":{
                    "_id":0,
                    "problem_title":"$problem_info.title",
                    "problem_description":"$problem_info.description",
                    "problem_difficulty":"$problem_info.difficulty",
                    "problem_tags":"$problem_info.tags",
                    "language":1,
                    "code":1
                }
            },
        ]))

        if not result:
            return JSONResponse(
                status_code=status.HTTP_400_BAD_REQUEST,
            content={"error":"Error fetching submission data...."}
            )
        
        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message":"Submission fetched successfully....","submission":result}
        )
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error":str(e)}
        ) 



def get_ai_suggestion(problem_id:str,user_id:str):
    try:
        problem_submission_details = get_submission_data_by_problem(problem_id=problem_id,user_id=user_id)
        submission_data = json.loads(problem_submission_details.body)['submission'][0]
        description = re.split(r"example",submission_data["problem_description"],re.IGNORECASE)[0]
        # print(description)
        soup = BeautifulSoup(description,'html.parser')
        description = soup.get_text().strip() 
        # print({"role":"system","content":"You are an expert software reviewer and performance optimizer.  When the user provides a code snippet along with its title and description,  perform the following tasks in order: 1. Analyze the given code for correctness, maintainability, and clarity. 2. Suggest improvements to coding style, readability, and structure. 3. Optimize the code for better time complexity and memory usage. 4. Return an improved, working version of the code. 5. Clearly explain how the optimization impacts time and memory complexity. 6. If applicable, mention alternative algorithms or data structures that can improve performance. Always format your json output as: Analysis:{ <your detailed analysis } Improved Code:{ <your improved code here> } Complexity Improvements : { <your explanation of time/memory improvements here>}"},
            # {"role":"user","content":f"Title: {submission_data['problem_title']} Description: {description} Code: {submission_data['code']}"})
        
        system_prompt = """
You are an expert software reviewer and performance optimizer. 
When the user provides a code snippet along with its title and description, follow these steps strictly:

1. Analyze the given code for correctness, maintainability, and clarity.  
2. Suggest improvements to coding style, readability, and structure if and only if it's required.  
3. Optimize the code for better time complexity and memory usage.
4. Return an improved, working version of the code if necessary.  
5. Clearly explain how the optimization impacts time and memory complexity.  
6. If applicable, mention alternative algorithms or data structures that can improve performance.  

Always format your response as valid JSON with **exactly three keys**:  
- "Analysis"  
- "Improved_Code"  
- "Complexity_Improvements"  

### Example Input:
Title: Number of Zero-Filled Subarrays  
Description: Given an integer array nums, return the number of subarrays filled with 0.  
Code: 
```python
class Solution:
    def zeroFilledSubarray(self, nums: List[int]) -> int:
        i, res = 0, 0
        while i < len(nums):
            count = 0
            while i < len(nums) and nums[i] == 0:
                count += 1
                res += count
                i += 1
            i += 1
        return res
        """

        user_prompt = f"""
Title: {submission_data['problem_title']}
Description: {description}
Code:
{submission_data['code']}
"""
        
        print(system_prompt)
        print("--" * 20)
        print(user_prompt)

        client = OpenAI(
        api_key=settings.OPENAI_KEY
        )

        response = client.chat.completions.create(
        model="gpt-5",
        messages=[
            {"role":"system","content":system_prompt},
            {"role":"user","content":user_prompt}
                ]
        )

        print("Response from LLM:")
        print(response.choices[0].message.content)

        return JSONResponse(
            status_code=status.HTTP_200_OK,
            content={"message":"AI Response fetched successfully...","ai_response":response.choices[0].message.content}
        )
    except Exception as e:
        return JSONResponse(
            status_code=status.HTTP_400_BAD_REQUEST,
            content={"error":str(e)}
        )