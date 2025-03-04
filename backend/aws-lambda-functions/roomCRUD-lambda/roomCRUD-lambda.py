import json
import boto3
import uuid
from decimal import Decimal
from datetime import datetime, timedelta # For Insertion Time

client = boto3.client('dynamodb')
dynamodb = boto3.resource("dynamodb")
table = dynamodb.Table('dalvac-rooms')
tableName = 'dalvac-rooms'


def lambda_handler(event, context):
    print("Event:", event)
    body = {}
    statusCode = 200
    headers = {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        "Content-Type": "application/json"
    }
    
    
    print("Event Body:", event['body'])
    
    try:
        if event['httpMethod'] == 'GET':
            # print('Abhishek is in GET method!!')
            body = table.scan()
            body = body["Items"]
            # print("ITEMS----")
            responseBody = []
            for items in body:
                responseItems = {
                    'room_id': items['room_id'],
                    'room_feature': items['room_feature'],
                    'room_price': float(items['room_price']),
                    'room_type': items['room_type']
                }
                responseBody.append(responseItems)
            body = responseBody
            # print("GET Return Body:", body)

        
        elif(event['httpMethod']=='POST'):
            # print('Abhishek is in POST method!!')
            # print("POSTING", event)
            current_time = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
            # print(current_time)
            body = json.loads(event['body'])
            # print("BODY", body)
            id = uuid.uuid4().hex[:4] # Generating a unique 4 digit code
            
            try:
                item = {
                    'room_id': id,
                    'room_feature': body.get("room_feature"),
                    'room_price': body.get("room_price"),
                    'room_type': body.get("room_type"),
                    'created_time': current_time,
                    'last_updated': current_time
                }
                # print(item)
                
                table.put_item(Item=item)
                body = item
                print("Item inserted successfully")
                
            except Exception as e:
                print(f"Error found in Inserting an Item, {e}")
                raise
            
        elif (event['httpMethod'] == 'PUT'):
            print('Abhishek is in the PUT method')
            current_time = datetime.now().strftime("%d/%m/%Y %H:%M:%S")
            body = json.loads(event['body'])
            print('body', body)
            try:
                # Search for that item
                print('inside try')
                print("EVENT: ", event)
                
                id = event['pathParameters']['room_id']
                
                item = {
                    'room_id': id,
                    'room_feature': body.get("room_feature"),
                    'room_price': body.get("room_price"),
                    'room_type': body.get("room_type"),
                    'created_time': body.get("created_time"),
                    'last_updated': current_time
                }
                
                table.update_item(
                    Key = {
                        'room_id': id
                    },
                    UpdateExpression='SET room_feature',
                    )
                
            except Exception as e:
                print(f"Error updating the record, {e}")
            
            
    except KeyError:
        statusCode = 400
        body = 'Error...'
        
    body = json.dumps(body)
    res = {
        "statusCode": statusCode,
        "headers": headers,
        "body": body
    }
    return res