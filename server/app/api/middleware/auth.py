import httpx
from fastapi import Request, status
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from sqlalchemy.ext.asyncio import AsyncSession
from app.services.user_service import get_user_by_github_id
from app.core.database import AsyncSessionLocal


GITHUB_API = "https://api.github.com"

# Public routes that skip auth
PUBLIC_PATHS = ("/docs", "/openapi", "/health", "/redoc", "/api/v1/users/signin")


class GitHubAuthMiddleware(BaseHTTPMiddleware):

    async def dispatch(self, request: Request, call_next):

        # Allow OPTIONS requests (CORS preflight) to pass through
        if request.method == "OPTIONS":
            return await call_next(request)

        # Skip public routes (exact match for root, startswith for others)
        if request.url.path == "/" or request.url.path.startswith(PUBLIC_PATHS):
            return await call_next(request)

        # Extract token
        auth_header = request.headers.get("Authorization")

        if not auth_header or not auth_header.startswith("Bearer "):
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Missing authentication token"},
            )

        token = auth_header.split(" ")[1]

        # Verify token with GitHub
        github_user = await self._verify_github_token(token)

        if not github_user:
            return JSONResponse(
                status_code=status.HTTP_401_UNAUTHORIZED,
                content={"detail": "Invalid or expired GitHub token"},
            )

        # DB logic — check if user exists
        async with AsyncSessionLocal() as db:
            try:
                user = await get_user_by_github_id(db, str(github_user["id"]))

                if not user:
                    # User not found - they need to sign in first via /users/signin
                    return JSONResponse(
                        status_code=status.HTTP_403_FORBIDDEN,
                        content={"detail": "User not registered. Please complete sign in first."},
                    )

                # Attach user to request state — accessible in all route handlers
                request.state.user = user
                request.state.github_token = token  # Forward token for GitHub API calls

            except Exception as e:
                return JSONResponse(
                    status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                    content={"detail": f"Internal server error during authentication: {str(e)}"},
                )

        response = await call_next(request)
        return response


    async def _verify_github_token(self, token: str) -> dict | None:
        """
        Verify token by calling GitHub API.
        Returns GitHub user dict or None if invalid.
        """
        try:
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    f"{GITHUB_API}/user",
                    headers={
                        "Authorization": f"Bearer {token}",
                        "Accept": "application/vnd.github.v3+json",
                    },
                    timeout=10.0,
                )

            if response.status_code == 200:
                return response.json()

            return None

        except httpx.TimeoutException:
            return None
        except Exception:
            return None