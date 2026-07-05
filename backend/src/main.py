from fastapi import FastAPI

from content.presentation.router import router as content_router

app = FastAPI(title="Ohara")
app.include_router(content_router)
