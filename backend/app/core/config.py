import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "CodeMentor AI"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "your-secret-key-here")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days
    
    # Database
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://user:password@localhost:5432/codementor_db")
    
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
            
        import boto3
        import json
        from botocore.exceptions import ClientError

        client = boto3.client("secretsmanager", region_name=self.AWS_REGION)
        try:
            get_secret_value_response = client.get_secret_value(SecretId=self.AWS_SECRET_NAME)
            if "SecretString" in get_secret_value_response:
                secrets = json.loads(get_secret_value_response["SecretString"])
                for key, value in secrets.items():
                    if hasattr(self, key):
                        setattr(self, key, value)
        except ClientError as e:
            print(f"Error loading AWS secrets: {e}")

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()
# Attempt to load from AWS on startup if name is provided
settings.load_aws_secrets()
