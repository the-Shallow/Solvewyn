from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import problem_submission_router, problem_router,user_router

app = FastAPI(title="Solvewyen App")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:8080","http://localhost:8000","http://localhost:5173", "https://solvewyn.vercel.app", "chrome-extension://ifoekchhfmbpalafhihmbgidoiamaodp"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(problem_submission_router.router)
app.include_router(problem_router.router)
app.include_router(user_router.router)

@app.get("/")
def root():
    return {"message":"Solvewyn app is running...."}