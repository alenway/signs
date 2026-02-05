import io

import numpy as np
from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image

app = FastAPI()  # ← THIS MUST EXIST BEFORE ROUTES

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()

    image = Image.open(io.BytesIO(contents)).convert("RGB")
    image = image.resize((224, 224))
    image = np.asarray(image)

    return {"status": "image_loaded", "shape": image.shape}
