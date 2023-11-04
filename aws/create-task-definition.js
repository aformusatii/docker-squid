const AWS = require('aws-sdk');

// Configure AWS SDK with credentials and region
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const ecs = new AWS.ECS();

const taskDefinitionParams = {
    family: "SQUID_HTTP_PROXY_V2",
    containerDefinitions: [
        {
            name: "my_squid",
            image: "public.ecr.aws/f3w7h7x2/my_squid:latest",
            cpu: 512,
            memory: 1024,
            memoryReservation: 1024,
            portMappings: [
                {
                    containerPort: 3128,
                    hostPort: 3128,
                    protocol: "tcp",
                    name: "my_squid-3128-tcp"
                },
                {
                    containerPort: 3129,
                    hostPort: 3129,
                    protocol: "tcp",
                    name: "my_squid-3129-tcp"
                }
            ],
            essential: true,
            environment: []
        }
    ],
    taskRoleArn: "arn:aws:iam::278447177517:role/ecsTaskExecutionRole",
    executionRoleArn: "arn:aws:iam::278447177517:role/ecsTaskExecutionRole",
    networkMode: "awsvpc",
    runtimePlatform: {
        cpuArchitecture: "X86_64",
        operatingSystemFamily: "LINUX"
    },
    requiresCompatibilities: [
        "FARGATE"
    ],
    cpu: "512",
    memory: "1024"
};

ecs.registerTaskDefinition(taskDefinitionParams, (err, data) => {
  if (err) {
    console.error('Error creating task definition:', err);
    process.exit(1);
  } else {
    console.log('Task definition created:', data.taskDefinition.family);
  }
});
