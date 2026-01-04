import pandas as pd
import os

f = r"c:\Users\LENOVO\OneDrive\Desktop\Projects\ByteQuest\antigrav\data\train.csv"
try:
    df = pd.read_csv(f)
    print("ALL COLUMNS:", list(df.columns))
except Exception as e:
    print(e)
