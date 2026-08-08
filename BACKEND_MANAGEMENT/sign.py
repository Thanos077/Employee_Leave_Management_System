import firebase_admin
from firebase_admin import credentials, auth

from fastapi import APIRouter, Header, HTTPException

from pydantic import BaseModel

import json
import os

# Initialize Firebase from Render Environment Variable
firebase_credentials = json.loads(os.environ["FIREBASE_CREDENTIALS"])

cred = credentials.Certificate(firebase_credentials)

if not firebase_admin._apps:
    firebase_admin.initialize_app(cred)

router = APIRouter()

FILE_NAME = "sign.json"

class Emp(BaseModel):
    name:str
    age:int
    email: str
    role: str = "Employee"


def load_emp():
    if os.path.exists(FILE_NAME):
        with open(FILE_NAME, "r") as file:
            return json.load(file)
    return []


def save_emp(data):
    with open(FILE_NAME, "w") as file:
        json.dump(data, file, indent=4)


@router.post("/employee")
def register_employee(user: Emp, authorization: str = Header(...)):
    try:
        token = authorization.replace("Bearer ", "")
        decoded_token = auth.verify_id_token(token)

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired Firebase token"
        )

    employees = load_emp()

    firebase_uid = decoded_token["uid"]

    # Prevent duplicate employee records
    for employee in employees:
        if employee["id"] == firebase_uid:
            return {
                "status": "success",
                "message": "Employee already exists",
                "details": employee
            }

    employee = {
        "id": firebase_uid,
        "name":user.name,
        "age":user.age,
        "email": decoded_token["email"],
        "role": user.role
    }

    employees.append(employee)
    save_emp(employees)

    return {
        "status": "success",
        "details": employee
    }


@router.get("/employee")
def get_all_employees(authorization: str = Header(...)):
    try:
        token = authorization.replace("Bearer ", "")
        auth.verify_id_token(token)

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired Firebase token"
        )

    return {
        "status": "success",
        "details": load_emp()
    }