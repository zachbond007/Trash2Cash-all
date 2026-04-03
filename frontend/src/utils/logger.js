const winston = require('winston');
const CloudWatchTransport = require('winston-cloudwatch');

// Initialize AWS SDK
const AWS = require('aws-sdk');
AWS.config.update({ region: 'us-east-1' }); // Replace 'us-east-1' with your AWS region

// Create a Winston logger instance
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console(),
    new CloudWatchTransport({
      logGroupName: 'Trash2Cash', // Your log group name
      logStreamName: 'application-log-stream', // Name your log stream
      awsRegion: 'us-east-1', // Replace 'us-east-1' with your AWS region
      createLogGroup: true,
      createLogStream: true,
      jsonMessage: true,
    }),
  ],
});

module.exports = logger;
