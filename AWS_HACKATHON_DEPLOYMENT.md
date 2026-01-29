# EduGap - AWS Hackathon Deployment Guide 🚀

## 🎯 Your AWS Hackathon Account Details

- **Console URL**: https://284333427150.signin.aws.amazon.com/console
- **Account ID**: 284333427150
- **Username**: Your email address
- **Initial Password**: IBMAWS@2026
- **Allowed Regions**: us-east-1 (N. Virginia) or us-west-2 (Oregon)

---

## 🚀 RECOMMENDED: Deploy to AWS Amplify

AWS Amplify is the **best option** for your hackathon because:
- ✅ Quick deployment (10-15 minutes)
- ✅ Works within your region restrictions
- ✅ No complex AWS configuration needed
- ✅ Automatic CI/CD from Git
- ✅ Free tier available

---

## 📋 Step-by-Step Deployment

### Step 1: Login to AWS Console

1. Go to: https://284333427150.signin.aws.amazon.com/console
2. Enter your email address as username
3. Enter password: `IBMAWS@2026`
4. **Change your password** when prompted (required on first login)
5. **Select Region**: Choose **us-east-1** (N. Virginia) from top-right dropdown

---

### Step 2: Push Code to GitHub

```bash
# Initialize Git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Deploy EduGap to AWS Hackathon"

# Create repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/edugap.git
git branch -M main
git push -u origin main
```

---

### Step 3: Deploy to AWS Amplify

#### 3.1 Navigate to Amplify

1. In AWS Console, search for "Amplify" in the search bar
2. Click on **AWS Amplify**
3. Make sure you're in **us-east-1** region (top-right)

#### 3.2 Create New App

1. Click **"New app"** button
2. Select **"Host web app"**
3. Choose **GitHub** as your Git provider
4. Click **"Continue"**

#### 3.3 Authorize GitHub

1. Click **"Authorize AWS Amplify"**
2. Sign in to GitHub if prompted
3. Grant Amplify access to your repositories

#### 3.4 Select Repository

1. Select your **edugap** repository from the dropdown
2. Select **main** branch
3. Click **"Next"**

#### 3.5 Configure Build Settings

Amplify will auto-detect Next.js and use your `amplify.yml` file.

**Verify these settings**:
- App name: `edugap`
- Environment: `production`
- Build settings: Should show your `amplify.yml` configuration

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

#### 3.6 Add Environment Variables (Optional)

Click **"Advanced settings"** to add environment variables:

**For MongoDB (Optional)**:
- Key: `MONGODB_URI`
- Value: Your MongoDB Atlas connection string
- (If you don't have MongoDB, skip this - app works without it!)

**For Production**:
- Key: `NODE_ENV`
- Value: `production`

#### 3.7 Deploy!

1. Click **"Next"**
2. Review settings
3. Click **"Save and deploy"**
4. Wait 5-10 minutes for deployment

You'll see:
- ✅ Provision (creating resources)
- ✅ Build (building your app)
- ✅ Deploy (deploying to CDN)
- ✅ Verify (health checks)

---

### Step 4: Access Your Deployed App

Once deployment completes:

1. You'll see a URL like: `https://main.d1234567890.amplifyapp.com`
2. Click the URL to open your live application
3. Test the full user flow:
   - Login page
   - Profile page
   - Quiz
   - Dashboard
   - Remediation

---

## 🗄️ MongoDB Setup (Optional)

Your app works **without MongoDB** (uses mock data), but if you want to add it:

### Option 1: MongoDB Atlas (Recommended - Free)

1. **Create Account**: https://www.mongodb.com/cloud/atlas/register
2. **Create Free Cluster**:
   - Choose M0 (free tier)
   - Select region: **US East (N. Virginia)** to match AWS
3. **Create Database User**:
   - Username: `edugap_user`
   - Password: (generate strong password)
4. **Network Access**:
   - Click "Network Access"
   - Add IP: `0.0.0.0/0` (allow from anywhere)
5. **Get Connection String**:
   - Click "Connect" → "Connect your application"
   - Copy connection string:
   ```
   mongodb+srv://edugap_user:<password>@cluster0.xxxxx.mongodb.net/edugap?retryWrites=true&w=majority
   ```
6. **Add to Amplify**:
   - Go to Amplify Console
   - Click your app → "Environment variables"
   - Add `MONGODB_URI` with your connection string
   - Redeploy

---

## 🧪 Testing Your Deployment

### Automated Tests

```bash
# Test health endpoint
curl https://your-amplify-url.amplifyapp.com/api/health

# Should return:
# {"status":"ok","timestamp":"...","database":"disconnected","message":"EduGap API is running"}
```

### Manual Testing

1. **Homepage**: Should load with login page
2. **Login**: Enter any email → Should redirect to profile
3. **Profile**: Select a subject → Should go to quiz
4. **Quiz**: Answer 5 questions → Submit
5. **Dashboard**: Should show failure risk and weak concepts
6. **Remediation**: Click "Fix Now" → Should show learning content
7. **Chatbot**: Click chat icon → Should open chatbot

---

## 🔧 AWS CLI Setup (Optional - For Advanced Features)

If you need AWS CLI access:

### 1. Create Access Keys

1. In AWS Console, click your username (top-right)
2. Click **"Security credentials"**
3. Scroll to **"Access keys"** section
4. Click **"Create access key"**
5. Select **"Command Line Interface (CLI)"**
6. Check the confirmation box
7. Click **"Create access key"**
8. **Download** or copy your:
   - Access Key ID
   - Secret Access Key

### 2. Configure AWS CLI

```bash
# Install AWS CLI (if not installed)
# Windows: Download from https://aws.amazon.com/cli/
# Mac: brew install awscli
# Linux: sudo apt install awscli

# Configure
aws configure

# Enter when prompted:
# AWS Access Key ID: [your-access-key-id]
# AWS Secret Access Key: [your-secret-access-key]
# Default region name: us-east-1
# Default output format: json
```

### 3. Verify Configuration

```bash
# Test AWS CLI
aws sts get-caller-identity

# Should show your account ID: 284333427150
```

---

## 🎨 Custom Domain (Optional)

To add a custom domain to your Amplify app:

1. In Amplify Console, click **"Domain management"**
2. Click **"Add domain"**
3. Enter your domain name
4. Follow DNS configuration instructions
5. Wait for SSL certificate provisioning (automatic)

---

## 📊 Monitoring Your App

### Amplify Console

1. **Build History**: See all deployments
2. **Logs**: View build and runtime logs
3. **Metrics**: Monitor traffic and performance
4. **Alarms**: Set up alerts (optional)

### CloudWatch (Advanced)

1. Go to CloudWatch in AWS Console
2. View logs for your Amplify app
3. Set up custom metrics and alarms

---

## 🔄 Continuous Deployment

Once set up, Amplify automatically deploys when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Update feature"
git push

# Amplify automatically:
# 1. Detects the push
# 2. Builds your app
# 3. Deploys to production
# 4. Updates your live site
```

---

## 🆘 Troubleshooting

### Build Fails

**Check Build Logs**:
1. Go to Amplify Console
2. Click on failed build
3. View detailed logs
4. Common issues:
   - Node version mismatch (should be 18+)
   - Missing dependencies
   - Environment variables not set

**Solution**:
```bash
# Test build locally first
npm run build

# If it works locally, check Amplify build settings
```

### App Not Loading

**Check**:
1. Build completed successfully
2. Deployment status is "Deployed"
3. URL is correct
4. No errors in browser console

### API Routes Not Working

**Check**:
1. Environment variables are set correctly
2. Region is us-east-1
3. API routes are in `app/api/` directory
4. Next.js version supports API routes

### Database Connection Issues

**Check**:
1. MongoDB Atlas IP whitelist includes `0.0.0.0/0`
2. Connection string is correct
3. Username and password are correct
4. Database name is correct

**Note**: App works without database (uses mock data)

---

## 💰 Cost Estimate

### AWS Amplify
- **Free Tier**: 
  - 1000 build minutes/month
  - 15 GB served/month
  - 5 GB stored/month
- **Your Usage** (estimated):
  - Builds: ~5 minutes per deployment
  - Traffic: ~1-2 GB/month for demo
  - **Cost**: $0/month (within free tier)

### MongoDB Atlas
- **Free Tier**: M0 cluster (512 MB)
- **Cost**: $0/month

### Total Cost
- **Estimated**: $0/month (using free tiers)

---

## 📋 Deployment Checklist

- [ ] AWS Console login successful
- [ ] Password changed
- [ ] Region set to us-east-1
- [ ] Code pushed to GitHub
- [ ] Amplify app created
- [ ] Repository connected
- [ ] Build settings configured
- [ ] Environment variables added (optional)
- [ ] Deployment successful
- [ ] App accessible via URL
- [ ] All features tested
- [ ] MongoDB connected (optional)

---

## 🎯 Quick Reference

### Important URLs
- **AWS Console**: https://284333427150.signin.aws.amazon.com/console
- **Amplify Console**: https://console.aws.amazon.com/amplify/
- **MongoDB Atlas**: https://cloud.mongodb.com/
- **Your App**: `https://main.dXXXXXXXXXX.amplifyapp.com` (after deployment)

### Important Commands
```bash
# Push to GitHub
git add .
git commit -m "Deploy"
git push

# Test build locally
npm run build

# Test locally
npm run dev

# AWS CLI
aws amplify list-apps --region us-east-1
```

---

## 🎉 Success!

Once deployed, your EduGap application will be:
- ✅ Live on AWS Amplify
- ✅ Accessible via public URL
- ✅ Automatically deployed on Git push
- ✅ Running in us-east-1 region
- ✅ Using AWS free tier
- ✅ Production-ready for demo

---

## 📞 Need Help?

- **AWS Amplify Docs**: https://docs.amplify.aws/
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **Hackathon Organizers**: Contact for AWS-specific issues

---

**Your EduGap app is ready to deploy to AWS! Follow the steps above and you'll be live in 15 minutes! 🚀**
