# Sentiment Analysis Cloud Function

This Cloud Function uses Google Cloud Natural Language API to perform sentiment analysis on multiple feedback messages and provide an overall sentiment, score, and adjective (good, bad, or neutral) based on the aggregated results.

## Setup Steps

1. **Create a Google Cloud Platform Project:**

   If you don't already have a GCP project, create one in the [Google Cloud Console](https://console.cloud.google.com/).

2. **Enable Necessary APIs:**

   Ensure the following APIs are enabled for your project:
   - Google Cloud Functions API
   - Google Cloud Natural Language API

3. **Set Up the Cloud Function:**

   - Use the Cloud SDK or Cloud Console to deploy the Cloud Function. Ensure you deploy it as a Gen 1 function.
   
     ```bash
     gcloud functions deploy analyzeSentiments \
         --runtime python310 \
         --trigger-http \
         --allow-unauthenticated
     ```
   
   - Replace `analyzeSentiments` with your preferred function name.
   
4. **Testing Payload:**

   Use the following JSON payload for testing the Cloud Function:
   ```json
   {
       "feedbacks": [
           {"message": "This product is amazing! I love it."},
           {"message": "Poor quality, very disappointed."},
           {"message": "Okay, but could be better."},
           {"message": "Great customer service!"},
           {"message": "Not worth the money."},
           {"message": "Very satisfied with my purchase."}
       ]
   }
    ```

5. **Usage:**

    Send a POST request to the Cloud Function endpoint with the above payload to receive an overall sentiment analysis result in JSON format.

## Function Overview
### The Cloud Function:

* Receives HTTP POST requests containing a JSON payload of feedback messages.
* Utilizes Google Cloud Natural Language API to analyze the sentiment of each message.
* Calculates an overall sentiment score and magnitude based on the aggregated results.
* Returns a JSON response with the overall sentiment (positive, negative, or neutral), score, and an adjective (good, bad, or neutral) describing the sentiment.

## Notes
* Adjust the sentiment thresholds in get_overall_adjective function based on your application's specific sentiment categorization needs.
* Ensure proper authentication and authorization settings for your Cloud Function based on your deployment requirements.


This README provides a step-by-step guide to setting up and using the sentiment analysis Cloud Function on GCP, enabling others to quickly deploy and utilize this functionality in their own projects.