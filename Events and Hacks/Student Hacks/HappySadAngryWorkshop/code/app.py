import random, os, io, base64
from flask import Flask, render_template, request, jsonify
from azure.cognitiveservices.vision.face import FaceClient
from msrest.authentication import CognitiveServicesCredentials

credentials = CognitiveServicesCredentials(os.environ['face_api_key'])
face_client = FaceClient(os.environ['face_api_endpoint'], credentials=credentials)

emotions = ['anger','contempt','disgust','fear','happiness','sadness','surprise']

def best_emotion(emotion):
    emotions = {}
    emotions['anger'] = emotion.anger
    emotions['contempt'] = emotion.contempt
    emotions['disgust'] = emotion.disgust
    emotions['fear'] = emotion.fear
    emotions['happiness'] = emotion.happiness
    emotions['neutral'] = emotion.neutral
    emotions['sadness'] = emotion.sadness
    emotions['surprise'] = emotion.surprise
    return max(zip(emotions.values(), emotions.keys()))[1]

app = Flask(__name__)

@app.route('/')
def home():
    page_data = {
        'emotion' : random.choice(emotions)
    }
    return render_template('home.html', page_data = page_data)

@app.route('/result', methods=['POST'])
def check_results():
    body = request.get_json()
    desired_emotion = body['emotion']

    image_bytes = base64.b64decode(body['image_base64'].split(',')[1])
    image = io.BytesIO(image_bytes)

    faces = face_client.face.detect_with_stream(image,
                                                return_face_attributes=['emotion'])

    if len(faces) == 1:
        detected_emotion = best_emotion(faces[0].face_attributes.emotion)

        if detected_emotion == body['emotion']:
            return jsonify({
                'message': '✅ You won! You showed ' + desired_emotion
            })
        else:
            return jsonify({
                'message': '❌ You failed! You needed to show ' + 
                           desired_emotion + 
                           ' but you showed ' + 
                           detected_emotion
            })
    else:
        return jsonify({
            'message': '☠️ ERROR: No faces detected'
        })
