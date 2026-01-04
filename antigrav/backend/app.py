from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import os
from recommendations import generate_recommendations

# ------------------ APP CONFIG ------------------

BASE_PATH = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIST = os.path.join(BASE_PATH, "..", "frontend", "dist")

app = Flask(__name__, static_folder=FRONTEND_DIST, static_url_path="/")
CORS(app)

# ------------------ MODEL PATHS ------------------

MODELS_DIR = os.path.join(BASE_PATH, "models")

DIABETES_MODEL_PATH = os.path.join(MODELS_DIR, "diabetes_model.pkl")
HEART_MODEL_PATH = os.path.join(MODELS_DIR, "heart_model.pkl")
LIVER_MODEL_PATH = os.path.join(MODELS_DIR, "liver_model.pkl")
MENTAL_MODEL_PATH = os.path.join(MODELS_DIR, "mental_health_model.pkl")

# ------------------ GLOBAL MODELS ------------------

diabetes_model = diabetes_scaler = None
heart_model = heart_scaler = heart_features = None
liver_data = None
mental_data = None

# ------------------ LOAD MODELS ------------------

def load_models():
    global diabetes_model, diabetes_scaler
    global heart_model, heart_scaler, heart_features
    global liver_data, mental_data

    try:
        if os.path.exists(DIABETES_MODEL_PATH):
            diabetes_model, diabetes_scaler = joblib.load(DIABETES_MODEL_PATH)

        if os.path.exists(HEART_MODEL_PATH):
            heart_bundle = joblib.load(HEART_MODEL_PATH)
            heart_model = heart_bundle["model"]
            heart_scaler = heart_bundle["scaler"]
            heart_features = heart_bundle["features"]

        if os.path.exists(LIVER_MODEL_PATH):
            liver_data = joblib.load(LIVER_MODEL_PATH)

        if os.path.exists(MENTAL_MODEL_PATH):
            mental_data = joblib.load(MENTAL_MODEL_PATH)

        print("All available models loaded successfully.")

    except Exception as e:
        print(f"Model loading error: {e}")

load_models()

# ------------------ HEALTH CHECK ------------------

@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "models": {
            "diabetes": diabetes_model is not None,
            "heart": heart_model is not None,
            "liver": liver_data is not None,
            "mental": mental_data is not None
        }
    })

# ------------------ DIABETES ------------------

@app.route("/predict/diabetes", methods=["POST"])
def predict_diabetes():
    if not diabetes_model:
        return jsonify({"error": "Diabetes model not loaded"}), 503

    data = request.json

    df = pd.DataFrame([{
        "Pregnancies": float(data.get("Pregnancies", 0)),
        "Glucose": float(data.get("Glucose", 0)),
        "BloodPressure": float(data.get("BloodPressure", 0)),
        "SkinThickness": float(data.get("SkinThickness", 0)),
        "Insulin": float(data.get("Insulin", 0)),
        "BMI": float(data.get("BMI", 0)),
        "DiabetesPedigreeFunction": float(data.get("DiabetesPedigreeFunction", 0.5)),
        "Age": float(data.get("Age", 0))
    }])

    scaled = diabetes_scaler.transform(df)
    prob = diabetes_model.predict_proba(scaled)[0][1]

    return jsonify({
        "risk_score": round(prob * 100, 2),
        "risk_level": "High" if prob > 0.6 else "Moderate" if prob > 0.3 else "Low"
    })

# ------------------ HEART ------------------

@app.route("/predict/heart", methods=["POST"])
def predict_heart():
    if not heart_model:
        return jsonify({"error": "Heart model not loaded"}), 503

    data = request.json
    df = pd.DataFrame(0, index=[0], columns=heart_features)

    numeric_map = {
        "age": data.get("age", 0),
        "sex": data.get("sex", 0),
        "trestbps": data.get("trestbps", 120),
        "chol": data.get("chol", 200),
        "fbs": data.get("fbs", 0),
        "thalach": data.get("thalach", 150),
        "exang": data.get("exang", 0),
        "oldpeak": data.get("oldpeak", 0),
        "ca": data.get("ca", 0)
    }

    for k, v in numeric_map.items():
        if k in df.columns:
            df[k] = float(v)

    for cat in ["cp", "slope", "thal", "restecg"]:
        key = f"{cat}_{data.get(cat)}"
        if key in df.columns:
            df[key] = 1

    scaled = heart_scaler.transform(df)
    prob = heart_model.predict_proba(scaled)[0][1]

    return jsonify({
        "risk_score": round(prob * 100, 2),
        "risk_level": "High" if prob > 0.6 else "Moderate" if prob > 0.3 else "Low"
    })

# ------------------ LIVER ------------------

@app.route("/predict/liver", methods=["POST"])
def predict_liver():
    if not liver_data:
        return jsonify({"error": "Liver model not loaded"}), 503

    data = request.json
    gender = 1 if data.get("Gender") == "Male" else 0

    features = [[
        float(data.get("Age", 0)),
        gender,
        float(data.get("Total_Bilirubin", 0)),
        float(data.get("Direct_Bilirubin", 0)),
        float(data.get("Alkaline_Phosphotase", 0)),
        float(data.get("Alamine_Aminotransferase", 0)),
        float(data.get("Aspartate_Aminotransferase", 0)),
        float(data.get("Total_Protiens", 0)),
        float(data.get("Albumin", 0)),
        float(data.get("Albumin_and_Globulin_Ratio", 0))
    ]]

    scaled = liver_data["scaler"].transform(features)
    prob = liver_data["model"].predict_proba(scaled)[0][1]

    return jsonify({
        "risk_score": round(prob * 100, 2),
        "risk_level": "High" if prob > 0.7 else "Moderate" if prob > 0.4 else "Low"
    })

# ------------------ MENTAL HEALTH ------------------

@app.route("/predict/mental-health", methods=["POST"])
def predict_mental():
    if not mental_data:
        return jsonify({"error": "Mental model not loaded"}), 503

    data = request.json

    features = [[
        float(data.get("stress_level", 5)) / 10,
        float(data.get("workload", 5)) / 10,
        float(data.get("sleep_quality", 5)) / 10
    ]]

    scaled = mental_data["scaler"].transform(features)
    prob = mental_data["model"].predict_proba(scaled)[0][1]

    return jsonify({
        "risk_score": round(prob * 100, 2),
        "risk_level": "High" if prob > 0.6 else "Moderate" if prob > 0.3 else "Low"
    })

# ------------------ RECOMMENDATIONS ------------------

@app.route("/predict/recommendations", methods=["POST"])
def recommendations():
    return jsonify(generate_recommendations(request.json))

# ------------------ HOME REDIRECT (SAFE ADDITION) ------------------

@app.route("/home")
def home():
    return app.send_static_file("index.html")

# ------------------ REACT ROUTING ------------------

@app.route("/", defaults={"path": ""})
@app.route("/<path:path>")
def serve_react(path):
    file_path = os.path.join(app.static_folder, path)
    if path and os.path.exists(file_path):
        return app.send_static_file(path)
    return app.send_static_file("index.html")
