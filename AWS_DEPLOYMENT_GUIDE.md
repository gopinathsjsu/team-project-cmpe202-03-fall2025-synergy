# AWS Deployment Guide - Campus Marketplace

This guide provides step-by-step instructions for deploying the Campus Marketplace application to AWS.

## Architecture Overview

```
Internet
   ↓
CloudFront (CDN)
   ↓
Application Load Balancer (ALB)
   ↓
┌─────────────────────────────────────┐
│  ECS Fargate Cluster                │
│  ┌──────────┐  ┌──────────┐        │
│  │ Frontend │  │ Backend  │        │
│  │ Container│  │ Container│        │
│  └──────────┘  └──────────┘        │
│  ┌──────────┐                      │
│  │Embeddings│                      │
│  │ Container│                      │
│  └──────────┘                      │
└─────────────────────────────────────┘
   ↓                    ↓
RDS PostgreSQL    ElastiCache Redis
   ↓
S3 (for file uploads)
```

## Prerequisites

- AWS Account with appropriate permissions
- AWS CLI installed and configured
- Docker installed locally
- Domain name (optional but recommended)
- GitHub repository (for CI/CD)

## Step 1: Prepare AWS Resources

### 1.1 Create RDS PostgreSQL Database (if not already done)

You already have an RDS instance. Verify it's configured correctly:

```bash
# Check RDS instance
aws rds describe-db-instances --db-instance-identifier database-1
```

**Important Settings:**
- Multi-AZ: Enabled (for production)
- Public accessibility: Based on your security needs
- VPC: Use a dedicated VPC for production
- Security Groups: Allow inbound from ECS security group only

### 1.2 Create ElastiCache Redis Cluster

```bash
# Create Redis subnet group
aws elasticache create-cache-subnet-group \
  --cache-subnet-group-name campus-marketplace-redis-subnet \
  --cache-subnet-group-description "Redis subnet group for campus marketplace" \
  --subnet-ids subnet-xxx subnet-yyy

# Create Redis cluster
aws elasticache create-cache-cluster \
  --cache-cluster-id campus-marketplace-redis \
  --cache-node-type cache.t3.micro \
  --engine redis \
  --num-cache-nodes 1 \
  --cache-subnet-group-name campus-marketplace-redis-subnet \
  --security-group-ids sg-xxx
```

### 1.3 Create S3 Bucket for File Storage

```bash
# Create S3 bucket
aws s3 mb s3://campus-marketplace-uploads-$(date +%s) --region us-east-1

# Enable versioning
aws s3api put-bucket-versioning \
  --bucket campus-marketplace-uploads-xxx \
  --versioning-configuration Status=Enabled

# Configure CORS (if needed for direct uploads)
aws s3api put-bucket-cors --bucket campus-marketplace-uploads-xxx --cors-configuration file://cors.json
```

**cors.json:**
```json
{
  "CORSRules": [
    {
      "AllowedOrigins": ["https://yourdomain.com"],
      "AllowedMethods": ["GET", "PUT", "POST", "DELETE"],
      "AllowedHeaders": ["*"],
      "MaxAgeSeconds": 3000
    }
  ]
}
```

## Step 2: Create VPC and Networking

### 2.1 Create VPC with Public and Private Subnets

```bash
# Create VPC
aws ec2 create-vpc --cidr-block 10.0.0.0/16 --tag-specifications 'ResourceType=vpc,Tags=[{Key=Name,Value=campus-marketplace-vpc}]'

# Create Internet Gateway
aws ec2 create-internet-gateway --tag-specifications 'ResourceType=internet-gateway,Tags=[{Key=Name,Value=campus-marketplace-igw}]'

# Attach Internet Gateway to VPC
aws ec2 attach-internet-gateway --internet-gateway-id igw-xxx --vpc-id vpc-xxx

# Create Public Subnets (for ALB)
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.1.0/24 --availability-zone us-east-1a
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.2.0/24 --availability-zone us-east-1b

# Create Private Subnets (for ECS tasks)
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.3.0/24 --availability-zone us-east-1a
aws ec2 create-subnet --vpc-id vpc-xxx --cidr-block 10.0.4.0/24 --availability-zone us-east-1b

# Create NAT Gateway (for private subnet internet access)
aws ec2 allocate-address --domain vpc
aws ec2 create-nat-gateway --subnet-id subnet-public-xxx --allocation-id eipalloc-xxx
```

### 2.2 Create Security Groups

```bash
# ALB Security Group
aws ec2 create-security-group \
  --group-name campus-marketplace-alb-sg \
  --description "Security group for ALB" \
  --vpc-id vpc-xxx

# Allow HTTP/HTTPS from internet
aws ec2 authorize-security-group-ingress \
  --group-id sg-alb-xxx \
  --protocol tcp --port 80 --cidr 0.0.0.0/0
aws ec2 authorize-security-group-ingress \
  --group-id sg-alb-xxx \
  --protocol tcp --port 443 --cidr 0.0.0.0/0

# ECS Security Group
aws ec2 create-security-group \
  --group-name campus-marketplace-ecs-sg \
  --description "Security group for ECS tasks" \
  --vpc-id vpc-xxx

# Allow traffic from ALB only
aws ec2 authorize-security-group-ingress \
  --group-id sg-ecs-xxx \
  --protocol tcp --port 8080 --source-group sg-alb-xxx
aws ec2 authorize-security-group-ingress \
  --group-id sg-ecs-xxx \
  --protocol tcp --port 3000 --source-group sg-alb-xxx
aws ec2 authorize-security-group-ingress \
  --group-id sg-ecs-xxx \
  --protocol tcp --port 8001 --source-group sg-alb-xxx

# RDS Security Group
aws ec2 authorize-security-group-ingress \
  --group-id sg-rds-xxx \
  --protocol tcp --port 5432 --source-group sg-ecs-xxx

# Redis Security Group
aws ec2 authorize-security-group-ingress \
  --group-id sg-redis-xxx \
  --protocol tcp --port 6379 --source-group sg-ecs-xxx
```

## Step 3: Create ECR Repositories

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com

# Create repositories
aws ecr create-repository --repository-name campus-marketplace-backend --region us-east-1
aws ecr create-repository --repository-name campus-marketplace-frontend --region us-east-1
aws ecr create-repository --repository-name campus-marketplace-embeddings --region us-east-1
```

## Step 4: Build and Push Docker Images

### 4.1 Build and Push Backend

```bash
cd backend
docker build -t campus-marketplace-backend .
docker tag campus-marketplace-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/campus-marketplace-backend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/campus-marketplace-backend:latest
```

### 4.2 Build and Push Frontend

```bash
cd frontend
docker build -t campus-marketplace-frontend .
docker tag campus-marketplace-frontend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/campus-marketplace-frontend:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/campus-marketplace-frontend:latest
```

### 4.3 Build and Push Embeddings Service

```bash
cd embeddings-service
docker build -t campus-marketplace-embeddings .
docker tag campus-marketplace-embeddings:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/campus-marketplace-embeddings:latest
docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/campus-marketplace-embeddings:latest
```

## Step 5: Create ECS Cluster and Services

### 5.1 Create ECS Cluster

```bash
aws ecs create-cluster --cluster-name campus-marketplace-cluster
```

### 5.2 Create Task Definitions

Create `backend-task-definition.json`:

```json
{
  "family": "campus-marketplace-backend",
  "networkMode": "awsvpc",
  "requiresCompatibilities": ["FARGATE"],
  "cpu": "512",
  "memory": "1024",
  "executionRoleArn": "arn:aws:iam::<account-id>:role/ecsTaskExecutionRole",
  "taskRoleArn": "arn:aws:iam::<account-id>:role/ecsTaskRole",
  "containerDefinitions": [
    {
      "name": "backend",
      "image": "<account-id>.dkr.ecr.us-east-1.amazonaws.com/campus-marketplace-backend:latest",
      "portMappings": [
        {
          "containerPort": 8080,
          "protocol": "tcp"
        }
      ],
      "environment": [
        {
          "name": "SPRING_PROFILES_ACTIVE",
          "value": "production"
        },
        {
          "name": "SPRING_DATASOURCE_URL",
          "value": "jdbc:postgresql://database-1.cs3oc0aoqhwx.us-east-1.rds.amazonaws.com:5432/campus_marketplace"
        },
        {
          "name": "EMBEDDINGS_SERVICE__URL",
          "value": "http://embeddings:8001"
        }
      ],
      "secrets": [
        {
          "name": "SPRING_DATASOURCE_USERNAME",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:<account-id>:secret:rds/credentials:username::"
        },
        {
          "name": "SPRING_DATASOURCE_PASSWORD",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:<account-id>:secret:rds/credentials:password::"
        },
        {
          "name": "JWT_SECRET",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:<account-id>:secret:app/jwt-secret::"
        },
        {
          "name": "AWS_ACCESS_KEY_ID",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:<account-id>:secret:aws/credentials:access-key-id::"
        },
        {
          "name": "AWS_SECRET_ACCESS_KEY",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:<account-id>:secret:aws/credentials:secret-access-key::"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/campus-marketplace-backend",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "ecs"
        }
      },
      "healthCheck": {
        "command": ["CMD-SHELL", "curl -f http://localhost:8080/api/health || exit 1"],
        "interval": 30,
        "timeout": 5,
        "retries": 3
      }
    }
  ]
}
```

Register task definitions:

```bash
aws ecs register-task-definition --cli-input-json file://backend-task-definition.json
aws ecs register-task-definition --cli-input-json file://frontend-task-definition.json
aws ecs register-task-definition --cli-input-json file://embeddings-task-definition.json
```

### 5.3 Create CloudWatch Log Groups

```bash
aws logs create-log-group --log-group-name /ecs/campus-marketplace-backend
aws logs create-log-group --log-group-name /ecs/campus-marketplace-frontend
aws logs create-log-group --log-group-name /ecs/campus-marketplace-embeddings
```

### 5.4 Create Application Load Balancer

```bash
aws elbv2 create-load-balancer \
  --name campus-marketplace-alb \
  --subnets subnet-public-1 subnet-public-2 \
  --security-groups sg-alb-xxx \
  --scheme internet-facing \
  --type application

# Create target groups
aws elbv2 create-target-group \
  --name campus-marketplace-backend-tg \
  --protocol HTTP \
  --port 8080 \
  --vpc-id vpc-xxx \
  --target-type ip \
  --health-check-path /api/health

aws elbv2 create-target-group \
  --name campus-marketplace-frontend-tg \
  --protocol HTTP \
  --port 3000 \
  --vpc-id vpc-xxx \
  --target-type ip \
  --health-check-path /

# Create listener rules
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:us-east-1:<account-id>:loadbalancer/app/campus-marketplace-alb/xxx \
  --protocol HTTP \
  --port 80 \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:us-east-1:<account-id>:targetgroup/campus-marketplace-frontend-tg/xxx
```

### 5.5 Create ECS Services

```bash
# Backend service
aws ecs create-service \
  --cluster campus-marketplace-cluster \
  --service-name backend-service \
  --task-definition campus-marketplace-backend \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-private-1,subnet-private-2],securityGroups=[sg-ecs-xxx],assignPublicIp=DISABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:<account-id>:targetgroup/campus-marketplace-backend-tg/xxx,containerName=backend,containerPort=8080"

# Frontend service
aws ecs create-service \
  --cluster campus-marketplace-cluster \
  --service-name frontend-service \
  --task-definition campus-marketplace-frontend \
  --desired-count 2 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-private-1,subnet-private-2],securityGroups=[sg-ecs-xxx],assignPublicIp=DISABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:us-east-1:<account-id>:targetgroup/campus-marketplace-frontend-tg/xxx,containerName=frontend,containerPort=3000"

# Embeddings service
aws ecs create-service \
  --cluster campus-marketplace-cluster \
  --service-name embeddings-service \
  --task-definition campus-marketplace-embeddings \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-private-1,subnet-private-2],securityGroups=[sg-ecs-xxx],assignPublicIp=DISABLED}"
```

## Step 6: Configure AWS Secrets Manager

```bash
# Store RDS credentials
aws secretsmanager create-secret \
  --name rds/credentials \
  --secret-string '{"username":"postgres","password":"your-secure-password"}'

# Store JWT secret
aws secretsmanager create-secret \
  --name app/jwt-secret \
  --secret-string "your-256-bit-secret-key-for-jwt-token-generation-must-be-at-least-32-characters-long"

# Store AWS credentials
aws secretsmanager create-secret \
  --name aws/credentials \
  --secret-string '{"access-key-id":"AKIA...","secret-access-key":"..."}'
```

## Step 7: Set Up CloudFront (CDN)

```bash
# Create CloudFront distribution
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

**cloudfront-config.json:**
```json
{
  "CallerReference": "campus-marketplace-$(date +%s)",
  "Comment": "Campus Marketplace CDN",
  "DefaultCacheBehavior": {
    "TargetOriginId": "ALB-Origin",
    "ViewerProtocolPolicy": "redirect-to-https",
    "AllowedMethods": {
      "Quantity": 7,
      "Items": ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"],
      "CachedMethods": {
        "Quantity": 2,
        "Items": ["GET", "HEAD"]
      }
    },
    "ForwardedValues": {
      "QueryString": true,
      "Cookies": {
        "Forward": "all"
      },
      "Headers": {
        "Quantity": 1,
        "Items": ["*"]
      }
    },
    "MinTTL": 0,
    "DefaultTTL": 86400,
    "MaxTTL": 31536000,
    "Compress": true
  },
  "Origins": {
    "Quantity": 1,
    "Items": [
      {
        "Id": "ALB-Origin",
        "DomainName": "campus-marketplace-alb-xxx.us-east-1.elb.amazonaws.com",
        "CustomOriginConfig": {
          "HTTPPort": 80,
          "HTTPSPort": 443,
          "OriginProtocolPolicy": "http-only"
        }
      }
    ]
  },
  "Enabled": true,
  "PriceClass": "PriceClass_100"
}
```

## Step 8: Set Up SSL Certificate (ACM)

```bash
# Request certificate
aws acm request-certificate \
  --domain-name yourdomain.com \
  --subject-alternative-names "*.yourdomain.com" \
  --validation-method DNS \
  --region us-east-1

# Add DNS validation records to your domain
# Then update ALB listener to use HTTPS
aws elbv2 create-listener \
  --load-balancer-arn arn:aws:elasticloadbalancing:us-east-1:<account-id>:loadbalancer/app/campus-marketplace-alb/xxx \
  --protocol HTTPS \
  --port 443 \
  --certificates CertificateArn=arn:aws:acm:us-east-1:<account-id>:certificate/xxx \
  --default-actions Type=forward,TargetGroupArn=arn:aws:elasticloadbalancing:us-east-1:<account-id>:targetgroup/campus-marketplace-frontend-tg/xxx
```

## Step 9: Create IAM Roles

### 9.1 ECS Task Execution Role

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "secretsmanager:GetSecretValue"
      ],
      "Resource": "*"
    }
  ]
}
```

### 9.2 ECS Task Role (for S3 access)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:PutObject",
        "s3:DeleteObject"
      ],
      "Resource": "arn:aws:s3:::campus-marketplace-uploads-*/*"
    }
  ]
}
```

## Step 10: Update Application Configuration

### 10.1 Update Backend application.yml

Create `application-production.yml`:

```yaml
spring:
  datasource:
    url: ${SPRING_DATASOURCE_URL}
    username: ${SPRING_DATASOURCE_USERNAME}
    password: ${SPRING_DATASOURCE_PASSWORD}
  
  redis:
    host: ${SPRING_REDIS_HOST}
    port: ${SPRING_REDIS_PORT}

server:
  port: 8080
  servlet:
    context-path: /api

logging:
  level:
    root: INFO
    com.example.app: INFO

embeddings:
  service:
    url: ${EMBEDDINGS_SERVICE__URL}
```

### 10.2 Update Frontend Environment Variables

Create `.env.production`:

```env
VITE_API_URL=https://api.yourdomain.com/api
VITE_WS_URL=wss://api.yourdomain.com/ws
```

## Step 11: Set Up CI/CD Pipeline

### 11.1 GitHub Actions Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS

on:
  push:
    branches: [main]

env:
  AWS_REGION: us-east-1
  ECR_REGISTRY: <account-id>.dkr.ecr.us-east-1.amazonaws.com
  ECS_CLUSTER: campus-marketplace-cluster

jobs:
  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}
      
      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v1
      
      - name: Build and push backend image
        env:
          ECR_REPOSITORY: campus-marketplace-backend
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:latest ./backend
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest
      
      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster $ECS_CLUSTER \
            --service backend-service \
            --force-new-deployment

  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ env.AWS_REGION }}
      
      - name: Login to Amazon ECR
        uses: aws-actions/amazon-ecr-login@v1
      
      - name: Build and push frontend image
        env:
          ECR_REPOSITORY: campus-marketplace-frontend
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:latest ./frontend
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest
      
      - name: Deploy to ECS
        run: |
          aws ecs update-service \
            --cluster $ECS_CLUSTER \
            --service frontend-service \
            --force-new-deployment
```

## Step 12: Database Migrations

Run database migrations before deploying:

```bash
# Connect to RDS and run migrations
psql -h database-1.cs3oc0aoqhwx.us-east-1.rds.amazonaws.com -U postgres -d campus_marketplace -f database/init.sql
psql -h database-1.cs3oc0aoqhwx.us-east-1.rds.amazonaws.com -U postgres -d campus_marketplace -f database/migrate_semantic_search.sql
```

## Step 13: Monitoring and Logging

### 13.1 Set Up CloudWatch Alarms

```bash
# High CPU alarm
aws cloudwatch put-metric-alarm \
  --alarm-name campus-marketplace-high-cpu \
  --alarm-description "Alert when CPU exceeds 80%" \
  --metric-name CPUUtilization \
  --namespace AWS/ECS \
  --statistic Average \
  --period 300 \
  --threshold 80 \
  --comparison-operator GreaterThanThreshold \
  --evaluation-periods 2
```

### 13.2 Enable Container Insights

```bash
aws ecs update-cluster-settings \
  --cluster campus-marketplace-cluster \
  --settings name=containerInsights,value=enabled
```

## Step 14: Cost Optimization

1. **Use Fargate Spot** for non-critical services (embeddings service)
2. **Enable Auto Scaling** based on CPU/memory
3. **Use S3 Intelligent-Tiering** for file storage
4. **Set up CloudWatch billing alarms**
5. **Use Reserved Instances** for RDS (if predictable workload)

## Step 15: Security Best Practices

1. ✅ Use Secrets Manager for sensitive data
2. ✅ Enable VPC Flow Logs
3. ✅ Use WAF (Web Application Firewall) on ALB
4. ✅ Enable AWS GuardDuty
5. ✅ Regular security audits
6. ✅ Enable MFA for AWS accounts
7. ✅ Use least privilege IAM policies

## Troubleshooting

### Check ECS Service Status
```bash
aws ecs describe-services --cluster campus-marketplace-cluster --services backend-service
```

### View Logs
```bash
aws logs tail /ecs/campus-marketplace-backend --follow
```

### Check ALB Target Health
```bash
aws elbv2 describe-target-health --target-group-arn <target-group-arn>
```

## Next Steps

1. Set up domain name and Route 53
2. Configure auto-scaling policies
3. Set up backup strategies for RDS
4. Implement blue/green deployments
5. Add monitoring dashboards
6. Set up disaster recovery plan

## Estimated Monthly Costs (US-East-1)

- ECS Fargate (3 services, 2 tasks each): ~$50-100
- RDS PostgreSQL (db.t3.medium): ~$70-100
- ElastiCache Redis: ~$15-30
- ALB: ~$20-30
- CloudFront: ~$5-20 (depending on traffic)
- S3: ~$5-10 (depending on storage)
- **Total: ~$165-290/month**

---

**Note:** Replace all placeholder values (account-id, subnet-ids, security-group-ids, etc.) with your actual AWS resource identifiers.

