#!/usr/bin/env python3
import speech_recognition as sr
import sys
audioFile = sys.argv[1] + '.wave'
text = open(sys.argv[1] + '.txt',"w+")

print(audioFile)
print(text)
print('analyzing ' + audioFile)
# obtain path to "english.wav" in the same folder as this script
from os import path
# AUDIO_FILE = path.join(path.dirname(path.realpath(__file__)), audioFile)
AUDIO_FILE = audioFile

# use the audio file as the audio source
r = sr.Recognizer()
with sr.AudioFile(AUDIO_FILE) as source:
    audio = r.record(source)  # read the entire audio file

# recognize speech using Sphinx
try:
    print("gnarly speech-to-text: " + r.recognize_sphinx(audio))
    text.write(r.recognize_sphinx(audio))
    print('saved as ' + sys.argv[1] + '.txt')
except sr.UnknownValueError:
    print("Sphinx could not understand audio")
except sr.RequestError as e:
    print("Sphinx error; {0}".format(e))

# transcribe incoming microphone stream:
# import speech_recognition as sr

# r = sr.Recognizer()
# mic = sr.Microphone()
# with mic as source:
#     r.adjust_for_ambient_noise(source)
#     audio = r.listen(source)
#     transcript = r.recognize_google(audio)
#     print(transcript)

# transcribe an audio file: