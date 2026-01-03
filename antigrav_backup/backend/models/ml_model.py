# model/ml_model.py

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
import joblib

MODEL_PATH = "model/health_risk_model.pkl"


def train_and_save_model():
    # Load data
    data = pd.read_csv("data/health_data.csv")

    X = data.drop("risk", axis=1)
    y = data["risk"]

    # Train-test split
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    # Train model
    model = LogisticRegression()
    model.fit(X_train, y_train)

    # Save model
    joblib.dump(model, MODEL_PATH)

    return model


def load_model():
    return joblib.load(MODEL_PATH)


def predict_risk_probability(features: dict):
    model = load_model()
    input_df = pd.DataFrame([features])
    probability = model.predict_proba(input_df)[0][1]
    return round(probability * 100, 2)


if __name__ == "__main__":
    train_and_save_model()
