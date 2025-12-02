# AWS Deployment Quick Start Checklist

Use this checklist to track your deployment progress.

## Pre-Deployment

- [ ] AWS Account created and configured
- [ ] AWS CLI installed and configured (`aws configure`)
- [ ] Domain name purchased (optional)
- [ ] GitHub repository set up
- [ ] All environment variables documented

## Infrastructure Setup

- [ ] VPC created with public/private subnets
- [ ] Internet Gateway and NAT Gateway configured
- [ ] Security Groups created and configured
- [ ] RDS PostgreSQL instance verified/created
- [ ] ElastiCache Redis cluster created
- [ ] S3 bucket created for file uploads
- [ ] IAM roles created (ECS Task Execution, ECS Task Role)

## Container Registry

- [ ] ECR repositories created (backend, frontend, embeddings)
- [ ] Docker images built and pushed to ECR
- [ ] Image tags verified

## ECS Setup

- [ ] ECS Cluster created
- [ ] CloudWatch Log Groups created
- [ ] Task Definitions created and registered
- [ ] ECS Services created
- [ ] Service health checks passing

## Load Balancing

- [ ] Application Load Balancer created
- [ ] Target Groups created
- [ ] Listener rules configured
- [ ] Health checks configured

## Security & Secrets

- [ ] AWS Secrets Manager secrets created
- [ ] SSL Certificate requested (ACM)
- [ ] DNS validation completed
- [ ] HTTPS listener configured on ALB

## CDN & Domain

- [ ] CloudFront distribution created
- [ ] Route 53 hosted zone created (if using custom domain)
- [ ] DNS records configured
- [ ] SSL certificate attached

## Database

- [ ] Database migrations run
- [ ] Initial data seeded (if needed)
- [ ] Backup strategy configured
- [ ] Connection from ECS verified

## CI/CD

- [ ] GitHub Actions workflow created
- [ ] AWS credentials added to GitHub Secrets
- [ ] Pipeline tested
- [ ] Auto-deployment verified

## Monitoring

- [ ] CloudWatch alarms configured
- [ ] Container Insights enabled
- [ ] Log aggregation verified
- [ ] Billing alerts set up

## Testing

- [ ] Frontend accessible via ALB/CloudFront
- [ ] Backend API responding
- [ ] Database connections working
- [ ] File uploads to S3 working
- [ ] Authentication flow tested
- [ ] All features tested end-to-end

## Post-Deployment

- [ ] Performance testing completed
- [ ] Security audit performed
- [ ] Documentation updated
- [ ] Team access configured
- [ ] Backup/restore tested

## Cost Optimization

- [ ] Auto-scaling configured
- [ ] Reserved instances considered
- [ ] Unused resources cleaned up
- [ ] Cost monitoring dashboard created

---

**Estimated Time:** 4-8 hours for initial setup
**Estimated Cost:** $165-290/month (see guide for breakdown)

