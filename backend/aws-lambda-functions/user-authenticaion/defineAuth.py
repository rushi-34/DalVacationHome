import json

def lambda_handler(event, context):
    print(json.dumps(event['request']['session']))
    
    if (
        len(event['request']['session']) == 1 and
        event['request']['session'][0]['challengeName'] == "SRP_A"
    ):
        event['response']['issueTokens'] = False
        event['response']['failAuthentication'] = False
        event['response']['challengeName'] = "PASSWORD_VERIFIER"
        
    elif (
        len(event['request']['session']) == 2 and
        event['request']['session'][1]['challengeName'] == "PASSWORD_VERIFIER" and
        event['request']['session'][1]['challengeResult'] == True
    ):
        event['response']['issueTokens'] = False
        event['response']['failAuthentication'] = False
        event['response']['challengeName'] = "CUSTOM_CHALLENGE"
        
    elif (
        len(event['request']['session']) == 3 and
        event['request']['session'][2]['challengeName'] == "CUSTOM_CHALLENGE" and
        event['request']['session'][2]['challengeResult'] == True
    ):
        event['response']['issueTokens'] = False
        event['response']['failAuthentication'] = False
        event['response']['challengeName'] = "CUSTOM_CHALLENGE"
        
    elif (
        len(event['request']['session']) == 4 and
        event['request']['session'][3]['challengeName'] == "CUSTOM_CHALLENGE" and
        event['request']['session'][3]['challengeResult'] == True
    ):
        event['response']['issueTokens'] = True
        event['response']['failAuthentication'] = False
        
    else:
        event['response']['issueTokens'] = False
        event['response']['failAuthentication'] = True
        
    return event
