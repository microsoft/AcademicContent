# Add a Web Api route to the Flask app

In the [previous step](./DeployTheWebAppToTheCloud.md) you deployed your Web App to the cloud, hosted in Azure. In this step you will add a route to this app to provide a Web Api to accept a photo that can be sent by the app.

## Defining a route to receive image data

As well as service up HTML pages, Web Apps can expose routes designed to be called from other apps, called Web APIs. These are routes that are called with an HTML verb that defines an action you want to take, such as the **GET** verb to show you want to get some data, or the **POST** verb saying you want to send data.

These APIs make up a [REST Api](https://en.wikipedia.org/wiki/Representational_state_transfer). The REST Api needed for this workshop has a single endpoint, a route of `/image`. A **POST** request to this route will be used to send an image encoded as a JSON object.

Before this REST Api can be defined, you need to know what format the data will be sent in. For this workshop, the images will be converted from binary data to [Base64 encoded](https://en.wikipedia.org/wiki/Base64) text, and embedded in a JSON document. Base64 is a way of converting raw binary data to a text representation so that it can be easily sent inside other text based wrappers such as JSON, and is easy to visualize when debugging.

> Sending Base64 encoded images is not the most efficient as this takes more space than binary images, meaning a larger amount of data is sent each time. We are doing this here as it is easy to debug.

JSON is a way of encoding data as text, using a set of key/value pairs. Each value can be another set of key/value pairs, or can be a list of key value pairs. This is a great, human-readable way to represent data. The JSON format for the data for this workshop is:

```json
{
    "image" : "<Base64 encoded image>"
}
```

This complete JSON text is referred to as a document, and is always enclosed in curly braces. This has a single key/value pair - the key is `image` and the value will be the image encoded as Base64.

## Write the code

* Open the `app.py` file.
* At the start of the file import the `request` member from the flask module by adding it to the existing import statement
  
  ```python
  from flask import Flask, request
  ```

* Import the `base64` module
  
  ```python
  import base64
  ```

* At the end of the file, add the following code:
  
  ```python
  @app.route('/image', methods=['POST'])
  def upload_image():
    json = request.get_json()
    base64_image = base64.b64decode(json['image'])

    return 'OK'
  ```

## What does this code do

The overall flow of this code is:

1. Define a route for '/image' that handles a **POST** request only
2. Extract the JSON from the request
3. Retrieve the `image` value from the JSON and convert it from Base64 to binary data

Lets look in more detail at the actual code.

```python
from flask import Flask, request
import base64
```

This tells the Python compiler that we want to use code in the `request` module. This module was installed as part of the `flask` package. It also tells the python compiler that we want to use `base64` from the Python standard libraries - these come with Python so there is no need to install another package to use them.

```python
@app.route('/image', methods=['POST'])
def upload_image():
```

This defines a function called `upload_image` that is mapped to a route called `/image`. Only **POST** requests are handled by this function.

```python
json = request.get_json()
```

The `request` object comes from Flask and provides details about the request that was sent to the Web Api. This request will contain any data that was sent, along with other information. The `get_json` method extracts the JSON from the request.

```python
base64_image = base64.b64decode(json['image'])
```

The JSON data has a key called `image` that will contain the image as Base64 encoded text, so this code extracts the value for that key and converts it back to binary data.

```python
return 'OK'
```

Each HTTP request needs to return a status code that gives information about the request - such as 200 to say everything worked or 404 to say the route hasn't been found. Returning text sends a 200 status to say the Api worked, along with data for the text, similar to how the `/` route returned HTML.

## Next step

In this step you added a route to this app to provide a Web Api to accept a photo that can be sent by the app, and extracted the image from the JSON. In the [next step](./AnalyseThePhotoUsingAI.md) you will analyze the image for faces using AI, checking each face for the emotion being displayed.
