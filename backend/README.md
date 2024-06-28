## References

1. https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-dynamo-db.html#http-api-dynamo-db-create-function


To create a new room references:
1. https://docs.aws.amazon.com/code-library/latest/ug/python_3_dynamodb_code_examples.html#scenarios
2. https://stackoverflow.com/questions/42703059/how-to-create-a-8-digit-unique-id-in-python - to create a unique UUID in python
3. https://stackoverflow.com/questions/33535613/how-to-put-an-item-in-aws-dynamodb-using-aws-lambda-with-python - lambda insertion in python

CORS:
1. https://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-cors.html
2. Enable the Lambda Proxy Integration in the API Gateway.

Design Decisions

is it better to have a big lambda function for all http methods or sseparate function for each http method
ChatGPT
When deciding between having a single large Lambda function handling multiple HTTP methods versus separate Lambda functions for each HTTP method, consider the following factors:

Single Lambda Function for All HTTP Methods
Pros:

Simplicity: It's easier to manage and deploy a single Lambda function.
Less Overhead: No need to manage multiple function configurations or deployments.
Code Organization: All related logic is in one place, making it easier to follow.
Cons:

Complexity: The function might become large and complex over time, making maintenance and debugging harder.
Performance: If the function handles multiple unrelated tasks, it could impact performance due to increased code execution time.
Concurrency: Shared resources (like database connections) might become bottlenecks.
Separate Lambda Functions for Each HTTP Method
Pros:

Modularity: Each function is focused on a specific task, making it easier to understand and maintain.
Scalability: Individual functions can be scaled independently based on their specific needs.
Performance: Each function can be optimized for its specific task, improving overall performance.
Cons:

Deployment Overhead: Managing multiple functions can lead to increased overhead in deployment and configuration.
Code Duplication: If there's shared logic, it might lead to code duplication unless properly abstracted.
Considerations:
Granularity: Choose based on the granularity of your application's functionalities. Smaller, focused functions are often easier to reason about and maintain.

Scaling: If certain functions are expected to handle significantly higher loads than others, separate functions allow you to scale them independently.

Maintenance: Consider the long-term maintenance of your application. Will a single function grow too large and unwieldy over time? Will separate functions lead to better team collaboration and codebase management?

Best Practice:
Service-oriented: Aim for a balance. Group related functionalities within a single Lambda function if they logically belong together (e.g., CRUD operations on the same resource). Separate unrelated functionalities into distinct Lambda functions.

Serverless Patterns: Leverage serverless patterns like API Gateway's integration with Lambda to efficiently manage and route requests to the appropriate functions based on HTTP methods.

In conclusion, while both approaches have their merits, separating Lambda functions for each HTTP method often aligns better with the serverless architecture's principles of modularity, scalability, and performance optimization. However, the specific design should always consider your application's requirements, team capabilities, and long-term maintenance needs.
- GPT


----

