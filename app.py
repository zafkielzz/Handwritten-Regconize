from flask import Flask, request, jsonify
import numpy as np
from tensorflow.keras.models import load_model
from PIL import Image
import io
import base64
from flask_cors import CORS 

app = Flask(__name__)
CORS(app) 

try:
    model = load_model("mnist.h5")
    print("MNIST model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    print("Please make sure 'mnist.h5' is in the same directory.")
    exit()

def preprocess_image(image_data):

    if "base64," in image_data:
        image_data = image_data.split("base64,")[1]

    image_bytes = base64.b64decode(image_data)
    image = Image.open(io.BytesIO(image_bytes)).convert('L')  #
    image = image.resize((28, 28))
    image_array = np.array(image).astype("float32") / 255.0
    image_array = image_array.reshape(1, 28, 28, 1) 
    return image_array

@app.route("/predict", methods=["POST"])
def predict():
    data = request.get_json()
    if "image" not in data:
        return jsonify({"error": "Missing image field"}), 400

    try:
        img_array = preprocess_image(data["image"])
        predictions = model.predict(img_array)
        predicted_digit = int(np.argmax(predictions))
        return jsonify({"prediction": predicted_digit})
    except Exception as e:
        print(f"Prediction error: {e}") 
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, host='127.0.0.1', port=5000)
