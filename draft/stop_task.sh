cluster_name=TestClusterV1
task_family=SQUID_HTTP_PROXY

first_task_arn=$(aws ecs list-tasks --cluster "$cluster_name" --family "$task_family" --query "taskArns[0]" --output text)
echo $first_task_arn

aws ecs stop-task --cluster "$cluster_name" --task "$first_task_arn" --output text