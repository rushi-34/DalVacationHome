import base64
import functions_framework
import requests
from flask import jsonify, request
import json

@functions_framework.cloud_event
def support_chat(cloud_event):
    lambda_endpoint = "https://5t9c2sbo5j.execute-api.us-east-1.amazonaws.com/dev/support"
    
    data = json.loads(base64.b64decode(cloud_event.data["message"]["data"]).decode('utf-8'))

    # Extracting payload data from pub/sub message.
    booking_id = data['booking_id']
    message = data['message']

    # Creating payload to invoke Lambda function
    payload = {
        'booking_id': booking_id,
        'message': message
    }

    try:
        # Invoking AWS Lambda function to assign user concern to a random agent.
        requests.post(lambda_endpoint, json=payload)
        print("Lambda function invoked successfully.")
    except requests.exceptions.RequestException as e:
        print(f"Failed to invoke Lambda function: {str(e)}")