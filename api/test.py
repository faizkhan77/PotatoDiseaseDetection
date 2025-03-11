from fastapi import FastAPI, File, UploadFile
import uvicorn
import numpy as np
from io import BytesIO
from PIL import Image
import tensorflow as tf
import keras

app = FastAPI()

# MODEL = tf.keras.models.load_model("../saved_models/potato_disease_model.keras")
# MODEL = tf.saved_model.load("../saved_models/1")
MODEL = keras.layers.TFSMLayer("../saved_models/1", call_endpoint="serving_default")
CLASS_NAMES = ["Early Blight", "Late Blight", "Healthy"]


@app.get("/ping")
async def ping():
    return "Hello! The server is alive!"


# ✅ Convert uploaded file into a properly formatted image
def read_file_as_image(data) -> np.ndarray:
    image = Image.open(BytesIO(data)).convert("RGB")  # Ensure RGB format
    image = np.array(image, dtype=np.float32)  # ✅ Convert to float32
    image /= 255.0  # ✅ Normalize pixel values (0 to 1)
    return image


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image = read_file_as_image(await file.read())

    # [[256,256,3]]
    # ✅ Ensure correct shape: (1, 256, 256, 3)
    img_batch = np.expand_dims(image, axis=0)

    predictions = MODEL(img_batch)

    # ✅ Extract the tensor from dictionary
    predictions_tensor = predictions["output_0"].numpy()

    index = np.argmax(predictions_tensor[0])
    predicted_class = CLASS_NAMES[index]
    confidence = float(np.max(predictions_tensor[0]))

    return {"class": predicted_class, "confidence": float(confidence)}


if __name__ == "__main__":
    uvicorn.run(app, host="localhost", port=8000)
