import json
import boto3
import random
from boto3.dynamodb.conditions import Key

dynamodb = boto3.resource('dynamodb')
booking_table = dynamodb.Table('dalvac-bookings')
support_chat_table = dynamodb.Table('dalvac-support')
agent_table = dynamodb.Table('dalvac-agents')

def lambda_handler(event, context):
    # Extract booking id and message from the request body
    booking_id = event['booking_id']
    message = event['message']
    isAgent = event['agent'] # identify if the message is sent by agent or not.

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
            start_chat(booking_id, booking_details['property_id'])

        add_message(booking_id, message, isAgent)
    except Exception as e:
        print(f"Error: {str(e)}")


def get_booking_details(booking_id):
    # This function will return booking details.
    try: 
        response = booking_table.get_item(Key={'booking_id': booking_id})
        return response['Item']
    except Exception as e:
        print(str(e))

def is_chat_started(booking_id):
    # This function will check if the chat for the given booking reference code is already going on or not.
    try: 
        response = support_chat_table.get_item(Key={'booking_id': booking_id})
        return 'Item' in response
    except Exception as e:
        print(str(e))
        return False

def start_chat(booking_id, propertyId):
    # This function will start a chat for the given booking reference code and assign it to random agent.
    agent = get_random_agent(propertyId)
    try:
        support_chat_table.put_item(
            Item = {
                "booking_id": booking_id,
                'assignedAgent': agent,
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

def get_random_agent(propertyId):
    try:
        response = agents_table.query(
            IndexName='PropertyIDIndex', 
            KeyConditionExpression=Key('propertyID').eq(property_id)
        )
        
        agents = response.get('Items', [])
        
        if not agents:
            return None
        
        return random.choice(agents)
    except Exception as e:
        print(str(e))