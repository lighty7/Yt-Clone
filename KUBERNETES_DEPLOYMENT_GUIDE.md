# 🚀 Kubernetes Deployment Guide - YouTube Clone

## 📋 Overview

This guide covers deploying your YouTube Clone application to Kubernetes using:
- **Docker**: Multi-stage builds for both frontend and backend
- **Kubernetes**: Native manifests and Helm charts
- **Production Ready**: Security, monitoring, and scalability

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   Database      │
│   (React +      │    │   (Node.js +    │    │   (PostgreSQL)  │
│    Nginx)       │    │    Express)     │    │                 │
│                 │    │                 │    │                 │
│   Port: 80      │◄──►│   Port: 3000    │◄──►│   Port: 5432    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                                 │
                    ┌─────────────────┐
                    │   Ingress       │
                    │   (Nginx)       │
                    │                 │
                    │   Port: 80/443  │
                    └─────────────────┘
```

## 🐳 Docker Images

### Backend Image Features
- **Multi-stage build**: Optimized for production
- **Non-root user**: Security best practices
- **Health checks**: Liveness and readiness probes
- **Resource limits**: CPU and memory constraints
- **Signal handling**: Proper shutdown with dumb-init

### Frontend Image Features
- **Nginx**: High-performance web server
- **Gzip compression**: Optimized content delivery
- **Security headers**: XSS, CSRF protection
- **Rate limiting**: API protection
- **Health checks**: Service monitoring

## 🚀 Quick Start

### 1. Build Docker Images

#### Using Scripts
```bash
# Linux/Mac
./scripts/build-images.sh

# Windows
scripts\build-images.bat

# With custom registry
REGISTRY=your-registry.com ./scripts/build-images.sh

# Push to registry
PUSH=true ./scripts/build-images.sh
```

#### Manual Build
```bash
# Backend
docker build -f backend/Dockerfile -t yt-clone-backend:latest ./backend

# Frontend
docker build -f frontend/Dockerfile -t yt-clone-frontend:latest ./frontend
```

### 2. Deploy to Kubernetes

#### Using Native Manifests
```bash
# Create namespace
kubectl apply -f k8s/namespace.yaml

# Create secrets
kubectl create secret generic yt-clone-secrets \
  --from-literal=JWT_SECRET=your-jwt-secret \
  --from-literal=DB_PASSWORD=your-db-password \
  --from-literal=SMTP_USER=your-email@gmail.com \
  --from-literal=SMTP_PASS=your-app-password \
  --from-literal=DB_HOST=your-db-host \
  --from-literal=DB_NAME=your-db-name \
  --from-literal=DB_USER=your-db-user \
  --from-literal=FRONTEND_URL=https://your-domain.com \
  --namespace=yt-clone

# Deploy application
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/ingress.yaml
```

#### Using Helm
```bash
# Install Helm chart
helm install yt-clone ./helm/yt-clone

# Upgrade deployment
helm upgrade yt-clone ./helm/yt-clone

# Uninstall
helm uninstall yt-clone
```

## 🔧 Configuration

### Environment Variables

#### Backend Configuration
```yaml
env:
  NODE_ENV: "production"
  PORT: "3000"
  JWT_EXPIRES_IN: "7d"
  VERIFICATION_TOKEN_EXPIRES_IN: "24h"
  SMTP_HOST: "smtp.gmail.com"
  SMTP_PORT: "587"
  SMTP_SECURE: "false"
  DB_SSL: "true"
```

#### Frontend Configuration
```yaml
env:
  VITE_API_URL: "http://backend-service:3000"
```

### Secrets Management

#### Required Secrets
- `JWT_SECRET`: JWT signing secret
- `DB_PASSWORD`: Database password
- `SMTP_USER`: Email service username
- `SMTP_PASS`: Email service password
- `DB_HOST`: Database host
- `DB_NAME`: Database name
- `DB_USER`: Database username
- `FRONTEND_URL`: Frontend URL for CORS

#### Creating Secrets
```bash
# Using kubectl
kubectl create secret generic yt-clone-secrets \
  --from-literal=JWT_SECRET=your-secret \
  --namespace=yt-clone

# Using external secret management
# - Sealed Secrets
# - External Secrets Operator
# - Vault
```

## 📊 Monitoring & Health Checks

### Health Check Endpoints
- **Backend**: `GET /health`
- **Frontend**: `GET /health`

### Kubernetes Probes
```yaml
livenessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /health
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 3
```

### Resource Limits
```yaml
resources:
  requests:
    memory: "256Mi"
    cpu: "250m"
  limits:
    memory: "512Mi"
    cpu: "500m"
```

## 🔒 Security Features

### Pod Security
- **Non-root user**: Runs as user 1001
- **Read-only filesystem**: Frontend containers
- **No privilege escalation**: Security context
- **Dropped capabilities**: Minimal permissions

### Network Security
- **CORS configuration**: Restricted origins
- **Rate limiting**: API protection
- **TLS termination**: HTTPS enforcement
- **Security headers**: XSS, CSRF protection

### Secret Management
- **Encrypted secrets**: Kubernetes secrets
- **External secret management**: Integration ready
- **No hardcoded credentials**: Environment variables

## 📈 Scaling & Performance

### Horizontal Pod Autoscaler
```yaml
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: yt-clone-backend-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: backend-deployment
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 80
```

### Resource Optimization
- **CPU requests**: 250m (backend), 100m (frontend)
- **Memory requests**: 256Mi (backend), 128Mi (frontend)
- **CPU limits**: 500m (backend), 200m (frontend)
- **Memory limits**: 512Mi (backend), 256Mi (frontend)

## 🌐 Ingress Configuration

### Nginx Ingress
```yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: yt-clone-ingress
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
    nginx.ingress.kubernetes.io/ssl-redirect: "true"
    nginx.ingress.kubernetes.io/cors-allow-origin: "https://your-domain.com"
    cert-manager.io/cluster-issuer: "letsencrypt-prod"
```

### SSL/TLS
- **Let's Encrypt**: Automatic certificate management
- **TLS termination**: HTTPS enforcement
- **Certificate rotation**: Automatic renewal

## 🗄️ Database Setup

### PostgreSQL in Kubernetes
```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: postgres-deployment
spec:
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        env:
        - name: POSTGRES_DB
          value: yt_clone
        - name: POSTGRES_USER
          value: postgres
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: postgres-secret
              key: password
```

### External Database
- **Cloud providers**: AWS RDS, Google Cloud SQL, Azure Database
- **Managed services**: Supabase, Neon, Railway
- **Connection strings**: Environment variables

## 🔄 CI/CD Integration

### GitHub Actions
```yaml
name: Deploy to Kubernetes
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Build and push images
      run: |
        ./scripts/build-images.sh
    - name: Deploy to Kubernetes
      run: |
        kubectl apply -f k8s/
```

### GitLab CI
```yaml
deploy:
  stage: deploy
  script:
    - ./scripts/build-images.sh
    - kubectl apply -f k8s/
  only:
    - main
```

## 🐛 Troubleshooting

### Common Issues

#### Pod Not Starting
```bash
# Check pod status
kubectl get pods -n yt-clone

# Check pod logs
kubectl logs -f deployment/backend-deployment -n yt-clone

# Check pod events
kubectl describe pod <pod-name> -n yt-clone
```

#### Image Pull Errors
```bash
# Check image pull secrets
kubectl get secrets -n yt-clone

# Check image availability
docker pull your-registry.com/yt-clone-backend:latest
```

#### Service Not Accessible
```bash
# Check service endpoints
kubectl get endpoints -n yt-clone

# Check ingress status
kubectl get ingress -n yt-clone

# Test service connectivity
kubectl port-forward service/backend-service 3000:3000 -n yt-clone
```

### Debug Commands
```bash
# Get all resources
kubectl get all -n yt-clone

# Check resource usage
kubectl top pods -n yt-clone

# Check events
kubectl get events -n yt-clone --sort-by='.lastTimestamp'

# Access pod shell
kubectl exec -it <pod-name> -n yt-clone -- /bin/sh
```

## 📚 Additional Resources

### Documentation
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Helm Documentation](https://helm.sh/docs/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

### Tools
- [kubectl](https://kubernetes.io/docs/tasks/tools/)
- [helm](https://helm.sh/docs/intro/install/)
- [k9s](https://k9scli.io/) - Terminal UI for Kubernetes
- [Lens](https://k8slens.dev/) - Desktop UI for Kubernetes

## 🎉 Success!

Once deployed, your YouTube Clone will be available at:
- **Frontend**: https://your-domain.com
- **Backend API**: https://api.your-domain.com
- **Health Check**: https://your-domain.com/health

The application supports:
- ✅ Horizontal scaling
- ✅ Health monitoring
- ✅ Security best practices
- ✅ Production-ready configuration
- ✅ CI/CD integration
