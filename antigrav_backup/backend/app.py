from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Define model paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODELS_DIR = os.path.join(BASE_DIR, 'models')
DIABETES_MODEL_PATH = os.path.join(MODELS_DIR, 'diabetes_model.pkl')
HEART_MODEL_PATH = os.path.join(MODELS_DIR, 'heart_model.pkl')

# Global variables to store loaded models
diabetes_model = None
diabetes_scaler = None
heart_model = None
heart_scaler = None
heart_features = None

def load_models():
    global diabetes_model, diabetes_scaler, heart_model, heart_scaler, heart_features
    
    try:
        # Load Diabetes Model (Tuple: model, scaler)
        if os.path.exists(DIABETES_MODEL_PATH):
            diabetes_model, diabetes_scaler = joblib.load(DIABETES_MODEL_PATH)
            print("Variable 'diabetes_model' loaded successfully.")
        else:
            print(f"Warning: Diabetes model not found at {DIABETES_MODEL_PATH}")

        # Load Heart Model (Dict: {model, scaler, features})
        if os.path.exists(HEART_MODEL_PATH):
            heart_data = joblib.load(HEART_MODEL_PATH)
            heart_model = heart_data['model']
            heart_scaler = heart_data['scaler']
            heart_features = heart_data['features']
            print("Variable 'heart_model' loaded successfully.")
        else:
            print(f"Warning: Heart model not found at {HEART_MODEL_PATH}")
            
    except Exception as e:
        print(f"Error loading models: {str(e)}")

# Load models on startup
load_models()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "online",
        "models": {
            "diabetes": diabetes_model is not None,
            "heart": heart_model is not None
        }
    })

@app.route('/predict/diabetes', methods=['POST'])
def predict_diabetes():
    if not diabetes_model or not diabetes_scaler:
        return jsonify({"error": "Diabetes model not initialized"}), 503
    
    try:
        data = request.json
        print(f"DEBUG_DIABETES_INPUT: {data}")
        # Expected keys matching training: Pregnancies, Glucose, BloodPressure, SkinThickness, Insulin, BMI, DiabetesPedigreeFunction, Age
        
        # Create DataFrame for single row
        input_data = {
            'Pregnancies': [float(data.get('Pregnancies', 0))],
            'Glucose': [float(data.get('Glucose', 0))],
            'BloodPressure': [float(data.get('BloodPressure', 0))],
            'SkinThickness': [float(data.get('SkinThickness', 0))],
            'Insulin': [float(data.get('Insulin', 0))],
            'BMI': [float(data.get('BMI', 0))],
            'DiabetesPedigreeFunction': [float(data.get('DiabetesPedigreeFunction', 0.5))], # Default average
            'Age': [float(data.get('Age', 0))]
        }
        
        df = pd.DataFrame(input_data)
        
        # Scale features
        scaled_features = diabetes_scaler.transform(df)
        
        # Predict probability
        probability = diabetes_model.predict_proba(scaled_features)[0][1]
        
        return jsonify({
            "risk_score": round(probability * 100, 2),
            "risk_level": "High" if probability > 0.6 else "Moderate" if probability > 0.3 else "Low",
            "model_source": "Python ML (Scikit-Learn)"
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400

@app.route('/predict/heart', methods=['POST'])
def predict_heart():
    if not heart_model or not heart_scaler:
        return jsonify({"error": "Heart model not initialized"}), 503

    try:
        data = request.json
        print(f"DEBUG_HEART_INPUT: {data}")
        # Core inputs from UI
        # age, sex, chest_pain_type, resting_bp, cholesterol, fasting_bs, resting_ecg, max_hr, exercise_angina, oldpeak, st_slope
        
        # We need to reconstruct the dataframe to match training features exactly (One-Hot Encoded)
        # 1. Create a base dict with numeric values
        input_base = {
            'age': float(data.get('age', 0)),
            'sex': int(data.get('sex', 0)), # 1=Male, 0=Female
            'trestbps': float(data.get('trestbps', 120)),
            'chol': float(data.get('chol', 200)),
            'fbs': int(data.get('fbs', 0)), # 1 if > 120
            'thalach': float(data.get('thalach', 150)),
            'exang': int(data.get('exang', 0)),
            'oldpeak': float(data.get('oldpeak', 0)),
            'ca': float(data.get('ca', 0))
        }

        # 2. Handle Categoricals via manual One-Hot Mapping matches Training Columns
        # Categories: cp (0-3), restecg (0-2), slope (0-2), thal (0-3)
        # Training likely did: cp_1, cp_2, cp_3 (dropping first?) or just cp_1.. etc.
        # We'll use a safer approach: Create a DF with 0s for all expected features, then fill.

        # Create DataFrame with all 0s
        df = pd.DataFrame(0, index=[0], columns=heart_features)
        
        # Fill numeric
        for col, val in input_base.items():
            if col in df.columns:
                df[col] = val
        
        # Set categorical dummies manually based on input strings/values
        # Chest Pain: cp
        # Assumption: Training used pd.get_dummies(drop_first=True)
        cp_val = str(data.get('cp', '0')) # expected values like '1', '2', '3' (Typical, Atypical, Non-anginal) or descriptors
        # Map back to dummy column names like 'cp_1', 'cp_2', etc. if they exist
        if f"cp_{cp_val}" in df.columns:
            df[f"cp_{cp_val}"] = 1
            
        # Slope
        slope_val = str(data.get('slope', '1'))
        if f"slope_{slope_val}" in df.columns:
            df[f"slope_{slope_val}"] = 1
            
        # Thal
        thal_val = str(data.get('thal', '2'))
        if f"thal_{thal_val}" in df.columns:
            df[f"thal_{thal_val}"] = 1

        # RestECG
        restecg_val = str(data.get('restecg', '0'))
        if f"restecg_{restecg_val}" in df.columns:
            df[f"restecg_{restecg_val}"] = 1

        # Scale
        scaled_features = heart_scaler.transform(df)
        
        # Predict
        probability = heart_model.predict_proba(scaled_features)[0][1]
        
        return jsonify({
            "risk_score": round(probability * 100, 2),
            "risk_level": "High" if probability > 0.6 else "Moderate" if probability > 0.3 else "Low",
            "model_source": "Python ML (Scikit-Learn)"
        })

    except Exception as e:
        print(e)
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    print("Starting Flask Server on port 5000...")
    app.run(port=5000, debug=True)
