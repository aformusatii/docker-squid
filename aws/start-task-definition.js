import {EC2} from "@aws-sdk/client-ec2";
import {ECS} from "@aws-sdk/client-ecs";

// Create an EC2 client
const ec2 = new EC2({
  // Replace with your desired AWS region
  region: 'us-east-1'
});

const ecs = new ECS({
  region: 'us-east-1'
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
    },
  },
};

const test = async function() {
  const describeResult = await ec2.describeSubnets({});
  //console.log('result2', result2.Subnets.map(obj => obj.SubnetId).join(','));

  taskRunParams.networkConfiguration.awsvpcConfiguration.subnets = describeResult.Subnets.map(obj => obj.SubnetId)
  //console.log('taskRunParams', taskRunParams.networkConfiguration.awsvpcConfiguration.subnets);

  const runTaskResult = await ecs.runTask(taskRunParams);
  console.log('runTaskResult', runTaskResult);
}

test();

