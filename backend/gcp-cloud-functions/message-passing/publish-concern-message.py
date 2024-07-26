import json
from google.cloud import pubsub_v1

publisher = pubsub_v1.PublisherClient()
topic_path = publisher.topic_path('dalvacationhome-428403', 'support-chat')

def publish_support_message(request):
    """Responds to any HTTP request.
    Args:
        request (flask.Request): HTTP request object.
    Returns:
        The response text or any set of values that can be turned into a
        Response object using
        `make_response <http://flask.pocoo.org/docs/1.0/api/#flask.Flask.make_response>`.
    """
    if request.method == 'OPTIONS':
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
        return ('', 204, headers)
    request_json = request.get_json()
    if not request_json or 'booking_id' not in request_json or 'message' not in request_json or 'isAgent' not in request_json:
        return 'Invalid request. JSON payload must include booking_id, message, and isAgent fields.', 400

    message = {
        'booking_id': request_json['booking_id'],
        'message': request_json['message'],
        'isAgent': request_json['isAgent']
    }

    # Data must be a bytestring
    data = json.dumps(message).encode('utf-8')
    
    try:
        future = publisher.publish(topic_path, data)
        future.result()  
        return 'Message published.', 200
    except Exception as e:
        return str(e), 500
