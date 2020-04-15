import cv2
import requests
import base64

imageUrl = '<Your App Url>/image'

def upload(frame):
    data = {}
    img = cv2.imencode('.jpg', frame)[1]
    data['image'] = base64.b64encode(img).decode()
    requests.post(url=imageUrl, json=data)

cam = cv2.VideoCapture(0)
cv2.namedWindow('Press space to take a photo')

while True:
    ret, frame = cam.read()
    cv2.imshow('Press space to take a photo', frame)
        
    k = cv2.waitKey(1)
    if k%256 == 32:
        upload(frame)
        break

cam.release()
cv2.destroyAllWindows()