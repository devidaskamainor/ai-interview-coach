from fastapi import Header, HTTPException
from .db import supabase


def current_user_id(authorization: str | None = Header(default=None)) -> str:
    """Validate the Supabase access token sent by the frontend and return the user id."""
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(status_code=401, detail="Missing bearer token")
    token = authorization.split(" ", 1)[1].strip()
    try:
        res = supabase.auth.get_user(token)
        if not res or not res.user:
            raise ValueError("no user")
        return res.user.id
    except Exception:
        raise HTTPException(status_code=401, detail="Invalid or expired token")
