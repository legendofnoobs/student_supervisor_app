from pydantic import BaseModel
from typing import List, Optional

class SupervisorBase(BaseModel):
    name: str
    employee_id: str
    mobile_number: str

class SupervisorCreate(SupervisorBase):
    pass

class SupervisorUpdate(BaseModel):
    name: Optional[str] = None
    employee_id: Optional[str] = None
    mobile_number: Optional[str] = None

class Supervisor(SupervisorBase):
    id: int
    class Config:
        orm_mode = True

class StudentBase(BaseModel):
    name: str
    registration_no: str
    mobile_number: str

class StudentCreate(StudentBase):
    supervisor_ids: List[int] = []

class StudentUpdate(BaseModel):
    name: Optional[str] = None
    registration_no: Optional[str] = None
    mobile_number: Optional[str] = None
    supervisor_ids: Optional[List[int]] = None

class Student(StudentBase):
    id: int
    supervisors: List[Supervisor] = []
    class Config:
        orm_mode = True