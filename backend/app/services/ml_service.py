import os
try:
    import joblib
    HAS_JOBLIB = True
except ImportError:
    HAS_JOBLIB = False
import logging
from typing import List, Dict, Any, Optional

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Paths to models
# __file__ is backend/app/services/ml_service.py
# 1st dirname: backend/app/services
# 2nd dirname: backend/app
# 3rd dirname: backend
# 4th dirname: project_root
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
MODEL_DIR = os.path.join(BASE_DIR, "ml_models")

BUG_MODEL_PATH = os.path.join(MODEL_DIR, "bug_model.pkl")
SKILL_MODEL_PATH = os.path.join(MODEL_DIR, "skill_model.pkl")

class MLService:
    def __init__(self):
        self.bug_model = self._load_model(BUG_MODEL_PATH, "Bug Detection")
        self.skill_model = self._load_model(SKILL_MODEL_PATH, "Skill Assessment")
        
    def _load_model(self, path: str, desc: str):
        """Loads a model with error handling for empty or missing files."""
        if not os.path.exists(path):
            logger.warning(f"{desc} model file not found at {path}")
            return None
            
        if os.path.getsize(path) == 0:
            logger.warning(f"{desc} model file is empty (0 bytes) at {path}")
            return None
            
        try:
            if not HAS_JOBLIB:
                logger.warning(f"Cannot load {desc} model: joblib is not installed.")
                return None
            return joblib.load(path)
        except Exception as e:
            logger.error(f"Failed to load {desc} model: {e}")
            return None

    def predict_bugs(self, code: str) -> List[Dict[str, Any]]:
        """
        Predict bugs in the code using the ML model.
        Returns a list of issue objects.
        """
        if not self.bug_model:
            return []
            
        try:
            # The model is a Pipeline (Vectorizer + Classifier)
            prediction = self.bug_model.predict([code])[0]
            if prediction == 1:
                return [{
                    "type": "ML Bug Detection",
                    "message": "Potential logical flaw or anti-pattern detected by ML model.",
                    "severity": "warning"
                }]
            return []
        except Exception as e:
            logger.error(f"Bug prediction error: {e}")
            return []

    def predict_user_skill(self, code: str) -> Optional[float]:
        """
        Predict user skill/proficiency level based on the code.
        Returns a score (0: Beginner, 1: Intermediate, 2: Advanced) or None.
        """
        if not self.skill_model:
            return None
            
        try:
            # The model is a Pipeline (Vectorizer + Classifier)
            prediction = self.skill_model.predict([code])[0]
            return float(prediction)
        except Exception as e:
            logger.error(f"Skill prediction error: {e}")
            return None

# Singleton instance
ml_service = MLService()
