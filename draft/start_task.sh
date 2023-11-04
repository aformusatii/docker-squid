# aws ecs describe-task-definition --task-definition SQUID_HTTP_PROXY --query taskDefinition > task-definition.json
# aws ec2 describe-vpcs --region us-east-1 --query "Vpcs[0].VpcId" --output text
# $(aws ec2 describe-subnets --region us-east-1 --query "Subnets[?VpcId=='vpc-c8c88faf'].SubnetId" --output text)
cluster_name=TestClusterV1
task_family=SQUID_HTTP_PROXY_V2
security_group="sg-0b1d5a16a78fb33e8"

vpc_id=$(aws ec2 describe-vpcs --region us-east-1 --query "Vpcs[0].VpcId" --output text)
subnet_ids=$(aws ec2 describe-subnets --region us-east-1 --query "Subnets[?VpcId=='$vpc_id'].SubnetId" --output text)

subnet_ids=$(echo $subnet_ids | sed 's/ /","/g')
subnet_ids="\"$subnet_ids\""

network_config="awsvpcConfiguration={subnets=[$subnet_ids],securityGroups=[\"$security_group\"],assignPublicIp=\"ENABLED\"}"

echo $vpc_id
echo $network_config

aws ecs run-task \
    --cluster "$cluster_name" \
    --task-definition "$task_family" \
    --launch-type FARGATE \
    --count 1 \
    --network-configuration "$network_config" \
    --output text
