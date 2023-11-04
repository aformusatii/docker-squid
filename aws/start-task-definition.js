import {EC2} from "@aws-sdk/client-ec2";
import {ECS} from "@aws-sdk/client-ecs";
import {fromEnv} from "@aws-sdk/credential-providers";

// Create an EC2 client
const ec2 = new EC2({
  // Replace with your desired AWS region
  region: 'us-east-1',
  credentials: fromEnv()
});

const ecs = new ECS({
  region: 'us-east-1',
  credentials: fromEnv()
});

const taskRunParams = {
  cluster: 'TestClusterV1',
  taskDefinition: 'SQUID_HTTP_PROXY_V2',
  launchType: 'FARGATE',
  count: 1,
  networkConfiguration: {
    awsvpcConfiguration: {
      subnets: [],
      securityGroups: ['sg-0b1d5a16a78fb33e8'],
      assignPublicIp: 'ENABLED'
    },
  },
};

const run = async function() {
  const describeSubnetsResult = await ec2.describeSubnets({});
  taskRunParams.networkConfiguration.awsvpcConfiguration.subnets = describeSubnetsResult.Subnets.map(obj => obj.SubnetId)

  const runTaskResult = await ecs.runTask(taskRunParams);
  console.log('runTaskResult', runTaskResult);
}

run();
