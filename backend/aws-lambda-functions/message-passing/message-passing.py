import json
import boto3
import random
import requests
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')
booking_table = dynamodb.Table('dalvac-bookings')
support_chat_table = dynamodb.Table('dalvac-support')

def lambda_handler(event, context):
    # Extract booking id and message from the request body
    body = json.loads(event['body'])
    
    # Extract booking id, message, and agent from the request body
    booking_id = body['booking_id']
    message = body['message']
    isAgent = body['agent'] # to identify if the message is sent by agent or not.

    try:
        booking_details = get_booking_details(booking_id)
        if not booking_details:
            return {
                'statusCode': 400,
                'body': json.dumps({
                    'message': 'Invalid booking id.'
                })
            }

        if not is_chat_started(booking_id):
            start_chat(booking_id, booking_details['user_id'])

        add_message(booking_id, message, isAgent)
    except Exception as e:
        print(f"Error: {str(e)}")


def get_booking_details(booking_id):
    # This function will return booking details.
    try:
        response = booking_table.query(
            IndexName='booking_id-index',
            KeyConditionExpression=Key('booking_id').eq(booking_id)
        )
        items = response.get('Items', [])
        return items[0] if items else None
    except Exception as e:
        print(str(e))
        return None

def is_chat_started(booking_id):
    # This function will check if the chat for the given booking reference code is already going on or not.
    try: 
        response = support_chat_table.get_item(Key={'booking_id': booking_id})
        return 'Item' in response
    except Exception as e:
        print(str(e))
        return False

def start_chat(booking_id, customerId):
    # This function will start a chat for the given booking reference code and assign it to random agent.
    agent = get_random_agent()
    try:
        support_chat_table.put_item(
            Item = {
                "booking_id": booking_id,
                'assignedAgent': agent,
                'customerId': customerId,
                'messages': []
            }
        )
    except Exception as e:
        print(str(e))

def add_message(booking_id, message, isAgent):
    # This function will add new message in the given booking reference code's chat.
    try:
        support_chat_table.update_item(
            Key={'booking_id': booking_id},
            UpdateExpression="SET messages = list_append(messages, :msg)",
            ExpressionAttributeValues={
                ':msg': [{
                    'message': message,
                    'isAgent': isAgent
                }]
            },
            ReturnValues="UPDATED_NEW"
        )
    except Exception as e:
        print(str(e))

def get_random_agent():
    try:
        response = requests.get('https://mrvsgdy2g3ftwaq6ed6xrugv7q0yjfyn.lambda-url.us-east-1.on.aws')
        users = response.json()

        agents = [user for user in users if user.get("custom:role") == "agent"]

        if not agents:
            return None

        random_agent = random.choice(agents)
        return random_agent.get("Username")
    except Exception as e:
        print(str(e))