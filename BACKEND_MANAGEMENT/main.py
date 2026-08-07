from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from sign import router as sign_router
from leave import router as leave_router

app = FastAPI(title="Employee Leave Management API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://127.0.0.1:5500"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sign_router)
app.include_router(leave_router)