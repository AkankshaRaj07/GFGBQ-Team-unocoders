import pandas as pd
import os

files = [
    r"c:\Users\LENOVO\OneDrive\Desktop\Projects\ByteQuest\antigrav\data\indian_liver_patient.csv",
    r"c:\Users\LENOVO\OneDrive\Desktop\Projects\ByteQuest\antigrav\data\Mental Health Dataset.csv",
    r"c:\Users\LENOVO\OneDrive\Desktop\Projects\ByteQuest\antigrav\data\StressLevelDataset.csv",
    r"c:\Users\LENOVO\OneDrive\Desktop\Projects\ByteQuest\antigrav\data\train.csv"
]

for f in files:
    print(f"\n--- {os.path.basename(f)} ---")
    try:
        df = pd.read_csv(f)
        print("Columns:", list(df.columns))
        print("Shape:", df.shape)
        # Check target distribution for key candidates
        if 'Dataset' in df.columns:
            print("Target Distribution (Dataset):")
            print(df['Dataset'].value_counts())
        if 'stress_level' in df.columns:
            print("Target Distribution (stress_level):")
            print(df['stress_level'].value_counts())
        if 'Burnout Rate' in df.columns:
            print("Target Distribution (Burnout Rate):")
            print(df['Burnout Rate'].describe())
        if 'treatment' in df.columns:
             print("Target Distribution (treatment):")
             print(df['treatment'].value_counts())
            
    except Exception as e:
        print("Error reading:", e)
