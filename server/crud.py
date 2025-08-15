from sqlalchemy.orm import Session
import models, schemas

def create_student(db: Session, student: schemas.StudentCreate):
    db_student = models.Student(
        name=student.name,
        registration_no=student.registration_no,
        mobile_number=student.mobile_number
    )
    if student.supervisor_ids:
        supervisors = db.query(models.Supervisor).filter(
            models.Supervisor.id.in_(student.supervisor_ids)
        ).all()
        db_student.supervisors = supervisors

    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student

def get_students(db: Session):
    return db.query(models.Student).all()

def get_student(db: Session, student_id: int):
    return db.query(models.Student).filter(models.Student.id == student_id).first()

def update_student(db: Session, student_id: int, student: schemas.StudentUpdate):
    db_student = get_student(db, student_id)
    if db_student is None:
        return None
    for var, value in vars(student).items():
        if value is not None and var != "supervisor_ids":
            setattr(db_student, var, value)

    if student.supervisor_ids is not None:
        supervisors = db.query(models.Supervisor).filter(
            models.Supervisor.id.in_(student.supervisor_ids)
        ).all()
        db_student.supervisors = supervisors

    db.commit()
    db.refresh(db_student)
    return db_student

def delete_student(db: Session, student_id: int):
    db_student = get_student(db, student_id)
    if db_student is None:
        return None
    db.delete(db_student)
    db.commit()
    return True

def create_supervisor(db: Session, supervisor: schemas.SupervisorCreate):
    db_supervisor = models.Supervisor(**supervisor.dict())
    db.add(db_supervisor)
    db.commit()
    db.refresh(db_supervisor)
    return db_supervisor

def get_supervisors(db: Session):
    return db.query(models.Supervisor).all()

def get_supervisor(db: Session, supervisor_id: int):
    return db.query(models.Supervisor).filter(models.Supervisor.id == supervisor_id).first()


def update_supervisor(db: Session, supervisor_id: int, supervisor: schemas.SupervisorUpdate):
    db_supervisor = get_supervisor(db, supervisor_id)
    if db_supervisor is None:
        return None
    for var, value in vars(supervisor).items():
        if value is not None:
            setattr(db_supervisor, var, value)
    db.commit()
    db.refresh(db_supervisor)
    return db_supervisor

def delete_supervisor(db: Session, supervisor_id: int):
    db_supervisor = get_supervisor(db, supervisor_id)
    if db_supervisor is None:
        return None
    db.delete(db_supervisor)
    db.commit()
    return True