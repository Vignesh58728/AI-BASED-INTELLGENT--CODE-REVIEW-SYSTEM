import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "CodeMentor AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    GROQ_API_KEY: Optional[str] = os.getenv("GROQ_API_KEY")
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY")
    ANTHROPIC_API_KEY: Optional[str] = os.getenv("ANTHROPIC_API_KEY")
    DEEPSEEK_API_KEY: Optional[str] = os.getenv("DEEPSEEK_API_KEY")
    PERPLEXITY_API_KEY: Optional[str] = os.getenv("PERPLEXITY_API_KEY")
    OPENROUTER_API_KEY: Optional[str] = os.getenv("OPENROUTER_API_KEY")
    GPT_OSS_API_KEY: Optional[str] = os.getenv("GPT_OSS_API_KEY")
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY")
    JUDGE0_API_KEY: Optional[str] = os.getenv("JUDGE0_API_KEY")
    ALGORITHM: str = "HS256"

    # Google OAuth
    GOOGLE_CLIENT_ID: Optional[str] = os.getenv("GOOGLE_CLIENT_ID")
    GOOGLE_CLIENT_SECRET: Optional[str] = os.getenv("GOOGLE_CLIENT_SECRET")
    GOOGLE_REDIRECT_URI: str = os.getenv("GOOGLE_REDIRECT_URI", "http://localhost:5001/api/auth/google/callback")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "mongodb://localhost:27017")
    MONGODB_DB_NAME: str = os.getenv("MONGODB_DB_NAME", "aiviso")
    USE_SQL: bool = os.getenv("USE_SQL", "False").lower() == "true"
    
    # Redis
    REDIS_URL: str = os.getenv("REDIS_URL", "redis://localhost:6379/0")
    
    # AWS
    AWS_ACCESS_KEY_ID: Optional[str] = os.getenv("AWS_ACCESS_KEY_ID")
    AWS_SECRET_ACCESS_KEY: Optional[str] = os.getenv("AWS_SECRET_ACCESS_KEY")
    AWS_REGION: str = os.getenv("AWS_REGION", "us-east-1")
    AWS_SECRET_NAME: Optional[str] = os.getenv("AWS_SECRET_NAME")

    def load_aws_secrets(self):
        """
        Dynamically load secrets from AWS Secrets Manager if AWS_SECRET_NAME is set.
        """
        if not self.AWS_SECRET_NAME:
            return
            
        try:
            import boto3
            import json
            from botocore.exceptions import ClientError

            client = boto3.client("secretsmanager", region_name=self.AWS_REGION)
            get_secret_value_response = client.get_secret_value(SecretId=self.AWS_SECRET_NAME)
            if "SecretString" in get_secret_value_response:
                secrets = json.loads(get_secret_value_response["SecretString"])
                for key, value in secrets.items():
                    if hasattr(self, key):
                        setattr(self, key, value)
        except (ImportError, Exception) as e:
            print(f"Note: AWS secrets not loaded or name invalid: {e}")

    class Config:
        env_file = ".env"
        extra = "ignore"
        case_sensitive = True

settings = Settings()
# Attempt to load from AWS on startup if name is provided
settings.load_aws_secrets()
