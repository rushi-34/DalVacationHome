import boto3
import json

client = boto3.client('dynamodb')

def lambda_handler(event, context):
    event['response']['autoConfirmUser'] = True

    security_questions = json.loads(event['request']['validationData']['security_questions'])
    caesar_key_data = {
        'Item': {
            'username': {
                'S': event['userName']
            },
            'key': {
                'N': event['request']['validationData']['caesar_key']
            }
        },
        'TableName': 'caesar_key'
    }

    security_question_data = {
        'Item': {
            'username': {
                'S': event['userName']
            },
            'q_id': {
                'S': security_questions['q_id']
            },
            'answer': {
                'S': security_questions['answer']
            }
        },
        'TableName': 'security_questions'
    }

    try:
        response = client.put_item(**caesar_key_data)
        response2 = client.put_item(**security_question_data)
        return event
    except Exception as error:
        print('Error writing to DynamoDB:', error)
