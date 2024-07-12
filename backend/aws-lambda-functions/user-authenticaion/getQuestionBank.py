import boto3
import json

dynamodb = boto3.client('dynamodb')

def lambda_handler(event, context):
    get_questions = {
        'TableName': 'question_bank'
    }

    try:
        response = dynamodb.scan(**get_questions)
        items = [unmarshall(item) for item in response['Items']]

        return {
            'statusCode': 200,
            'body': json.dumps(items)
        }
    except Exception as e:
        print('Cannot fetch the questions from DynamoDB:', e)
        return {
            'statusCode': 500,
            'body': json.dumps({'message': 'Internal Server Error'})
        }

def unmarshall(dynamo_obj):
    """
    Unmarshall a DynamoDB item to a Python dict.
    """
    unmarshalled_dict = {}
    for key, value in dynamo_obj.items():
        unmarshalled_dict[key] = next(iter(value.values()))
    return unmarshalled_dict
