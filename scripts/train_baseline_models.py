import os
import joblib
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.pipeline import Pipeline

# Paths
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "ml_models")
os.makedirs(MODEL_DIR, exist_ok=True)

def train_bug_model():
    print("Training Baseline Bug Model...")
    # Synthetic data: [code_snippet, has_bug (1/0)]
    data = [
        ("while True: pass", 1),
        ("def sum(a, b): return a + b", 0),
        ("for i in range(10): print(i)", 0),
        ("x = 1/0", 1),
        ("print('fixed result')", 1), # Hardcoded
        ("import time; time.sleep(100)", 1),
        ("def calculate(): x = 10; return x", 0)
    ]
    texts, labels = zip(*data)
    
    pipeline = Pipeline([
        ('vectorizer', CountVectorizer(token_pattern=r'(?u)\b\w+\b|[^\w\s]')),
        ('classifier', RandomForestClassifier(n_estimators=10))
    ])
    
    pipeline.fit(texts, labels)
    joblib.dump(pipeline, os.path.join(MODEL_DIR, "bug_model.pkl"))
    print("Bug model saved.")

def train_skill_model():
    print("Training Baseline Skill Model...")
    # Synthetic data: [code_snippet, skill_level (0: beginner, 1: intermediate, 2: advanced)]
    data = [
        ("print('hello')", 0),
        ("x = 10; y = 20; print(x+y)", 0),
        ("def greet(name): return 'Hi ' + name", 1),
        ("class User: def __init__(self, name): self.name = name", 2),
        ("[i*i for i in range(10) if i % 2 == 0]", 2),
        ("import pandas as pd; df = pd.read_csv('data.csv')", 2),
        ("for i in range(5): print(i)", 0),
        ("def factorial(n): return 1 if n <= 1 else n * factorial(n-1)", 1)
    ]
    texts, labels = zip(*data)
    
    pipeline = Pipeline([
        ('vectorizer', CountVectorizer(token_pattern=r'(?u)\b\w+\b|[^\w\s]')),
        ('classifier', RandomForestClassifier(n_estimators=10))
    ])
    
    pipeline.fit(texts, labels)
    joblib.dump(pipeline, os.path.join(MODEL_DIR, "skill_model.pkl"))
    print("Skill model saved.")

if __name__ == "__main__":
    train_bug_model()
    train_skill_model()
