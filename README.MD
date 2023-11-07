[![Build and Push Docker Image to AWS](https://github.com/aformusatii/docker-squid/actions/workflows/build_and_push.yml/badge.svg)](https://github.com/aformusatii/docker-squid/actions/workflows/build_and_push.yml)

# Squid HTTP Proxy Docker Image

This repository contains a Dockerfile for building a Squid HTTP proxy image based on the Alpine Linux base image. The image can be configured using environment variables for various settings, such as Squid username, Squid password, and NOIP integration for dynamic DNS updates.

## Table of Contents

- [Environment Variables](#environment-variables)
- [GitHub Actions Workflows](#github-actions-workflows)
- [Usage](#usage)
    - [Running as a Docker Container](#running-as-a-docker-container)
    - [Docker Compose Example](#docker-compose-example)
- [Getting Started](#getting-started)
- [Contributing](#contributing)
- [License](#license)

## Environment Variables

Here are the updated environment variables that can be used to configure the Squid proxy Docker image:

| Variable Name       | Description                                             |
| ------------------- | ------------------------------------------------------- |
| SQUID_USERNAME      | Specifies the Squid username.                           |
| SQUID_PASSWORD      | Specifies the Squid password.                           |
| NO_IP_USERNAME      | Used by an internal script for updating the NOIP DNS entry. |
| NO_IP_PASSWORD      | NOIP password.                                         |
| NO_IP_HOSTNAME      | NOIP DNS entry pointing to the container's public IP.  |

## GitHub Actions Workflows

This repository includes GitHub Actions workflows for various tasks:

1. **Build and Deploy to AWS ECR**: This workflow builds the Docker image and deploys it to an AWS ECR public repository.

2. **Create Task Definition in AWS ECS**: This workflow creates an AWS ECS task definition for the Squid proxy.

3. **Start and Stop Task Definitions in AWS ECS**: Using Fargate as the runtime, this workflow starts and stops the task definitions in an AWS ECS Cluster.

## Usage

### Running as a Docker Container

You can run the Docker image as a container by specifying the required environment variables and exposing port 3128. Here's a sample command:

```bash
docker run -d \
  -e SQUID_USERNAME=myusername \
  -e SQUID_PASSWORD=mypassword \
  -e NO_IP_USERNAME=noipuser \
  -e NO_IP_PASSWORD=noippassword \
  -e NO_IP_HOSTNAME=mydnsentry \
  -p 3128:3128 \
  public.ecr.aws/f3w7h7x2/my_squid
```

Make sure to replace `myusername`, `mypassword`, `noipuser`, `noippassword`, and `mydnsentry` with your specific values.

### Docker Compose Example

To use Docker Compose, create a `docker-compose.yml` file with the following content:

```yaml
version: '3'
services:
  squid-proxy:
    image: public.ecr.aws/f3w7h7x2/my_squid
    environment:
      - SQUID_USERNAME=myusername
      - SQUID_PASSWORD=mypassword
      - NO_IP_USERNAME=noipuser
      - NO_IP_PASSWORD=noippassword
      - NO_IP_HOSTNAME=mydnsentry
    ports:
      - "3128:3128"
```

Run the Squid proxy container using:

```bash
docker-compose up -d
```

## Getting Started

To get started, follow these steps:

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/aformusatii/docker-squid.git
   ```

2. Customize the Dockerfile and GitHub Actions workflows to meet your requirements.

3. Build and deploy the Docker image using the provided GitHub Actions workflows.

4. Run the Docker container as described in the "Usage" section.

## Contributing

If you'd like to contribute to this project, feel free to open issues or submit pull requests. We welcome contributions that improve the functionality or documentation.

## License

This project is licensed under the [MIT License](LICENSE), which means you are free to use and modify the code in your projects as long as you provide proper attribution.