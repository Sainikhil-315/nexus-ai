from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession
import httpx
from app.core.database import get_db
from app.services.user_service import (
    get_user_by_github_id,
    create_user,
    complete_onboarding,
)
from app.schemas.user_schemas import (
    UserResponse,
    SignInRequest,
    OnboardingCompleteRequest,
)

router = APIRouter(prefix="/users", tags=["users"])

GITHUB_API = "https://api.github.com"


@router.post("/signin", response_model=UserResponse)
async def signin_with_github(
    signin_request: SignInRequest, 
    db: AsyncSession = Depends(get_db)
):
    """
    Sign in or create user with GitHub token.
    This should be called from NextAuth signIn callback.
    """
    try:
        # Verify token with GitHub
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{GITHUB_API}/user",
                headers={
                    "Authorization": f"Bearer {signin_request.github_token}",
                    "Accept": "application/vnd.github.v3+json",
                },
                timeout=10.0,
            )

        if response.status_code != 200:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired GitHub token"
            )

        github_user = response.json()
        github_id = str(github_user["id"])

        # Check if user exists
        user = await get_user_by_github_id(db, github_id)

        if not user:
            # Create new user
            user = await create_user(
                db,
                github_id=github_id,
                username=github_user.get("login"),
                email=github_user.get("email"),
            )

        return user

    except httpx.TimeoutException:
        raise HTTPException(
            status_code=status.HTTP_408_REQUEST_TIMEOUT,
            detail="GitHub API request timed out"
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal server error: {str(e)}"
        )


@router.get("/me", response_model=UserResponse)
async def read_users_me(request: Request, db: AsyncSession = Depends(get_db)):
    """
    Get current authenticated user.
    Requires authentication middleware.
    """
    # Get fresh user from current session to avoid detached instance issues
    user = await get_user_by_github_id(db, request.state.user.github_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


@router.post("/onboarding/complete", response_model=UserResponse)
async def complete_user_onboarding(
    onboarding_data: OnboardingCompleteRequest,
    request: Request,
    db: AsyncSession = Depends(get_db),
):
    """
    Complete user onboarding and set preferences.
    Requires authentication middleware.
    Marks onboarding as completed (1) and updates user preferences.
    """
    # Get fresh user from current session using the github_id from middleware
    user = await get_user_by_github_id(db, request.state.user.github_id)
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # if user.onboarding_completed == 1:
    #     raise HTTPException(
    #         status_code=status.HTTP_400_BAD_REQUEST,
    #         detail="Onboarding already completed"
    #     )
    
    updated_user = await complete_onboarding(
        db,
        user,
        preferred_stack=onboarding_data.preferred_stack,
        preferred_language=onboarding_data.preferred_language,
        developer_level=onboarding_data.developer_level,
    )
    
    return updated_user
