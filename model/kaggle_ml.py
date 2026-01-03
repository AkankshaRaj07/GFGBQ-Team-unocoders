# model/kaggle_ml.py

import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LogisticRegression
import joblib

# ------------------ DIABETES MODEL ------------------

def train_diabetes_model():
    data = pd.read_csv("data/diabetes.csv")

    X = data.drop("Outcome", axis=1)
    y = data["Outcome"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    model = LogisticRegression(max_iter=1000)
    model.fit(X_train, y_train)

    joblib.dump((model, scaler), "model/diabetes_model.pkl")
    return model.score(X_test, y_test)


# ------------------ HEART MODEL ------------------

def train_heart_model():
    data = pd.read_csv("data/heart.csv")

    # Binary target: early risk
    data["heart_risk"] = (data["num"] > 0).astype(int)

    # Drop non-predictive columns
    data = data.drop(columns=["id", "dataset", "num"])

    # Separate column types
    categorical_cols = data.select_dtypes(include="object").columns
    numeric_cols = data.select_dtypes(exclude="object").columns.drop("heart_risk")

    # Handle missing values
    for col in numeric_cols:
        data[col] = data[col].fillna(data[col].median())

    for col in categorical_cols:
        data[col] = data[col].fillna(data[col].mode()[0])

    # One-hot encode categoricals
    data = pd.get_dummies(data, columns=categorical_cols, drop_first=True)

    X = data.drop("heart_risk", axis=1)
    y = data["heart_risk"]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )

    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    model = LogisticRegression(max_iter=2000)
    model.fit(X_train, y_train)

    joblib.dump(
        {"model": model, "scaler": scaler, "features": X.columns.tolist()},
        "model/heart_model.pkl"
    )

    return model.score(X_test, y_test)


   



if __name__ == "__main__":
    diabetes_acc = train_diabetes_model()
    heart_acc = train_heart_model()

    print(f"Diabetes model accuracy: {round(diabetes_acc * 100, 2)}%")
    print(f"Heart disease model accuracy: {round(heart_acc * 100, 2)}%")
