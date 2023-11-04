const AWS = require('aws-sdk');

// Configure the AWS SDK with your AWS credentials and desired region
AWS.config.update({
  region: 'us-east-1', // Replace with your desired AWS region
});


// Create an EC2 client
const ec2 = new AWS.EC2();

// Define the parameters for the describeVpcs operation
const params = {};

// Call the describeVpcs operation
ec2.describeVpcs(params, (err, data) => {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('VPCs:', data.Vpcs);
  }
});
