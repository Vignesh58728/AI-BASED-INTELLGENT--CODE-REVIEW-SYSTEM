import motor.motor_asyncio
import asyncio

async def test():
    uri = "mongodb+srv://saivigneshv006_db_user:saivignesh475@cluster0.1z6wuom.mongodb.net/"
    client = motor.motor_asyncio.AsyncIOMotorClient(uri, serverSelectionTimeoutMS=5000)
    try:
        print("Connecting to MongoDB...")
        await client.admin.command('ping')
        print("Pinged your deployment. You successfully connected to MongoDB!")
    except Exception as e:
        print(f"Connection failed: {e}")

if __name__ == "__main__":
    asyncio.run(test())
