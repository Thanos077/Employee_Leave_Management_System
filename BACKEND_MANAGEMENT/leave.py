from fastapi import APIRouter, Header, HTTPException
from pydantic import BaseModel

from datetime import datetime

import json
import os
import uuid
from firebase_admin import  auth




router = APIRouter()

FILE_NAME = "leave.json"
SIGN_FILE = "sign.json"


class Leave(BaseModel):
    leavetype:str
    prioritylevel:str
    startdate:str
    enddate:str
    reason: str
    attachment: str | None = None
    status:str="pending"

class UpdateStatus(BaseModel):
    status: str    

def load_emp():
    if os.path.exists(FILE_NAME):
        with open(FILE_NAME, "r") as file:
            return json.load(file)
    return []

def save_emp(data):
     with open(FILE_NAME, "w") as file:
            json.dump(data, file, indent=4)

def load_sign():
    if os.path.exists(SIGN_FILE):
        with open(SIGN_FILE, "r") as file:
            return json.load(file)
    return []

@router.post("/leave")
def apply_leave(user: Leave,authorization: str = Header(...)):
    leaves = load_emp()
    token = authorization.replace("Bearer ", "")
    try:
        decoded_token = auth.verify_id_token(token)
        uid = decoded_token["uid"]
    except Exception:
         raise HTTPException(status_code=401, detail="Invalid token")

    start = datetime.strptime(user.startdate, "%Y-%m-%d")
    end = datetime.strptime(user.enddate, "%Y-%m-%d")
    duration = (end - start).days + 1

    leave_data = user.model_dump()
    leave_data["uid"]=uid
    leave_data["id"] = str(uuid.uuid4())
    leave_data["duration"]=duration

    leaves.append(leave_data)
    save_emp(leaves)

    return {
         
        "message": "Leave request submitted successfully"
    }    
@router.get("/leave")
def get_leave(authorization: str = Header(...)):
    token = authorization.replace("Bearer ", "")
    decoded_token = auth.verify_id_token(token)
    uid = decoded_token["uid"]

    leaves = load_emp()

    my_leaves = [leave for leave in leaves if leave["uid"] == uid]

    return my_leaves[::-1]

@router.get("/admin/leave")
def get_all_leaves(authorization: str = Header(...)):

    token = authorization.replace("Bearer ", "")

    try:
        auth.verify_id_token(token)

    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    leaves = load_emp()
    users = load_sign()

    result = []

    for leave in leaves:

        leave_copy = leave.copy()

        for user in users:

            if leave["uid"] == user["id"]:
                leave_copy["email"] = user["email"]
                break

        result.append(leave_copy)

    return result[::-1]    

@router.patch("/admin/leave/{leave_id}")
def update_leave_status(
    leave_id: str,
    data: UpdateStatus,
    authorization: str = Header(...)
):

    token = authorization.replace("Bearer ", "")

    try:
        auth.verify_id_token(token)
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid token")

    leaves = load_emp()

    for leave in leaves:

        if leave["id"] == leave_id:
            leave["status"] = data.status
            save_emp(leaves)

            return {
                "message": "Leave status updated successfully"
            }

    raise HTTPException(status_code=404, detail="Leave not found")