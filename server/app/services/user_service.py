from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import User


async def get_user_by_github_id(db: AsyncSession, github_id: str) -> User | None:
    result = await db.execute(select(User).filter(User.github_id == github_id))
    return result.scalar_one_or_none()


async def create_user(
    db: AsyncSession,
    github_id: str,
    username: str,
    email: str | None = None,
) -> User:
    user = User(
        github_id=github_id,
        username=username,
        email=email,
    )
    db.add(user)
    await db.commit()
    await db.refresh(user)
    return user


async def complete_onboarding(
    db: AsyncSession,
    user: User,
    preferred_stack: str | None = None,
    preferred_language: str | None = None,
    developer_level: str = "beginner",
) -> User:
    """Mark user onboarding as complete and update preferences"""
    user.onboarding_completed = 1
    
    if preferred_stack:
        user.preferred_stack = preferred_stack
    if preferred_language:
        user.preferred_language = preferred_language
    if developer_level:
        user.developer_level = developer_level
    
    await db.commit()
    await db.refresh(user)
    return user

