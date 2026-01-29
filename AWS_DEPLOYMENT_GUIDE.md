# EduGap AWS Deployment Guide 🚀

## Overview

This guide will help you deploy your full-stack EduGap application to AWS using the best practices for Next.js applications.

## 🎯 Recommended AWS Architecture

### **Option 1: AWS Amplify (Easiest - Recommended)**
- ✅ **Best for**: Quick deployment, automatic CI/CD
- ✅ **Handles**: Frontend + API Routes automatically
- ✅ **Cost**: Free tier available, ~$0-5/month
- ✅ **Time**: 10-15 minutes

### **Option 2: Vercel (Alternative - Also Easy)**
- ✅ **Best for**: Next.js optimized hosting
- ✅ **Handles**: Everything automatically
- ✅ **Cost**: Free tier generous
- ✅ **Time**: 5 minutes
- ⚠️ **Note**: Not AWS, but works with AWS services

### **Option 3: AWS EC2 + Docker (Advanced)**
- ✅ **Best for**: Full control, custom configuration
- ⚠️ **Complexity**: Higher
- ✅ **Cost**: ~$5-10/month (t2.micro)
- ⏱️ **Time**: 30-45 minutes

---

## 🚀 OPTION 1: AWS Amplify Deployment (RECOMMENDED)

### Prerequisites
- AWS Account with credentials
- Git repository (GitHub, GitLab, or Bitbucket)

### Step 1: Prepare Your Project

1. **Create `.gitignore` (if not exists)**:
```bash
# Add to .gitignore
node_modules/
.next/
.env.local
.env*.local
.DS_Store
*.log
```

2. **Commit your code to Git**:
```bash
git init
git add .
git commit -m "Initial commit - EduGap MVP"
```

3. **Push to GitHub** (or GitLab/Bitbucket):
```bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/edugap.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy to AWS Amplify

1. **Go to AWS Amplify Console**:
   - Navigate to: https://console.aws.amazon.com/amplify/
   - Click "New app" → "Host web app"

2. **Connect Repository**:
   - Select your Git provider (GitHub/GitLab/Bitbucket)
   - Authorize AWS Amplify
   - Select your `edugap` repository
   - Select `main` branch

3. **Configure Build Settings**:
   - Amplify will auto-detect Next.js
   - Use these build settings:

```yaml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: .next
    files:
      - '**/*'
  cache:
    paths:
      - node_modules/**/*
      - .next/cache/**/*
```

4. **Add Environment Variables**:
   - Click "Advanced settings"
   - Add environment variables:
     - `MONGODB_URI` = (your MongoDB connection string - optional)
     - `NODE_ENV` = `production`

5. **Deploy**:
   - Click "Save and deploy"
   - Wait 5-10 minutes for deployment
   - You'll get a URL like: `https://main.d1234567890.amplifyapp.com`

### Step 3: Configure Custom Domain (Optional)

1. In Amplify Console → "Domain management"
2. Add your custom domain
3. Follow DNS configuration instructions

---

## 🚀 OPTION 2: Vercel Deployment (Fastest)

### Step 1: Install Vercel CLI

```bash
npm install -g vercel
```

### Step 2: Deploy

```bash
# Login to Vercel
vercel login

# Deploy
vercel

# Follow prompts:
# - Set up and deploy? Yes
# - Which scope? (your account)
# - Link to existing project? No
# - Project name? edugap
# - Directory? ./
# - Override settings? No
```

### Step 3: Add Environment Variables

```bash
# Add MongoDB URI (optional)
vercel env add MONGODB_URI
# Paste your MongoDB connection string

# Deploy to production
vercel --prod
```

**Done!** Your app is live at: `https://edugap.vercel.app`

---

## 🚀 OPTION 3: AWS EC2 Deployment (Advanced)

### Step 1: Launch EC2 Instance

1. **Go to EC2 Console**: https://console.aws.amazon.com/ec2/
2. **Launch Instance**:
   - Name: `edugap-server`
   - AMI: Ubuntu Server 22.04 LTS
   - Instance type: `t2.micro` (free tier)
   - Key pair: Create new or use existing
   - Security group: Allow HTTP (80), HTTPS (443), SSH (22)
   - Storage: 8 GB (default)
3. **Launch instance**

### Step 2: Connect to EC2

```bash
# SSH into your instance
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

### Step 3: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Nginx (reverse proxy)
sudo apt install -y nginx
```

### Step 4: Deploy Application

```bash
# Clone your repository
git clone https://github.com/YOUR_USERNAME/edugap.git
cd edugap

# Install dependencies
npm ci

# Create .env.local
nano .env.local
# Add: MONGODB_URI=your_connection_string

# Build application
npm run build

# Start with PM2
pm2 start npm --name "edugap" -- start
pm2 save
pm2 startup
```

### Step 5: Configure Nginx

```bash
# Create Nginx config
sudo nano /etc/nginx/sites-available/edugap
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name YOUR_EC2_PUBLIC_IP;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/edugap /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**Done!** Access your app at: `http://YOUR_EC2_PUBLIC_IP`

---

## 🗄️ MongoDB Setup for AWS

### Option A: MongoDB Atlas (Recommended)

1. **Create MongoDB Atlas Account**: https://www.mongodb.com/cloud/atlas/register
2. **Create Free Cluster** (M0 tier)
3. **Create Database User**:
   - Username: `edugap_user`
   - Password: (generate strong password)
4. **Whitelist IP**:
   - Add `0.0.0.0/0` (allow from anywhere)
   - Or add your AWS IP specifically
5. **Get Connection String**:
   ```
   mongodb+srv://edugap_user:<password>@cluster0.xxxxx.mongodb.net/edugap?retryWrites=true&w=majority
   ```
6. **Add to Environment Variables** in your deployment

### Option B: AWS DocumentDB (AWS Native)

1. **Go to DocumentDB Console**: https://console.aws.amazon.com/docdb/
2. **Create Cluster**:
   - Instance class: `db.t3.medium`
   - Number of instances: 1
   - Username: `edugap_admin`
   - Password: (create strong password)
3. **Get Connection String**:
   ```
   mongodb://edugap_admin:<password>@docdb-cluster.xxxxx.us-east-1.docdb.amazonaws.com:27017/edugap?tls=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false
   ```
4. **Download Certificate**:
   ```bash
   wget https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem
   ```

---

## 📋 Pre-Deployment Checklist

- [ ] Code committed to Git repository
- [ ] `.env.local` added to `.gitignore`
- [ ] MongoDB connection string ready (optional)
- [ ] AWS credentials configured
- [ ] Build succeeds locally (`npm run build`)
- [ ] All tests passing (or acceptable failures documented)

---

## 🔧 Environment Variables for Production

Add these to your deployment platform:

```bash
# Required
NODE_ENV=production

# Optional (for database)
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/edugap

# Optional (for custom configuration)
NEXT_PUBLIC_API_URL=https://your-domain.com
```

---

## 🚦 Post-Deployment Testing

After deployment, test these endpoints:

1. **Homepage**: `https://your-domain.com/`
2. **Health Check**: `https://your-domain.com/api/health`
3. **Login Flow**: Login → Profile → Quiz → Dashboard
4. **API Test**: `https://your-domain.com/api-test`

### Quick Test Script

```bash
# Test health endpoint
curl https://your-domain.com/api/health

# Test analyze endpoint
curl -X POST https://your-domain.com/api/analyze \
  -H "Content-Type: application/json" \
  -d '{"answers":[{"questionId":"q1","selectedOption":1}]}'
```

---

## 🎯 Recommended Deployment Path

**For your hackathon/demo, I recommend:**

### **Best Choice: AWS Amplify**
1. ✅ Easiest AWS-native solution
2. ✅ Automatic CI/CD from Git
3. ✅ Free tier available
4. ✅ Handles Next.js perfectly
5. ✅ 10-15 minute setup

### **Alternative: Vercel**
1. ✅ Fastest deployment (5 minutes)
2. ✅ Next.js optimized
3. ✅ Free tier generous
4. ⚠️ Not AWS (but can use AWS services)

---

## 🆘 Troubleshooting

### Build Fails
```bash
# Check build locally first
npm run build

# Check Node version
node --version  # Should be 18+

# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### API Routes Not Working
- Ensure environment variables are set
- Check API route logs in deployment platform
- Verify MongoDB connection string (if using database)

### Database Connection Issues
- Check MongoDB Atlas IP whitelist
- Verify connection string format
- Test connection locally first

---

## 📊 Cost Estimate

### AWS Amplify
- **Free Tier**: 1000 build minutes/month, 15 GB served/month
- **After Free Tier**: ~$0.01 per build minute, ~$0.15 per GB served
- **Estimated**: $0-5/month for demo/small traffic

### AWS EC2 (t2.micro)
- **Free Tier**: 750 hours/month for 12 months
- **After Free Tier**: ~$8.50/month
- **+ Data Transfer**: ~$0.09 per GB

### MongoDB Atlas
- **Free Tier**: M0 cluster (512 MB storage)
- **Paid**: M10 starts at $0.08/hour (~$57/month)
- **Recommended**: Use free tier for demo

---

## 🎉 Quick Start Commands

### For AWS Amplify:
```bash
# 1. Push to GitHub
git init
git add .
git commit -m "Deploy to AWS"
git remote add origin https://github.com/YOUR_USERNAME/edugap.git
git push -u origin main

# 2. Go to AWS Amplify Console and connect repository
# 3. Deploy automatically
```

### For Vercel:
```bash
# 1. Install and deploy
npm install -g vercel
vercel login
vercel --prod
```

### For EC2:
```bash
# 1. SSH to EC2
ssh -i key.pem ubuntu@YOUR_IP

# 2. Clone and deploy
git clone https://github.com/YOUR_USERNAME/edugap.git
cd edugap
npm ci && npm run build
pm2 start npm --name edugap -- start
```

---

## 📞 Need Help?

- **AWS Amplify Docs**: https://docs.amplify.aws/
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **MongoDB Atlas**: https://docs.atlas.mongodb.com/

---

**Your EduGap application is production-ready and can be deployed to AWS in 10-15 minutes using AWS Amplify!** 🚀
