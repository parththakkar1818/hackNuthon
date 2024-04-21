from fastapi import FastAPI
from database.db import connect_db
from fastapi.middleware.cors import CORSMiddleware
from Scripts.texttospeech import texttospeech
from Scripts.speechtotext import speechtotext
from pydantic import BaseModel

import os

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # replace with the list of allowed origins if you know them
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# Connect to MongoDB
client = connect_db()
folder_path = "HR_questions"
if not os.path.exists(folder_path):
    os.makedirs(folder_path)

@app.get("/")   
async def root():
    return {"message": "Hello World"}

@app.post("/fetchquestions")
async def fetchquestions():
    collection = client["Hacknuthon"]["HR_Questions"]
    
    questions = collection.find()
    questions_list = [{**question, "_id": str(question["_id"])} for question in questions][0]["questions"]
    
    # for i in range (len(questions_list)):
    #     texttospeech(questions_list[i],(f"{folder_path}/q{i}.mp3"))

    return {"questions": questions_list}

@app.post("/activate_function")
async def getAnswers():
    text = speechtotext();
    print(text)
    return {"yourans":text}

db = client["Hacknuthon"]
collection = db["interviews"]

class Conversation(BaseModel):
    userEmail: str
    conversation: list[str]

@app.post("/uploadconversations")
async def upload_conversations(conversations: Conversation):
    print(conversations)
    try:
        # Insert the conversation into MongoDB
        result = await collection.insert_one({"userEmail": conversations.userEmail , "conversation": conversations.conversation})
        return {"message": "Conversation uploaded successfully", "id": result.inserted_id}
    except Exception as e:
        return {"error": str(e)}
    
@app.post("downloadData")
async def downloaddata(userEmail):
    data = list(collection.find({"email": userEmail}, {"_id": 0, "conversation": 1}))
    if not data:
        raise HTTPException(status_code=404, detail="Data not found for the provided email")
    df = pd.DataFrame(data[0]["conversation"], columns=["conversation"])

    # Save the DataFrame to a CSV file
    csv_filename = f"{userEmail}_data.csv"
    df.to_csv(csv_filename, index=False)

    # Return the CSV file as a response
    return FileResponse(csv_filename, media_type="text/csv", filename=csv_filename)
