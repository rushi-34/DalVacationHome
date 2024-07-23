import json
import boto3
from datetime import datetime, timedelta # For Insertion Time
import uuid
from boto3.dynamodb.conditions import Attr
import requests


def lambda_handler(event, context):
    statusCode = 200
    body = []
    headers = {
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': '*',
        "Content-Type": "application/json"
    }
    
    # The header will give the user-id, booking-id, review_comments, review_stars
    # Save it in the reviews table as it is
    
    dynamodb = boto3.resource('dynamodb')
    room_table = dynamodb.Table('dalvac-rooms')
    review_table = dynamodb.Table('dalvac-reviews')
    booking_table = dynamodb.Table('dalvac-bookings')
    
    user_id = event.get('user_id')
    
    booking_id = event.get('booking_id')
    print('booking_id:', booking_id)
    
    room_id = booking_table.scan(FilterExpression=Attr('booking_id').eq(booking_id)).get("Items")[0].get('room_id')
    print('room_id: ', room_id)
    
    room_response = room_table.scan().get('Items')
    review_response = review_table.scan().get('Items')
    
    dateformat = '%m-%d-%Y'
    todate = datetime.strftime(datetime.today(), dateformat)
    review_date = todate
    
    print('review_date:', review_date)
    
    review_item = {
        'user_id': user_id,
        'room_id': room_id,
        'review_comments': event.get('review_comments'),
        'review_stars': str(event.get('review_stars')),
        'review_date': review_date,
        'booking_id': booking_id
    }
    
    print('review_item: ', review_item)
    
    review_table.put_item(Item = review_item)
    
    # Call the sentiment analysis to get the sentiment scores for that room
    url = 'https://us-central1-serverless-term.cloudfunctions.net/sentiment-analysis'
    # sample_data = {
    #     "feedbacks": [
    #         {"message": "This product is amazing! I love it."},
    #         {"message": "Poor quality, very disappointed."},
    #         {"message": "FUCK OFF, but could be better."},
    #         {"message": "FUCK OFF customer service!"},
    #         {"message": "Not worth the money."},
    #         {"message": "NOT satisfied with my purchase."}
    #     ]
    # }
    
    feedbacks = []
    star_rating=0
    review_dict = review_table.scan(FilterExpression=Attr('room_id').eq(room_id)).get("Items")
    for i in review_dict:
        message = i.get('review_comments')
        feedbacks.append({"message": message})
        star_rating = round(float(star_rating+float(i.get('review_stars')))/len(review_dict),1)
    print('feedbacks:', feedbacks)
    print('Average rating:', star_rating)
    data = {
         "feedbacks": feedbacks
    }
    print("Review data: ", data)
    
    headers = {'Content-Type': 'application/json'}
    sentiment_analysis_response = requests.post(url, headers=headers, data=json.dumps(data)).json()
    print('sentiment_analysis_response: ', sentiment_analysis_response)


    
    # Update that in the rooms table - average sentiment score, sentiment polarity, and sentiment adjective
    
    
    overall_sentiment= sentiment_analysis_response.get('overall_sentiment')
    overall_score= str(sentiment_analysis_response.get('overall_score'))
    star_rating=str(star_rating)
    
    room_update_response = room_table.update_item(
        Key={
            'room_id': room_id
        },
        UpdateExpression="SET overall_sentiment = :s, overall_score = :sc, star_rating = :sr",
        ExpressionAttributeValues={
            ':s': overall_sentiment,
            ':sc': overall_score,
            ':sr': star_rating
        }
    )
    
    print('room_update_response:', room_update_response)
    
    return {
        'statusCode': statusCode,
        'body': json.dumps(body),
        'headers': headers
    }