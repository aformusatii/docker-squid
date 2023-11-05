import {ECS} from "@aws-sdk/client-ecs";
import {fromEnv} from "@aws-sdk/credential-providers";

const AWS_REGION = process.env.AWS_REGION;
const AWS_TASK_DEFINITION = process.env.AWS_TASK_DEFINITION;
const CREDENTIALS = (process.env.AWS_ACCESS_KEY_ID) ? fromEnv() : undefined;

const ecs = new ECS({
    region: AWS_REGION,
    // https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/functions/_aws_sdk_credential_providers.fromEnv.html
    credentials: CREDENTIALS
});

const taskDefinitionParams = {
    family: AWS_TASK_DEFINITION,
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
            environment: [],
            logConfiguration: {
                logDriver: "awslogs",
                options: {
                    "awslogs-create-group": "true",
                    "awslogs-group": "/ecs/",
                    "awslogs-region": AWS_REGION,
                    "awslogs-stream-prefix": "ecs"
                }
            }
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

const addEnvironmentVar = function(key, value) {
    if ( (typeof value === 'string') && (value.trim() !== '') ) {
        taskDefinitionParams.containerDefinitions[0].environment.push({
            name: key,
            value: value
        });
    }    
}

addEnvironmentVar("SQUID_USERNAME", process.env.SQUID_USERNAME);
addEnvironmentVar("SQUID_PASSWORD", process.env.SQUID_PASSWORD);
addEnvironmentVar("CLOUDFLARE_DNS", process.env.CLOUDFLARE_DNS);
addEnvironmentVar("CLOUDFLARE_API_KEY", process.env.CLOUDFLARE_API_KEY);

addEnvironmentVar("NO_IP_USERNAME", process.env.NO_IP_USERNAME);
addEnvironmentVar("NO_IP_PASSWORD", process.env.NO_IP_PASSWORD);
addEnvironmentVar("NO_IP_HOSTNAME", process.env.NO_IP_HOSTNAME);

const run = async function() {
    try {
        const result = await ecs.registerTaskDefinition(taskDefinitionParams);
        console.log('Task definition created:', result.taskDefinition.family);
    } catch (exception) {
        console.error('Error creating task definition:', exception);
    }
}

run();
