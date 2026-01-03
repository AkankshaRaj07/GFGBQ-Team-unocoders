import requests
import json

url = "http://localhost:5000/predict/diabetes"
payload = {
    "Glucose": 174,
    "BloodPressure": 72,
    "SkinThickness": 20,
    "Insulin": 80,
    "BMI": 30,
    "Age": 45
}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
