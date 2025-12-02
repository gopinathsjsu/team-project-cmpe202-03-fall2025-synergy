# AWS Console Deployment Guide - Step by Step

This guide walks you through deploying your Campus Marketplace application using AWS Console (no CLI required).

## Architecture Overview 

```
Internet → CloudFront (Optional) → Application Load Balancer → ECS Cluster (EC2) → RDS + Redis
```

**Cost-Effective Setup for Student Account:**
- ECS with EC2 launch type (cheaper than Fargate)
- t3.micro/t3.small EC2 instances (free tier eligible)
- Auto-scaling to save costs
- Single-AZ RDS (can use free tier db.t2.micro)

## Prerequisites

- AWS Account with $120 credits
- Domain name (optional - can use ALB DNS name)
- Docker images ready

---

## Part 1: VPC and Networking Setup

### Step 1.1: Create VPC

1. Go to **VPC Dashboard** → Click **Create VPC**
2. Settings:
   - **Name tag**: `campus-marketplace-vpc`
   - **IPv4 CIDR block**: `10.0.0.0/16`
   - **Tenancy**: Default
   - Click **Create VPC**

### Step 1.2: Create Internet Gateway

1. In VPC Dashboard → **Internet Gateways** → **Create internet gateway**
2. Name: `campus-marketplace-igw`
3. Click **Create internet gateway**
4. Select the IGW → **Actions** → **Attach to VPC**
5. Select your VPC → **Attach internet gateway**

### Step 1.3: Create Subnets

**Public Subnets (for Load Balancer):**

1. **Subnets** → **Create subnet**
   - **VPC**: Select your VPC
   - **Subnet name**: `public-subnet-1a`
   - **Availability Zone**: `us-east-1a`
   - **IPv4 CIDR block**: `10.0.1.0/24`
   - Click **Create subnet**

2. Repeat for second public subnet:
   - **Subnet name**: `public-subnet-1b`
   - **Availability Zone**: `us-east-1b`
   - **IPv4 CIDR block**: `10.0.2.0/24`

**Private Subnets (for ECS tasks):**

1. Create private subnet 1:
   - **Subnet name**: `private-subnet-1a`
   - **Availability Zone**: `us-east-1a`
   - **IPv4 CIDR block**: `10.0.3.0/24`

2. Create private subnet 2:
   - **Subnet name**: `private-subnet-1b`
   - **Availability Zone**: `us-east-1b`
   - **IPv4 CIDR block**: `10.0.4.0/24`

### Step 1.4: Create Route Tables

**Public Route Table:**

1. **Route Tables** → **Create route table**
   - **Name**: `public-route-table`
   - **VPC**: Select your VPC
   - Click **Create route table**

2. Select the route table → **Routes** tab → **Edit routes** → **Add route**
   - **Destination**: `0.0.0.0/0`
   - **Target**: Select your Internet Gateway
   - Click **Save changes**

3. **Subnet associations** tab → **Edit subnet associations**
   - Select both public subnets → **Save associations**

**Private Route Table:**

1. Create route table: `private-route-table`
2. Associate with both private subnets
3. (NAT Gateway not needed if using public IP for ECS tasks)

### Step 1.5: Create Security Groups

**ALB Security Group:**

1. **Security Groups** → **Create security group**
   - **Name**: `campus-marketplace-alb-sg`
   - **Description**: Security group for Application Load Balancer
   - **VPC**: Select your VPC
   - **Inbound rules**:
     - Type: HTTP, Port: 80, Source: 0.0.0.0/0
     - Type: HTTPS, Port: 443, Source: 0.0.0.0/0
   - Click **Create security group**

**ECS Security Group:**

1. **Create security group**
   - **Name**: `campus-marketplace-ecs-sg`
   - **Description**: Security group for ECS tasks
   - **VPC**: Select your VPC
   - **Inbound rules**:
     - Type: Custom TCP, Port: 8080, Source: ALB security group
     - Type: Custom TCP, Port: 3000, Source: ALB security group
     - Type: Custom TCP, Port: 8001, Source: ALB security group
   - Click **Create security group**

**RDS Security Group:**

1. **Create security group**
   - **Name**: `campus-marketplace-rds-sg`
   - **Description**: Security group for RDS
   - **VPC**: Select your VPC
   - **Inbound rules**:
     - Type: PostgreSQL, Port: 5432, Source: ECS security group
   - Click **Create security group**

---

## Part 2: RDS Database Setup

### Step 2.1: Create RDS PostgreSQL Instance

1. Go to **RDS Dashboard** → **Create database**

2. **Database creation method**: Standard create

3. **Engine options**:
   - **Engine type**: PostgreSQL
   - **Version**: 15.x (or latest)

4. **Templates**: 
   - For student account: **Free tier** (if available)
   - Or **Production** → **db.t3.micro** (cheapest paid option)

5. **Settings**:
   - **DB instance identifier**: `campus-marketplace-db`
   - **Master username**: `postgres`
   - **Master password**: Create a strong password (save it!)

6. **Instance configuration**:
   - **DB instance class**: `db.t3.micro` (free tier) or `db.t3.small`

7. **Storage**:
   - **Storage type**: General Purpose SSD (gp3)
   - **Allocated storage**: 20 GB (free tier) or 20 GB minimum

8. **Connectivity**:
   - **VPC**: Select your VPC
   - **Subnet group**: Create new DB subnet group
     - Name: `campus-marketplace-db-subnet-group`
     - Select both private subnets
   - **Public access**: **No** (more secure)
   - **VPC security group**: Choose existing → Select `campus-marketplace-rds-sg`
   - **Availability Zone**: No preference

9. **Database authentication**: Password authentication

10. **Additional configuration**:
    - **Initial database name**: `campus_marketplace`
    - **Backup retention**: 7 days (or 0 for free tier)
    - **Enable encryption**: Yes (recommended)

11. Click **Create database**

12. **Wait 5-10 minutes** for database to be available

13. Note the **Endpoint** (e.g., `campus-marketplace-db.xxxxx.us-east-1.rds.amazonaws.com`)

---

## Part 3: ElastiCache Redis Setup (Optional but Recommended)

### Step 3.1: Create ElastiCache Subnet Group

1. **ElastiCache Dashboard** → **Subnet groups** → **Create subnet group**
   - **Name**: `campus-marketplace-redis-subnet`
   - **Description**: Redis subnet group
   - **VPC**: Select your VPC
   - **Subnets**: Select both private subnets
   - Click **Create**

### Step 3.2: Create Redis Cluster

1. **ElastiCache Dashboard** → **Redis clusters** → **Create Redis cluster**

2. **Cluster settings**:
   - **Name**: `campus-marketplace-redis`
   - **Description**: Redis for session management

3. **Location**:
   - **Cluster mode**: Disabled
   - **Network settings**:
     - **VPC**: Select your VPC
     - **Subnet group**: Select the subnet group you created
     - **Availability Zone(s)**: No preference

4. **Cluster settings**:
   - **Node type**: `cache.t3.micro` (free tier eligible) or `cache.t3.small`
   - **Number of replicas**: 0 (for cost savings)

5. **Security**:
   - **Security groups**: Create new or select existing
     - Allow port 6379 from ECS security group

6. Click **Create**

---

## Part 4: S3 Bucket for File Storage

### Step 4.1: Create S3 Bucket

1. **S3 Dashboard** → **Create bucket**

2. **General configuration**:
   - **Bucket name**: `campus-marketplace-uploads-<your-name>` (must be globally unique)
   - **AWS Region**: `us-east-1`

3. **Object Ownership**: ACLs disabled (recommended)

4. **Block Public Access settings**: 
   - Uncheck "Block all public access" if you need public file access
   - Or keep it blocked and use presigned URLs

5. **Bucket Versioning**: Enable (optional)

6. **Default encryption**: Enable (SSE-S3)

7. Click **Create bucket**

---

## Part 5: ECR - Container Registry

### Step 5.1: Create ECR Repositories

1. **ECR Dashboard** → **Repositories** → **Create repository**

2. **Repository 1 - Backend**:
   - **Visibility settings**: Private
   - **Repository name**: `campus-marketplace-backend`
   - **Tag immutability**: Disabled (for now)
   - **Scan on push**: Enable (optional, costs extra)
   - Click **Create repository**

3. Repeat for:
   - `campus-marketplace-frontend`
   - `campus-marketplace-embeddings`

### Step 5.2: Push Docker Images

**For each repository:**

1. Click on the repository name
2. Click **View push commands**
3. Follow the commands shown (you'll need AWS CLI installed locally):
   ```bash
   # Login to ECR
   aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin <account-id>.dkr.ecr.us-east-1.amazonaws.com
   
   # Build and push
   docker build -t campus-marketplace-backend .
   docker tag campus-marketplace-backend:latest <account-id>.dkr.ecr.us-east-1.amazonaws.com/campus-marketplace-backend:latest
   docker push <account-id>.dkr.ecr.us-east-1.amazonaws.com/campus-marketplace-backend:latest
   ```

---

## Part 6: IAM Roles for ECS

### Step 6.1: Create ECS Task Execution Role

1. **IAM Dashboard** → **Roles** → **Create role**

2. **Trusted entity type**: AWS service
3. **Use case**: Elastic Container Service → Elastic Container Service Task
4. Click **Next**

5. **Permissions**: 
   - Search and select: `AmazonECSTaskExecutionRolePolicy`
   - Also add: `SecretsManagerReadWrite` (if using Secrets Manager)
   - Click **Next**

6. **Role name**: `ecsTaskExecutionRole`
7. Click **Create role**

### Step 6.2: Create ECS Task Role (for S3 access)

1. **Create role** → AWS service → ECS → ECS Task
2. **Permissions**: Create inline policy:
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
3. **Role name**: `ecsTaskRole`
4. Click **Create role**

### Step 6.3: Create ECS Instance Role (for EC2 launch type)

1. **Create role** → AWS service → EC2
2. **Permissions**: Attach `AmazonEC2ContainerServiceforEC2Role`
3. **Role name**: `ecsInstanceRole`
4. Click **Create role**

---

## Part 7: ECS Cluster Setup

### Step 7.1: Create ECS Cluster

1. **ECS Dashboard** → **Clusters** → **Create cluster**

2. **Cluster configuration**:
   - **Cluster name**: `campus-marketplace-cluster`
   - **Infrastructure**: 
     - **AWS Fargate (serverless)**: Unchecked (we'll use EC2)
     - **Amazon EC2 instances**: Checked

3. **EC2 instance configuration**:
   - **EC2 instance type**: `t3.micro` (free tier) or `t3.small`
   - **Number of instances**: 2 (for high availability)
   - **EC2 AMI ID**: Leave default (ECS-optimized AMI)
   - **Key pair**: Create new or select existing (for SSH access)
   - **VPC**: Select your VPC
   - **Subnets**: Select both private subnets
   - **Security group**: Select `campus-marketplace-ecs-sg`
   - **Container instance IAM role**: Select `ecsInstanceRole`
   - **User data** (optional): Leave default

4. **CloudWatch Container Insights**: Enable (optional, for monitoring)

5. Click **Create**

6. Wait for cluster to be created and EC2 instances to register

---

## Part 8: Create Task Definitions

### Step 8.1: Backend Task Definition

1. **ECS Dashboard** → **Task definitions** → **Create new task definition**

2. **Task definition family**: `campus-marketplace-backend`

3. **Launch type**: EC2

4. **Task size**:
   - **Task memory (GB)**: 512
   - **Task CPU (unit)**: 256 (0.25 vCPU)

5. **Container definitions** → **Add container**:

   **Container 1 - Backend:**
   - **Container name**: `backend`
   - **Image URI**: `<account-id>.dkr.ecr.us-east-1.amazonaws.com/campus-marketplace-backend:latest`
   - **Memory limits (MiB)**: 512 (Hard limit)
   - **Port mappings**:
     - **Container port**: 8080
     - **Protocol**: tcp
   
   **Environment variables**:
   - `SPRING_PROFILES_ACTIVE` = `production`
   - `SPRING_DATASOURCE_URL` = `jdbc:postgresql://<your-rds-endpoint>:5432/campus_marketplace`
   - `SPRING_DATASOURCE_USERNAME` = `postgres`
   - `SPRING_DATASOURCE_PASSWORD` = `<your-rds-password>`
   - `JWT_SECRET` = `<your-jwt-secret>`
   - `EMBEDDINGS_SERVICE__URL` = `http://embeddings:8001`
   - `SPRING_REDIS_HOST` = `<your-redis-endpoint>`
   - `SPRING_REDIS_PORT` = `6379`
   - `AWS_ACCESS_KEY_ID` = `<your-access-key>`
   - `AWS_SECRET_ACCESS_KEY` = `<your-secret-key>`
   - `AWS_REGION` = `us-east-1`
   - `AWS_S3_BUCKET` = `campus-marketplace-uploads-<your-name>`

   **Logging**:
   - **Log driver**: awslogs
   - **Log group**: `/ecs/campus-marketplace-backend` (create if needed)
   - **Log stream prefix**: `ecs`

   Click **Add**

6. Click **Create**

### Step 8.2: Frontend Task Definition

1. **Create new task definition** → `campus-marketplace-frontend`

2. **Launch type**: EC2
3. **Task memory**: 256
4. **Task CPU**: 128

5. **Add container**:
   - **Container name**: `frontend`
   - **Image URI**: `<account-id>.dkr.ecr.us-east-1.amazonaws.com/campus-marketplace-frontend:latest`
   - **Memory**: 256
   - **Port mappings**: 3000
   
   **Environment variables**:
   - `VITE_API_URL` = `http://<alb-dns-name>/api` (we'll update after ALB is created)
   - `VITE_WS_URL` = `ws://<alb-dns-name>/ws`

6. Click **Create**

### Step 8.3: Embeddings Task Definition

1. **Create new task definition** → `campus-marketplace-embeddings`
2. **Launch type**: EC2
3. **Task memory**: 1024 (embeddings need more memory)
4. **Task CPU**: 512
5. **Add container**:
   - **Container name**: `embeddings`
   - **Image URI**: `<account-id>.dkr.ecr.us-east-1.amazonaws.com/campus-marketplace-embeddings:latest`
   - **Memory**: 1024
   - **Port mappings**: 8001

6. Click **Create**

---

## Part 9: Application Load Balancer

### Step 9.1: Create Load Balancer

1. **EC2 Dashboard** → **Load Balancers** → **Create Load Balancer**

2. **Load balancer types**: Application Load Balancer

3. **Basic configuration**:
   - **Name**: `campus-marketplace-alb`
   - **Scheme**: Internet-facing
   - **IP address type**: IPv4

4. **Network mapping**:
   - **VPC**: Select your VPC
   - **Mappings**: Select both public subnets in different AZs

5. **Security groups**: Select `campus-marketplace-alb-sg`

6. **Listeners and routing**:
   - **Protocol**: HTTP, **Port**: 80
   - **Default action**: Create new target group
     - **Target group name**: `campus-marketplace-frontend-tg`
     - **Target type**: IP addresses
     - **Protocol**: HTTP, **Port**: 3000
     - **Health check**: 
       - **Path**: `/`
       - **Healthy threshold**: 2
       - **Unhealthy threshold**: 2
       - **Timeout**: 5
       - **Interval**: 30

7. Click **Create load balancer**

8. **Wait 2-3 minutes** for ALB to be active

9. **Note the DNS name** (e.g., `campus-marketplace-alb-xxxxx.us-east-1.elb.amazonaws.com`)

### Step 9.2: Create Additional Target Groups

1. **EC2 Dashboard** → **Target Groups** → **Create target group**

2. **Backend Target Group**:
   - **Target type**: IP addresses
   - **Target group name**: `campus-marketplace-backend-tg`
   - **Protocol**: HTTP, **Port**: 8080
   - **VPC**: Select your VPC
   - **Health check path**: `/api/health` (or `/api/products/active`)
   - Click **Next** → **Create target group**

3. **Embeddings Target Group**:
   - **Target type**: IP addresses
   - **Target group name**: `campus-marketplace-embeddings-tg`
   - **Protocol**: HTTP, **Port**: 8001
   - **VPC**: Select your VPC
   - **Health check path**: `/health` (or `/`)
   - Click **Create target group**

### Step 9.3: Configure ALB Listener Rules

1. Go to your ALB → **Listeners** tab → Select HTTP:80 listener

2. **View/Edit rules** → **Add rule**

3. **Rule 1 - Backend API**:
   - **IF**: Path is `/api/*`
   - **THEN**: Forward to `campus-marketplace-backend-tg`
   - Click **Save**

4. **Rule 2 - Embeddings Service**:
   - **IF**: Path is `/embeddings/*`
   - **THEN**: Forward to `campus-marketplace-embeddings-tg`
   - Click **Save**

5. **Default rule** should forward to `campus-marketplace-frontend-tg`

---

## Part 10: Create ECS Services

### Step 10.1: Backend Service

1. **ECS Dashboard** → **Clusters** → Select your cluster → **Services** tab → **Create**

2. **Compute configuration**:
   - **Launch type**: EC2
   - **Task Definition**: `campus-marketplace-backend`
   - **Service name**: `backend-service`
   - **Desired tasks**: 2 (for high availability)

3. **Networking**:
   - **VPC**: Select your VPC
   - **Subnets**: Select both private subnets
   - **Security groups**: Select `campus-marketplace-ecs-sg`
   - **Auto-assign public IP**: Disabled (or Enabled if no NAT Gateway)

4. **Load balancing**:
   - **Load balancer type**: Application Load Balancer
   - **Load balancer name**: Select your ALB
   - **Container to load balance**: Select `backend:8080:8080`
   - **Listener port**: 80:HTTP
   - **Target group name**: Select `campus-marketplace-backend-tg`

5. **Service Auto Scaling** (optional but recommended):
   - **Configure Service Auto Scaling**: Enable
   - **Minimum number of tasks**: 1
   - **Maximum number of tasks**: 4
   - **Target tracking - CPU utilization**: 70%
   - **Target tracking - Memory utilization**: 80%

6. Click **Create**

### Step 10.2: Frontend Service

1. **Create service**:
   - **Task Definition**: `campus-marketplace-frontend`
   - **Service name**: `frontend-service`
   - **Desired tasks**: 2
   - **Load balancer**: Same ALB
   - **Target group**: `campus-marketplace-frontend-tg`
   - **Container**: `frontend:3000:3000`

2. **Auto Scaling**: Same as backend

3. Click **Create**

### Step 10.3: Embeddings Service

1. **Create service**:
   - **Task Definition**: `campus-marketplace-embeddings`
   - **Service name**: `embeddings-service`
   - **Desired tasks**: 1 (can scale if needed)
   - **No load balancer** (accessed internally by backend)

2. Click **Create**

---

## Part 11: Auto Scaling Configuration

### Step 11.1: ECS Service Auto Scaling

Already configured in service creation, but you can adjust:

1. **ECS Dashboard** → **Clusters** → Your cluster → **Services** → Select service
2. **Auto Scaling** tab → **Edit**
3. Adjust min/max tasks and target metrics

### Step 11.2: EC2 Auto Scaling (for Cluster Capacity)

1. **ECS Dashboard** → **Clusters** → Your cluster → **Capacity providers** tab
2. **Add capacity provider** → **EC2 Auto Scaling**
3. Configure:
   - **Minimum capacity**: 1 instance
   - **Maximum capacity**: 4 instances
   - **Target capacity**: 70% (scales when cluster is 70% full)

---

## Part 12: CloudWatch Logs

### Step 12.1: Create Log Groups

1. **CloudWatch Dashboard** → **Logs** → **Log groups** → **Create log group**

2. Create these log groups:
   - `/ecs/campus-marketplace-backend`
   - `/ecs/campus-marketplace-frontend`
   - `/ecs/campus-marketplace-embeddings`

3. **Retention**: 7 days (to save costs)

---

## Part 13: Update Frontend Environment Variables

After ALB is created, update frontend task definition:

1. **ECS Dashboard** → **Task definitions** → `campus-marketplace-frontend` → **Create new revision**

2. Update environment variable:
   - `VITE_API_URL` = `http://<your-alb-dns-name>/api`

3. **Create new revision**

4. **Update service** to use new revision:
   - Go to service → **Update** → **Force new deployment** → **Update**

---

## Part 14: Testing

1. **Get ALB DNS name**: EC2 → Load Balancers → Your ALB → Copy DNS name

2. **Test endpoints**:
   - Frontend: `http://<alb-dns-name>/`
   - Backend API: `http://<alb-dns-name>/api/products/active`
   - Health check: `http://<alb-dns-name>/api/health`

3. **Check ECS services**:
   - ECS Dashboard → Your cluster → Services → Check all services are running
   - Check tasks are in "Running" state

4. **Check target health**:
   - EC2 → Target Groups → Select target group → **Targets** tab
   - All targets should be "healthy"

---

## Part 15: SSL Certificate (Optional but Recommended)

### Step 15.1: Request Certificate

1. **ACM (Certificate Manager)** → **Request a certificate**

2. **Domain names**:
   - **Fully qualified domain name**: `yourdomain.com`
   - **Subject alternative names**: `*.yourdomain.com`

3. **Validation method**: DNS validation

4. **Request certificate**

5. **Add DNS records** to your domain provider (Route 53 or external)

6. Wait for validation (5-10 minutes)

### Step 15.2: Add HTTPS Listener to ALB

1. **EC2** → **Load Balancers** → Your ALB → **Listeners** → **Add listener**

2. **Protocol**: HTTPS, **Port**: 443

3. **Default SSL certificate**: Select your ACM certificate

4. **Default action**: Forward to `campus-marketplace-frontend-tg`

5. **Add listener**

6. **Update listener rules** to also handle HTTPS

---

## Cost Optimization Tips for Student Account

1. **Use EC2 launch type** instead of Fargate (cheaper)
2. **Use t3.micro instances** (free tier eligible)
3. **Set auto-scaling min to 1** when not in use
4. **Use single-AZ RDS** (db.t3.micro free tier)
5. **Disable Container Insights** if not needed
6. **Set CloudWatch log retention to 1-7 days**
7. **Use S3 Intelligent-Tiering**
8. **Stop services when not testing**

### Estimated Monthly Cost (with optimizations):

- ECS EC2 (2x t3.micro): ~$15-20/month
- RDS (db.t3.micro): Free tier or ~$15/month
- ALB: ~$16/month
- ElastiCache (cache.t3.micro): ~$12/month
- S3: ~$1-5/month
- Data transfer: ~$5-10/month
- **Total: ~$50-70/month** (well within $120 credit)

---

## Troubleshooting

### Services not starting:
- Check CloudWatch logs
- Verify security groups allow traffic
- Check task definition environment variables
- Verify ECR images are pushed correctly

### Health checks failing:
- Verify health check paths are correct
- Check security groups allow ALB → ECS traffic
- Check application is listening on correct ports

### Can't connect to database:
- Verify RDS security group allows ECS security group
- Check database endpoint is correct
- Verify credentials in task definition

---

## Next Steps

1. Set up Route 53 for custom domain
2. Configure CloudFront CDN (optional)
3. Set up monitoring dashboards
4. Configure backup strategies
5. Set up CI/CD pipeline

---

**Congratulations!** Your application should now be running on AWS with auto-scaling! 🎉

