from typing import Literal
from pydantic import BaseModel, Field


class SessionCreate(BaseModel):
    role: str = Field(min_length=2, max_length=80)
    difficulty: Literal["beginner", "intermediate", "advanced"]
    num_questions: int = Field(default=5, ge=3, le=10)


class AnswerIn(BaseModel):
    answer: str = Field(min_length=1, max_length=6000)
