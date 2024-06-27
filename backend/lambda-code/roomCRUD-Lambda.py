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
    print('Abhishek is here!!')
    body = {}
    statusCode = 200
    headers = {
        "Content-Type": "application/json"
    }

    try:
        if(event['httpMethod']=='GET'):
            print('Abhishek is in GET method!!')
            body = table.scan()
            body = body["Items"]
            print("ITEMS----")
            responseBody = []
            for items in body:
                responseItems = [
                    {'room_id': items['room_id'], 
                    'room_feature': items['room_feature'], 
                    'room_price': float(items['room_price']), 
                    'room_type': items['room_type']}]
                responseBody.append(responseItems)
            body = responseBody
        
        elif(event['httpMethod']=='POST'):
            print('Abhishek is in POST method!!')
            print("POSTING", event)
            body = event['body']
            print("POSTING BODY", body)
            id = uuid.uuid4().hex[:4] # Generating a unique 4 digit code
            print("Id:", id)
            
            try:
                # Get the current time in epoch second format
                current_time = int(datetime.now().timestamp())
                item = {
                    'room_id': id,
                    'room_feature': body['room_feature'],
                    'room_price': body['room_price'],
                    'room_type': body['room_type']
                }
                table.put_item(Item=item)
                body = item
                print("Item inserted successfully")
                
            except Exception as e:
                print(f"Error found in Inserting an Item, :{e}")
                raise
            
            # dynamodb.put_item(TableName='fruitSalad', Item={'fruitName':{'S':'Banana'},'key2':{'N':'value2'}})

        
    except KeyError:
        statusCode = 400
        body = 'Error...'
        
    body = json.dumps(body)
    res = {
        "statusCode": statusCode,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": body
    }
    return res