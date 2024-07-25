import os
from google.cloud import language_v1
from flask import Flask, request, jsonify  # Import jsonify from Flask



def hello_world(request):
    """Responds to any HTTP request."""
    request_json = request.get_json()
    
    print("Request:", request_json)
    overall_sentiment = analyze_multiple_sentiments(request_json)

    return jsonify({
        'overall_sentiment': overall_sentiment['sentiment'],
        'overall_score': overall_sentiment['score'],
        'overall_adjective': get_overall_adjective(overall_sentiment['score'])
    })

def analyze_multiple_sentiments(request_json):
    # Set up the client
    client = language_v1.LanguageServiceClient()

    feedback_messages = request_json.get('feedbacks', [])

    print("Analyzing: ", feedback_messages)
    
    overall_score = 0.0
    overall_magnitude = 0.0
    num_feedbacks = len(feedback_messages)

    for feedback in feedback_messages:
        text = feedback.get('message', 'Hello, World!')

        print("Analysing: ", text)
        # Prepare the document
        document = language_v1.Document(
            content=text,
            type_=language_v1.Document.Type.PLAIN_TEXT
        )

        # Detect sentiment in the document
        sentiment = client.analyze_sentiment(request={'document': document}).document_sentiment

        overall_score += sentiment.score
        overall_magnitude += sentiment.magnitude

    if num_feedbacks > 0:
        overall_score /= num_feedbacks
        overall_magnitude /= num_feedbacks

    overall_sentiment = {
        'sentiment': 'Neutral' if overall_score == 0.0 else ('Positive' if overall_score > 0.0 else 'Negative'),
        'score': overall_score,
        'magnitude': overall_magnitude
    }

    return overall_sentiment

def get_overall_adjective(score):
    if score > 0.25:
        return 'Good'
    elif score < -0.25:
        return 'Bad'
    else:
        return 'Neutral'

