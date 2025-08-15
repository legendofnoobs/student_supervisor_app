from sqlalchemy import Column, Integer, String, Table, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship
from database import Base

# Many-to-Many Association Table
student_supervisor = Table(
    "student_supervisor",
    Base.metadata,
    Column("student_id", Integer, ForeignKey("students.id")),
    Column("supervisor_id", Integer, ForeignKey("supervisors.id"))
)

class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    registration_no = Column(String, nullable=False)
    mobile_number = Column(String, nullable=False)

    supervisors = relationship(
        "Supervisor",
        secondary=student_supervisor,
        back_populates="students"
    )
    __table_args__ = (UniqueConstraint('registration_no', name='unique_registration_no'),UniqueConstraint('mobile_number', name='unique_student_mobile_number'))


class Supervisor(Base):
    __tablename__ = "supervisors"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    employee_id = Column(String, nullable=False)
    mobile_number = Column(String, nullable=False)

    students = relationship(
        "Student",
        secondary=student_supervisor,
        back_populates="supervisors"
    )
    __table_args__ = (UniqueConstraint('employee_id', name='unique_employee_id'),UniqueConstraint('mobile_number', name='unique_supervisor_mobile_number'))