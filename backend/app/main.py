from datetime import datetime, timezone
from collections import Counter, defaultdict

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from . import config, llm
from .auth import current_user_id
from .db import supabase
from .schemas import AnswerIn, SessionCreate

app = FastAPI(title="AI Interview Coach API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[config.FRONTEND_ORIGIN],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

ROLES = [
    "Python Developer", "JavaScript Developer", "React Developer", "Node.js Backend Developer",
    "Java Developer", "Data Analyst", "Data Scientist", "Machine Learning Engineer",
    "DevOps Engineer", "Full Stack Developer", "QA / Test Automation Engineer", "System Design",
]


def _now() -> str:
    return datetime.now(timezone.utc).isoformat()


def _public_question(q: dict) -> dict:
    """Never send ideal_points to the client before the answer is evaluated."""
    return {k: v for k, v in q.items() if k not in ("ideal_points", "session_id")}


def _get_session(session_id: str, user_id: str) -> dict:
    res = (
        supabase.table("interview_sessions").select("*")
        .eq("id", session_id).eq("user_id", user_id).limit(1).execute()
    )
    if not res.data:
        raise HTTPException(404, "Interview not found")
    return res.data[0]


def _get_questions(session_id: str) -> list[dict]:
    res = supabase.table("interview_questions").select("*").eq("session_id", session_id).order("position").execute()
    return res.data


@app.get("/api/health")
def health():
    return {"ok": True}


@app.get("/api/roles")
def roles():
    return {"roles": ROLES}


@app.post("/api/sessions")
def create_session(body: SessionCreate, user_id: str = Depends(current_user_id)):
    try:
        generated = llm.generate_questions(body.role.strip(), body.difficulty, body.num_questions)
    except Exception as e:
        raise HTTPException(502, f"Could not generate questions: {e}")

    session = supabase.table("interview_sessions").insert({
        "user_id": user_id, "role": body.role.strip(), "difficulty": body.difficulty,
        "num_questions": len(generated),
    }).execute().data[0]

    rows = [
        {
            "session_id": session["id"], "position": i + 1,
            "question": q["question"], "topic": q.get("topic"),
            "ideal_points": q.get("ideal_points", []),
        }
        for i, q in enumerate(generated)
    ]
    questions = supabase.table("interview_questions").insert(rows).execute().data
    return {**session, "questions": [_public_question(q) for q in questions]}


@app.get("/api/sessions")
def list_sessions(user_id: str = Depends(current_user_id)):
    res = (
        supabase.table("interview_sessions").select("*")
        .eq("user_id", user_id).order("created_at", desc=True).limit(100).execute()
    )
    return {"sessions": res.data}


@app.get("/api/sessions/{session_id}")
def get_session(session_id: str, user_id: str = Depends(current_user_id)):
    session = _get_session(session_id, user_id)
    questions = _get_questions(session_id)
    out = []
    for q in questions:
        q = dict(q)
        # Reveal the key points only once evaluated (or the interview is over).
        if not q.get("evaluated_at"):
            q = _public_question(q)
        else:
            q.pop("session_id", None)
        out.append(q)
    return {**session, "questions": out}


@app.post("/api/sessions/{session_id}/questions/{question_id}/answer")
def submit_answer(session_id: str, question_id: str, body: AnswerIn, user_id: str = Depends(current_user_id)):
    session = _get_session(session_id, user_id)
    if session["status"] == "completed":
        raise HTTPException(400, "Interview already completed")

    res = (
        supabase.table("interview_questions").select("*")
        .eq("id", question_id).eq("session_id", session_id).limit(1).execute()
    )
    if not res.data:
        raise HTTPException(404, "Question not found")
    q = res.data[0]
    if q.get("evaluated_at"):
        raise HTTPException(400, "Question already answered")

    try:
        result = llm.evaluate_answer(
            session["role"], session["difficulty"], q["question"], q.get("ideal_points", []), body.answer.strip()
        )
    except Exception as e:
        raise HTTPException(502, f"Could not evaluate answer: {e}")

    updated = supabase.table("interview_questions").update({
        "answer": body.answer.strip(), "evaluated_at": _now(), **result,
    }).eq("id", question_id).execute().data[0]
    updated.pop("session_id", None)
    return updated


@app.post("/api/sessions/{session_id}/complete")
def complete_session(session_id: str, user_id: str = Depends(current_user_id)):
    session = _get_session(session_id, user_id)
    questions = _get_questions(session_id)
    answered = [q for q in questions if q.get("evaluated_at")]
    if len(answered) < len(questions):
        raise HTTPException(400, "Answer all questions before finishing")

    overall = round(sum(q["score"] for q in answered) / len(answered))
    tech = round(sum(float(q["technical_score"]) for q in answered) / len(answered), 1)
    comm = round(sum(float(q["communication_score"]) for q in answered) / len(answered), 1)
    try:
        summary = llm.summarize_session(session["role"], session["difficulty"], answered)
    except Exception:
        summary = {"summary": "Summary unavailable.", "strengths": [], "improvements": [], "next_steps": []}

    updated = supabase.table("interview_sessions").update({
        "status": "completed", "overall_score": overall, "technical_avg": tech,
        "communication_avg": comm, "summary": summary, "completed_at": _now(),
    }).eq("id", session_id).execute().data[0]
    return {**updated, "questions": [{k: v for k, v in q.items() if k != "session_id"} for q in questions]}


@app.delete("/api/sessions/{session_id}")
def delete_session(session_id: str, user_id: str = Depends(current_user_id)):
    _get_session(session_id, user_id)
    supabase.table("interview_sessions").delete().eq("id", session_id).execute()
    return {"deleted": True}


@app.get("/api/stats")
def stats(user_id: str = Depends(current_user_id)):
    sessions = (
        supabase.table("interview_sessions").select("*")
        .eq("user_id", user_id).eq("status", "completed").order("completed_at").execute().data
    )
    trend = [
        {"id": s["id"], "date": s["completed_at"], "role": s["role"],
         "difficulty": s["difficulty"], "score": float(s["overall_score"] or 0)}
        for s in sessions
    ]
    by_role = defaultdict(list)
    for s in sessions:
        by_role[s["role"]].append(float(s["overall_score"] or 0))

    weak_topics = Counter()
    if sessions:
        qs = (
            supabase.table("interview_questions").select("topic,score")
            .in_("session_id", [s["id"] for s in sessions]).execute().data
        )
        for q in qs:
            if q.get("topic") and q.get("score") is not None and q["score"] < 60:
                weak_topics[q["topic"]] += 1

    n = len(sessions)
    return {
        "completed": n,
        "avg_score": round(sum(t["score"] for t in trend) / n) if n else None,
        "avg_technical": round(sum(float(s["technical_avg"] or 0) for s in sessions) / n, 1) if n else None,
        "avg_communication": round(sum(float(s["communication_avg"] or 0) for s in sessions) / n, 1) if n else None,
        "trend": trend,
        "by_role": [{"role": r, "avg": round(sum(v) / len(v)), "count": len(v)} for r, v in by_role.items()],
        "weak_topics": [{"topic": t, "count": c} for t, c in weak_topics.most_common(5)],
    }
