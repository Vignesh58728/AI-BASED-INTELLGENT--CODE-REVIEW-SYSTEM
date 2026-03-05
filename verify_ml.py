import os
import sys

# Add backend to path
sys.path.append(os.path.join(os.getcwd(), 'backend'))

from app.services.ml_service import MLService

def test_predictions():
    print("Initializing ML Service...")
    service = MLService()
    
    if service.bug_model is None:
        print("FAILED: Bug model not loaded.")
        return
    if service.skill_model is None:
        print("FAILED: Skill model not loaded.")
        return
        
    print("\nTesting Bug Prediction:")
    buggy_code = "while True: pass"
    clean_code = "def sum(a,b): return a+b"
    
    print(f"Code: {buggy_code} -> {service.predict_bugs(buggy_code)}")
    print(f"Code: {clean_code} -> {service.predict_bugs(clean_code)}")
    
    print("\nTesting Skill Prediction:")
    beginner_code = "print('hello')"
    advanced_code = "class MyProcessor: def __init__(self): self.data = [i for i in range(10)]"
    
    print(f"Code: {beginner_code} -> Skill Level: {service.predict_user_skill(beginner_code)}")
    print(f"Code: {advanced_code} -> Skill Level: {service.predict_user_skill(advanced_code)}")

if __name__ == "__main__":
    test_predictions()
