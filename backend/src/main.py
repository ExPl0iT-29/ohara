from fastapi import FastAPI

from content.presentation.router import router as content_router
from projects.presentation.router import router as projects_router

app = FastAPI(title="Ohara")
app.include_router(content_router)
app.include_router(projects_router)
