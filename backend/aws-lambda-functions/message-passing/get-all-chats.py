import json
import boto3
from boto3.dynamodb.conditions import Key, Attr

dynamodb = boto3.resource('dynamodb')
support_chat_table = dynamodb.Table('dalvac-support')

def lambda_handler(event, context):
    # Extract user id and role from the request body
    body = json.loads(event['body'])
    user_id = body['user_id']
    is_agent = body['is_agent']

    try:
        chat_details = get_chat_details(user_id, is_agent)
        if not chat_details:
            return {
                'statusCode': 404,
                'body': json.dumps({
                    'message': 'No chat found for the given user id.'
                })
            }
        return {
            'statusCode': 200,
            'body': json.dumps({
                'chatDetails': chat_details
            })
        }
    except Exception as e:
        print(f"Error: {str(e)}")
        return {
            'statusCode': 500,
            'body': json.dumps({
                'message': 'Internal server error.'
            })
        }

def get_chat_details(user_id, is_agent):
    # This function will return chat details for the given user ID.
    print(user_id)
    try:
        if is_agent:
            response = support_chat_table.scan(
                FilterExpression=Attr('assignedAgent').eq(user_id)
            )
        else:
            response = support_chat_table.scan(
                FilterExpression=Attr('customerId').eq(user_id)
            )
        
        return response.get('Items', [])
    except Exception as e:
        print(str(e))
        return None