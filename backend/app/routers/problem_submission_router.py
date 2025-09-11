from fastapi import APIRouter
from ..services import problem_submission_service
from ..models.problem_submission_model import ProblemSubmission

router = APIRouter(prefix="/submissions",tags=["submissions"])

@router.post("/")
def create_submission(problem_submission:ProblemSubmission):
    return problem_submission_service.create_submission(problem_submission=problem_submission)

@router.get("/{user_id}")
def get_submissions(user_id:str):
    return problem_submission_service.get_submissions_by_user(user_id=user_id)

@router.get("/{problem_id}/{user_id}")
def create_submission(user_id:str,problem_id:str):
    return  problem_submission_service.get_submission_data_by_problem(problem_id=problem_id,user_id=user_id)


@router.get("/ai/{problem_id}/{user_id}")
def get_ai_suggestion(user_id:str,problem_id:str):
    return  problem_submission_service.get_ai_suggestion(problem_id=problem_id,user_id=user_id)
