# dbqueryjson
A simple query runner for postgresql that runs on AWS Lambda

## What it does
The Lambda function can be used in an API Gateway API. When invoked, it runs one of several configurable SQL statements against a database and returns the results as a JSON object. The main purpose of dbqueryjson is to make some simple database queries available to any client without exposing database credentials or the actual statements.

## Installation

1. Put your own statements into the code
1. Create the Lambda function with this code
1. Set the Lambda environment variables `dbUser`, `db`, `dbPassword`, `dbHost`, `port`
1. Create an API Gateway with two resources ("GET /datasets/" and "GET /datasets/{datasetname}"). Both should point to the Lambda function with the Lambda Proxy Integration
1. Publish the API
