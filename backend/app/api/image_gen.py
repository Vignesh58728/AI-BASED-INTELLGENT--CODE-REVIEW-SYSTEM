import os
import io
from fastapi import APIRouter, HTTPException, Response
from pydantic import BaseModel

router = APIRouter()

class ImageGenRequest(BaseModel):
    prompt: str
    model: str = "stabilityai/stable-diffusion-xl-base-1.0"

@router.post("/generate")
async def generate_image(request: ImageGenRequest):
    raise HTTPException(status_code=501, detail="Image generation is disabled. huggingface_hub dependency removed.")
