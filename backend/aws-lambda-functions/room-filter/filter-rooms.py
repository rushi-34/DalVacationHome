import json
import boto3
from boto3.dynamodb.conditions import Attr

from datetime import datetime


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
    
    # Boto3 DynamoDB Resource Initialization
    dynamodb = boto3.resource('dynamodb')
    rooms_table = dynamodb.Table('dalvac-rooms')
    bookings_table = dynamodb.Table('dalvac-bookings')
       
    rooms_response = rooms_table.scan()
    bookings_response = bookings_table.scan()
    
    # Rooms table is here
    # Booking Table is here
    
    
    rooms_set = set()
    
    for room in rooms_response.get('Items'):
        rooms_set.add(room.get('room_id'))
    
    # Room set is being created
    
    date_format = '%m-%d-%Y'
    if('body' not in event):
        print("Body is not present")
        start_date = datetime.strptime(event.get('start_date'), date_format)
        end_date = datetime.strptime(event.get('end_date'), date_format)
    
    elif('body' in event):
        print("Body is present")
        start_date = datetime.strptime(event.get('body').get('start_date'), date_format)
        end_date = datetime.strptime(event.get('body').get('end_date'), date_format)
    
    print("start_date:", start_date)
    print("end_date:", end_date)
    
    for booking in bookings_response.get('Items'):
        print("Booking:", booking)
        booked_room_id = booking.get('room_id')
        booking_start_date = datetime.strptime(booking.get('start_date'),date_format)
        booking_end_date = datetime.strptime(booking.get('end_date'),date_format)
        print("booking_start_date:", booking_start_date)
        print("booking_end_date:", booking_end_date)
        
        if(booking_start_date<=end_date and booking_start_date>=start_date):
            print("booked_room_id:", booked_room_id, " is booked between the dates...")
            rooms_set.discard(booked_room_id)
    
    print("Available rooms:", rooms_set)
    
    rooms_set_list=list(rooms_set)
    print("rooms_set_list:", rooms_set_list)
    
    filtered_room_response = rooms_table.scan(
        FilterExpression=Attr('room_id').is_in(rooms_set_list)
        )
    print('filtered_room_response: ', filtered_room_response)
    
    body = filtered_room_response.get('Items')
    print('Final Body:', body)
        
            
        
        
    
    return {
        'statusCode': statusCode,
        'body': json.dumps(body),
        'headers': headers,
    }
