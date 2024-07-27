import json
import boto3
from boto3.dynamodb.conditions import Attr


def lambda_handler(event, context):
    statusCode = 200
    body = []
    headers = {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        "Content-Type": "application/json"
    }
    
    print("Event:", event)
    
    user_id = event.get('user_id')
    
    dynamodb = boto3.resource('dynamodb')
    booking_table = dynamodb.Table('dalvac-bookings')
    
    booking_response = booking_table.scan(FilterExpression=Attr("user_id").eq(user_id)).get("Items")
    
    print("booking_response:", booking_response)
    
    body = booking_response
    
    return {
        'statusCode': 200,
        'body': body,
        'headers': headers
        
    }
