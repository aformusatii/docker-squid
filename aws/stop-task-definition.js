import {ECS} from "@aws-sdk/client-ecs";
import {fromEnv} from "@aws-sdk/credential-providers";

const AWS_REGION = process.env.AWS_REGION;
const AWS_CLUSTER_NAME = process.env.AWS_CLUSTER_NAME;
const AWS_TASK_DEFINITION = process.env.AWS_TASK_DEFINITION;
const CREDENTIALS = (process.env.AWS_ACCESS_KEY_ID) ? fromEnv() : undefined;

const ecs = new ECS({
    region: AWS_REGION,
    credentials: CREDENTIALS
});

const run = async function() {
    const listTasksResult = await ecs.listTasks({
        cluster: AWS_CLUSTER_NAME,
        family: AWS_TASK_DEFINITION
    });

    for (const taskArn of listTasksResult.taskArns) {
        console.log('Try to stop task with ARN:', taskArn);

        const stopTaskResult = await ecs.stopTask({
            cluster: AWS_CLUSTER_NAME,
            task: taskArn
        })
        console.log('stopTaskResult', stopTaskResult);
    }
}

run();
