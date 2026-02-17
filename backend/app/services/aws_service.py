import boto3
from botocore.exceptions import ClientError
from app.core.config import settings
from typing import Optional

class AWSService:
    def __init__(self):
        self.s3_client = boto3.client(
            "s3",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_REGION,
        )

    def upload_file(self, file_content: str, bucket: str, object_name: str) -> bool:
        """
        Upload a string/file to an S3 bucket.
        """
        try:
            self.s3_client.put_object(Body=file_content, Bucket=bucket, Key=object_name)
        except ClientError as e:
            print(f"S3 Upload Error: {e}")
            return False
        return True

    def get_file(self, bucket: str, object_name: str) -> Optional[str]:
        """
        Retrieve a file from S3.
        """
        try:
            response = self.s3_client.get_object(Bucket=bucket, Key=object_name)
            return response["Body"].read().decode("utf-8")
        except ClientError as e:
            print(f"S3 Download Error: {e}")
            return None

aws_service = AWSService()
