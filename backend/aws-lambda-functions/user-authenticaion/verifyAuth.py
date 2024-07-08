import json

def lambda_handler(event, context):
    print(json.dumps(event))

    if event['request']['privateChallengeParameters']['answer'] == event['request']['challengeAnswer']:
        event['response']['answerCorrect'] = True
    else:
        event['response']['answerCorrect'] = False

    return event
