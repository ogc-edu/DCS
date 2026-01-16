A personal project for trying out AWS infrastructure.
A simple project of Smart Traffic Control System.
AWS Service used include AWS IoT, DynamoDB, Lambda function and S3

The main objective of this project is to solve traffic congestion by allowing dynamic allocation of traffic light signal duration at congested roads.
For example, congested road will be allocated longer green light duration to allow traffic to smoothen quickly.
Traffic light at the same junction acts as a node, each node will send traffic condition based on number of cars detected in 100m to IoT Core using Pub/Sub model.
Lambda will then receive and process signals from all nodes at the same junction, then based on processing logic to allocate red and green light duration to all nodes at the same junction.
