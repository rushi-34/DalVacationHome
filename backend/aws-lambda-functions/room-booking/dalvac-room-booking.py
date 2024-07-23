import json
import uuid
import boto3
from datetime import datetime

client = boto3.client('dynamodb')
dynamodb = boto3.resource("dynamodb")
bookings_table = dynamodb.Table('dalvac-bookings')
rooms_table = dynamodb.Table('dalvac-rooms')

def lambda_handler(event, context):
    statusCode = 200
    body = []
    headers = {
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Origin": "https://www.example.com",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    }
    
    print("New Booking Event:", event)
    
    try:
        body = event
        
        print("Body: ", body)
        
        user_id = body.get('user_id')
        room_id = body.get('room_id')
        date_format = "%m-%d-%Y"
        start_date = datetime.strftime(datetime.strptime(body.get('start_date'), date_format), date_format)
        end_date = datetime.strftime(datetime.strptime(body.get('end_date'), date_format), date_format)
        
        print("start_date: ", start_date, "end_date: ", end_date)
        
        
        if not user_id or not end_date or not start_date or not room_id:
            print("Pass all the required information...")
            statusCode = 400
            body = json.dumps(
                {"error": "Pass all the required information: user_id, start_date, end_date, room_id"}
            )
        else:
            # Check if the room exists in the dalvac-rooms table
            room_response = rooms_table.get_item(Key={'room_id': room_id})
            if 'Item' not in room_response:
                statusCode = 404
                body = json.dumps({"error": "Room not found"})
            else:
                booking_id = "B-" + room_id + "-" + uuid.uuid4().hex[:4]
                current_date = datetime.now().strftime(date_format)
                booking_status = "Confirmed"
    
                item = {
                    'user_id': user_id,
                    'booking_id': booking_id,
                    'booking_date': current_date,
                    'room_id': room_id,
                    'start_date': start_date,
                    'end_date': end_date,
                    'status': booking_status
                }
                
                print("Item:", item)
                
                bookings_table.put_item(Item=item)
                
                body = json.dumps(item)
                
        
    except Exception as e:
        print(f"Error found!!!, {e}")
        raise
        
    
    return {
        'statusCode': statusCode,
        'body': body,
        'headers': headers
    }
