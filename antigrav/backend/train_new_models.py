import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler, LabelEncoder
import joblib
import os

# Paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.abspath(os.path.join(BASE_DIR, '../data'))
MODELS_DIR = os.path.join(BASE_DIR, 'models')

if not os.path.exists(MODELS_DIR):
    os.makedirs(MODELS_DIR)

def train_liver_model():
    print("Training Liver Model...")
    try:
        df = pd.read_csv(os.path.join(DATA_DIR, 'indian_liver_patient.csv'))
        df['Dataset'] = df['Dataset'].map({1: 1, 2: 0})
        df['Albumin_and_Globulin_Ratio'] = df['Albumin_and_Globulin_Ratio'].fillna(df['Albumin_and_Globulin_Ratio'].mean())
        df = df.fillna(0)
        
        le = LabelEncoder()
        df['Gender'] = le.fit_transform(df['Gender']) 
        
        X = df.drop('Dataset', axis=1)
        y = df['Dataset']
        
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        model = LogisticRegression(random_state=42, max_iter=1000)
        model.fit(X_scaled, y)
        
        joblib.dump({'model': model, 'scaler': scaler, 'features': list(X.columns)}, os.path.join(MODELS_DIR, 'liver_model.pkl'))
        print("Liver Model Saved.")
    except Exception as e:
        print(f"Liver Model Failed: {e}")

def train_mental_health_model():
    print("Training Mental Health Model...")
    
    # Core: Stress Level Dataset
    try:
        df_stress = pd.read_csv(os.path.join(DATA_DIR, 'StressLevelDataset.csv'))
        
        # Normalize Features 0-1
        # Max of anxiety/depression ~20-30? stress_level 0-2?
        # We'll simpler normalize by max()
        
        df_s_clean = pd.DataFrame()
        df_s_clean['Anxiety_Indicator'] = df_stress['anxiety_level'] / df_stress['anxiety_level'].max()
        df_s_clean['Workload_Indicator'] = df_stress['study_load'] / df_stress['study_load'].max()
        df_s_clean['Sleep_Indicator'] = df_stress['sleep_quality'] / df_stress['sleep_quality'].max()
        # Target: Risk High if stress >= 1
        df_s_clean['Risk'] = df_stress['stress_level'].apply(lambda x: 1 if x >= 1 else 0)
        
        print(f"Encoded Stress Data: {len(df_s_clean)} rows")
        
        # Optional: Burnout (train.csv)
        try:
            df_burnout = pd.read_csv(os.path.join(DATA_DIR, 'train.csv'))
            df_burnout.columns = df_burnout.columns.str.strip()
            
            if 'Mental_Fatigue_Score' in df_burnout.columns and 'Burnout Rate' in df_burnout.columns:
                 df_burnout = df_burnout.dropna(subset=['Mental_Fatigue_Score', 'Burnout Rate'])
                 
                 df_b_clean = pd.DataFrame()
                 df_b_clean['Anxiety_Indicator'] = df_burnout['Mental_Fatigue_Score'] / 10.0
                 df_b_clean['Workload_Indicator'] = df_burnout['Resource_Allocation'] / 10.0 if 'Resource_Allocation' in df_burnout else 0.5
                 df_b_clean['Sleep_Indicator'] = 0.5 # Neutral
                 df_b_clean['Risk'] = df_burnout['Burnout Rate'].apply(lambda x: 1 if x > 0.5 else 0)
                 
                 df_s_clean = pd.concat([df_s_clean, df_b_clean], ignore_index=True)
                 print(f"Added Burnout Data: Total {len(df_s_clean)} rows")
            else:
                 print("Burnout columns missing, skipping train.csv")
                 print(f"Columns found: {list(df_burnout.columns)}")
                 
        except Exception as e:
            print(f"Skipping Burnout Data: {e}")

        # Training
        X = df_s_clean[['Anxiety_Indicator', 'Workload_Indicator', 'Sleep_Indicator']]
        y = df_s_clean['Risk']
        
        scaler = StandardScaler()
        X_scaled = scaler.fit_transform(X)
        
        model = RandomForestClassifier(n_estimators=100, random_state=42)
        model.fit(X_scaled, y)
        
        joblib.dump({'model': model, 'scaler': scaler, 'features': ['Anxiety_Indicator', 'Workload_Indicator', 'Sleep_Indicator']}, os.path.join(MODELS_DIR, 'mental_health_model.pkl'))
        print("Mental Health Model Saved.")
        
    except Exception as e:
        print(f"Mental Health Model Failed: {e}")

if __name__ == "__main__":
    train_liver_model()
    train_mental_health_model()
