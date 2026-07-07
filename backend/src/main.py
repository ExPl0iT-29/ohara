import asyncio
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI

from content.presentation.router import router as content_router
from content.worker import run_forever_async
from projects.presentation.router import router as projects_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    task = None
    if os.environ.get("ENABLE_BACKGROUND_WORKER") == "true":
        task = asyncio.create_task(run_forever_async())
    try:
        yield
    finally:
        if task is not None:
            task.cancel()


app = FastAPI(title="Ohara", lifespan=lifespan)
app.include_router(content_router)
app.include_router(projects_router)
