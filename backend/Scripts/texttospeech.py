import pyttsx3

# Initialize the engine
engine = pyttsx3.init()

def texttospeech(text, file_name="output.mp3"):
    # Set properties (optional)
    engine.setProperty('rate', 150)  # Speed of speech
    engine.setProperty('volume', 1)  # Volume level (0.0 to 1.0)

    # Convert text to speech and save as MP3 file
    engine.save_to_file(text, file_name)
    engine.say(text)
    # Wait for the speech to finish
    engine.runAndWait()
