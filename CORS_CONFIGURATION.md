# CORS Configuration Guide

## 🔧 Flexible CORS Setup for Development

The CORS configuration has been updated to be more flexible for development while maintaining security in production.

### 🚀 Quick Setup

Add these environment variables to your `.env` file:

```env
# CORS Configuration
NODE_ENV=development

# Development Origins (comma-separated)
DEVELOPMENT_ORIGINS=http://localhost:3000,http://localhost:5173,http://192.168.1.100:5173,http://192.168.1.100:3000

# Production Origins (comma-separated)
PRODUCTION_ORIGINS=https://yourdomain.com,https://www.yourdomain.com
```

### 📋 Supported Development Patterns

The system automatically allows these patterns in development:

#### Localhost Patterns
- `http://localhost:PORT` (any port)
- `https://localhost:PORT` (any port)
- `http://127.0.0.1:PORT` (any port)
- `https://127.0.0.1:PORT` (any port)

#### Private Network Ranges
- `http://192.168.x.x:PORT` (192.168.0.0/16)
- `https://192.168.x.x:PORT` (192.168.0.0/16)
- `http://10.x.x.x:PORT` (10.0.0.0/8)
- `https://10.x.x.x:PORT` (10.0.0.0/8)
- `http://172.16-31.x.x:PORT` (172.16.0.0/12)
- `https://172.16-31.x.x:PORT` (172.16.0.0/12)

### 🔧 Custom Configuration

#### Method 1: Environment Variables
Add specific origins to your `.env` file:

```env
# Add specific IPs and ports
DEVELOPMENT_ORIGINS=http://192.168.1.50:3000,http://192.168.1.50:5173,http://10.0.0.100:8080
```

#### Method 2: Wildcard Support
Use wildcards for dynamic IPs:

```env
# Allow any IP in 192.168.1.x range
DEVELOPMENT_ORIGINS=http://192.168.1.*:3000,http://192.168.1.*:5173
```

### 🛡️ Security Features

#### Development Mode
- ✅ Allows localhost and private network IPs
- ✅ Logs allowed/blocked origins
- ✅ Supports wildcard patterns
- ✅ Flexible port configuration

#### Production Mode
- 🔒 Only allows explicitly listed domains
- 🔒 No wildcard support
- 🔒 HTTPS enforcement recommended
- 🔒 Strict origin validation

### 📊 Debugging CORS Issues

#### Check CORS Logs
The server will log CORS decisions:

```
✅ CORS allowed origin: http://192.168.1.100:5173
🔒 CORS blocked origin: http://malicious-site.com:3000
💡 Add this origin to DEVELOPMENT_ORIGINS in .env if needed
```

#### Common Issues & Solutions

1. **Origin Blocked in Development**
   ```
   Solution: Add the origin to DEVELOPMENT_ORIGINS in .env
   ```

2. **Port Not Allowed**
   ```
   Solution: The system allows any port with localhost/private IPs
   Check if you're using a public IP or domain
   ```

3. **HTTPS/HTTP Mismatch**
   ```
   Solution: Ensure both frontend and backend use same protocol
   ```

### 🔄 Dynamic Origin Management

For advanced use cases, you can add origins at runtime:

```javascript
const { addCustomOrigin } = require('./config/cors');

// Add a custom origin (requires server restart)
addCustomOrigin('http://new-ip:3000');
```

### 📝 Example Configurations

#### Basic Development Setup
```env
NODE_ENV=development
DEVELOPMENT_ORIGINS=http://localhost:3000,http://localhost:5173
```

#### Team Development Setup
```env
NODE_ENV=development
DEVELOPMENT_ORIGINS=http://localhost:3000,http://localhost:5173,http://192.168.1.100:3000,http://192.168.1.101:5173
```

#### Production Setup
```env
NODE_ENV=production
PRODUCTION_ORIGINS=https://yourdomain.com,https://www.yourdomain.com,https://api.yourdomain.com
```

#### Mobile Development Setup
```env
NODE_ENV=development
DEVELOPMENT_ORIGINS=http://localhost:3000,http://192.168.1.100:3000,http://10.0.2.2:3000
```

### 🚀 Testing CORS

#### Test with curl
```bash
# Test allowed origin
curl -H "Origin: http://localhost:3000" http://localhost:3000/api/auth/me

# Test blocked origin
curl -H "Origin: http://malicious-site.com" http://localhost:3000/api/auth/me
```

#### Test with Browser
Open browser console and check for CORS errors:
```javascript
fetch('http://localhost:3000/api/auth/me', {
  method: 'GET',
  credentials: 'include'
})
.then(response => console.log('CORS working'))
.catch(error => console.log('CORS error:', error));
```

### 🔧 Advanced Configuration

#### Custom CORS Headers
The configuration includes these headers:
- `Origin`
- `X-Requested-With`
- `Content-Type`
- `Accept`
- `Authorization`
- `Cache-Control`
- `Pragma`
- `X-API-Key`

#### Exposed Headers
- `Authorization`
- `X-Total-Count`

#### Methods Allowed
- `GET`
- `POST`
- `PUT`
- `DELETE`
- `OPTIONS`
- `PATCH`

This flexible CORS configuration ensures your development environment works smoothly while maintaining security in production!
