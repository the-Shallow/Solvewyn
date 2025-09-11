from fastapi import APIRouter
from ..services import problem_service
from ..models.problem_model import Problem

router = APIRouter(prefix="/problems",tags=["problems"])

@router.post("/")
def create_problem(problem:Problem):
    return problem_service.create_problem(problem=problem)

@router.get("/{problem_id}")
def create_submission(problem_id:str):
    problems = problem_service.get_problem(problem_id=problem_id)
    return {
        "message":"Problems Fetched Successfully",
        "problems":problems
    }
