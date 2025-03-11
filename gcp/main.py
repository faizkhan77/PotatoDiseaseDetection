from google.cloud import storage
import tensorflow as tf
from PIL import Image
import numpy as np
from flask import Flask, request, jsonify

BUCKET_NAME = "potato-disease-model2"
class_names = ["Early Blight", "Late Blight", "Healthy"]

model = None


def download_blob(bucket_name, source_blob_name, destination_file_name):
    """Downloads a blob from the bucket."""
    storage_client = storage.Client()
    bucket = storage_client.get_bucket(bucket_name)
    blob = bucket.blob(source_blob_name)

    blob.download_to_filename(destination_file_name)

    print(f"Blob {source_blob_name} downloaded to {destination_file_name}.")


def predict(request):
    global model
    if model is None:
        download_blob(
            BUCKET_NAME,
            "models/potato_disease_model.keras",
            "/tmp/potato_disease_model.keras",
        )

        model = tf.keras.models.load_model("/tmp/potato_disease_model.keras")

    image = request.files["file"]

    image = np.array(
        Image.open(image).convert("RGB").resize((256, 256))  # image resizing
    )

    img_array = tf.expand_dims(image, 0)
    predictions = model.predict(img_array)

    print("Predictions:", predictions)

    predicted_class = class_names[np.argmax(predictions[0])]
    confidence = round(100 * (np.max(predictions[0])), 2)

    response = jsonify({"class": predicted_class, "confidence": confidence})

    # ✅ Add CORS headers
    response.headers.add("Access-Control-Allow-Origin", "*")
    response.headers.add("Access-Control-Allow-Headers", "Content-Type")
    response.headers.add("Access-Control-Allow-Methods", "POST, OPTIONS")

    return response
