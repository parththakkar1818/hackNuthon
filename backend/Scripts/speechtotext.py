import speech_recognition as sr

# Initialize the recognizer
r = sr.Recognizer()

def speechtotext():
    # Record audio from the microphone
    print("start listening")
    with sr.Microphone() as source:
        print("Speak something:")
        audio = r.listen(source, timeout=20)  # Set timeout to 10 seconds
    print("end listening")

    try:
        # Recognize speech using Google Web Speech API
        text = r.recognize_google(audio)
        print("You said:", text)
        return text
    except sr.UnknownValueError:
        print("Google Web Speech API could not understand the audio.")
        return "A.I Model is not able to hear you!"
    except sr.RequestError as e:
        print("Could not request results from Google Web Speech API; {0}".format(e))
        return "Error From Server Side!"