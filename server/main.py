from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
import database, models, schemas, crud
from fastapi.middleware.cors import CORSMiddleware


# Initialize database
database.init_db()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

# Dependency for DB session
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/students/", response_model=schemas.Student)
def create_student(student: schemas.StudentCreate, db: Session = Depends(get_db)):
    return crud.create_student(db, student)

@app.get("/students/", response_model=list[schemas.Student])
def list_students(db: Session = Depends(get_db)):
    return crud.get_students(db)

@app.get("/students/{student_id}", response_model=schemas.Student)
def read_student(student_id: int, db: Session = Depends(get_db)):
    db_student = crud.get_student(db, student_id)
    if db_student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return db_student

@app.put("/students/{student_id}", response_model=schemas.Student)
def update_student(student_id: int, student: schemas.StudentUpdate, db: Session = Depends(get_db)):
    db_student = crud.update_student(db, student_id, student)
    if db_student is None:
        raise HTTPException(status_code=404, detail="Student not found")
    return db_student

@app.delete("/students/{student_id}")
def delete_student(student_id: int, db: Session = Depends(get_db)):
    if crud.delete_student(db, student_id):
        return {"ok": True}
    raise HTTPException(status_code=404, detail="Student not found")

@app.post("/supervisors/", response_model=schemas.Supervisor)
def create_supervisor(supervisor: schemas.SupervisorCreate, db: Session = Depends(get_db)):
    return crud.create_supervisor(db, supervisor)

@app.get("/supervisors/", response_model=list[schemas.Supervisor])
def list_supervisors(db: Session = Depends(get_db)):
    return crud.get_supervisors(db)

@app.get("/supervisors/{supervisor_id}", response_model=schemas.Supervisor)
def read_supervisor(supervisor_id: int, db: Session = Depends(get_db)):
    db_supervisor = crud.get_supervisor(db, supervisor_id)
    if db_supervisor is None:
        raise HTTPException(status_code=404, detail="Supervisor not found")
    return db_supervisor

@app.put("/supervisors/{supervisor_id}", response_model=schemas.Supervisor)
def update_supervisor(supervisor_id: int, supervisor: schemas.SupervisorUpdate, db: Session = Depends(get_db)):
    db_supervisor = crud.update_supervisor(db, supervisor_id, supervisor)
    if db_supervisor is None:
        raise HTTPException(status_code=404, detail="Supervisor not found")
    return db_supervisor

@app.delete("/supervisors/{supervisor_id}")
def delete_supervisor(supervisor_id: int, db: Session = Depends(get_db)):
    if crud.delete_supervisor(db, supervisor_id):
        return {"ok": True}
    raise HTTPException(status_code=404, detail="Supervisor not found")