import boto3
import random
import json

client = boto3.client('dynamodb')

def get_random_number(min, max):
    return random.randint(min, max)

def caesar_cipher(text, shift):
    result = []
    for char in text:
        code = ord(char)
        if 65 <= code <= 90:  
            result.append(chr((code - 65 + shift) % 26 + 65))
        elif 97 <= code <= 122: 
            result.append(chr((code - 97 + shift) % 26 + 97))
        else:
            result.append(char)
    return ''.join(result)

def lambda_handler(event, context):
    print(event)
    print(json.dumps(event))

    if event['request']['challengeName'] != "CUSTOM_CHALLENGE":
        return event

    if len(event['request']['session']) == 2:
        event['response']['publicChallengeParameters'] = {}
        event['response']['privateChallengeParameters'] = {}
        
        get_security_question = {
            'TableName': "security_questions",
            'Key': {
                'username': { 'S': event['userName'] }
            }
        }

        response = client.get_item(**get_security_question)
        user_question = response['Item']
        event['response']['publicChallengeParameters']['type'] = "SECURITY_QUESTION"
        event['response']['publicChallengeParameters']['securityQuestion'] = user_question['q_id']['S']
        event['response']['privateChallengeParameters']['answer'] = user_question['answer']['S']
        event['response']['challengeMetadata'] = "SECURITY_QUESTION"

    if len(event['request']['session']) == 3:
        code = ['COOL', 'LAST', 'DOME', 'MOON', 'RICE']
        random_index = get_random_number(0, len(code) - 1)
        event['response']['publicChallengeParameters'] = {}
        event['response']['privateChallengeParameters'] = {}
        
        get_user_key = {
            'TableName': "caesar_key",
            'Key': {
                'username': { 'S': event['userName'] }
            }
        }

        response = client.get_item(**get_user_key)
        cipher_key = response['Item']
        event['response']['publicChallengeParameters']['securityQuestion'] = caesar_cipher(code[random_index], int(cipher_key['key']['N']))
        event['response']['privateChallengeParameters']['answer'] = code[random_index]
        event['response']['challengeMetadata'] = "CAESAR"
        event['response']['publicChallengeParameters']['type'] = "CAESAR"

    return event
