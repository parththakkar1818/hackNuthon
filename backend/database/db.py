import pymongo
from pymongo.errors import ConnectionFailure

def connect_db():
    uri="mongodb://127.0.0.1:27017/Hacknuthon"
    try:
        client = pymongo.MongoClient(uri)
        print("Connected to MongoDB")
        return client
    except ConnectionFailure as e:
        print(f"Failed to connect to MongoDB: {e}")
        return None
