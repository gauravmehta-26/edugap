# 🚀 Deploy EduGap to AWS - Follow This Guide

## ⭐ You Should Follow: AWS Amplify (Option 1)

**Why AWS Amplify?**
- ✅ Easiest option (15 minutes)
- ✅ Works with your AWS Hackathon account
- ✅ Stays in us-east-1 region (required)
- ✅ Free tier ($0/month)
- ✅ Automatic deployment from GitHub
- ✅ No complex configuration needed

---

## 📋 What You Need

- ✅ Your AWS credentials (you have them)
- ✅ GitHub account
- ✅ This code (you have it)
- ✅ 15 minutes of time

---

## 🎯 Step-by-Step Deployment

### STEP 1: Push Code to GitHub (5 minutes)

#### 1.1 Create GitHub Repository

1. Go to: https://github.com/new
2. Repository name: `edugap`
3. Description: "EduGap - AI-powered learning gap analyzer"
4. Make it **Public**
5. **Don't** initialize with README (you already have code)
6. Click **"Create repository"**

#### 1.2 Push Your Code

Open your terminal in the project folder and run:

```bash
# Initialize Git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Deploy EduGap to AWS Hackathon"

# Add GitHub remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/edugap.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**✅ Checkpoint**: Your code should now be visible on GitHub at `https://github.com/YOUR_USERNAME/edugap`

---

### STEP 2: Login to AWS Console (2 minutes)

1. **Open**: https://284333427150.signin.aws.amazon.com/console
2. **Username**: Your email address (exactly as provided)
3. **Password**: `IBMAWS@2026`
4. **Change Password**: You'll be prompted to change it (required)
5. **Select Region**: Top-right corner → Choose **"US East (N. Virginia) us-east-1"**

**⚠️ IMPORTANT**: Make sure you're in **us-east-1** region!

---

### STEP 3: Deploy with AWS Amplify (8 minutes)

#### 3.1 Navigate to Amplify

1. In AWS Console search bar (top), type: **"Amplify"**
2. Click **"AWS Amplify"** from results
3. You'll see the Amplify welcome page

#### 3.2 Create New App

1. Click the orange **"New app"** button (top-right)
2. Select **"Host web app"**
3. Click **"Continue"**

#### 3.3 Connect GitHub

1. Under "From your existing code", select **"GitHub"**
2. Click **"Continue"**
3. A popup will ask you to authorize AWS Amplify
4. Click **"Authorize AWS Amplify"**
5. Sign in to GitHub if prompted
6. Grant access to your repositories

#### 3.4 Select Repository

1. **Repository**: Select `edugap` from dropdown
2. **Branch**: Select `main`
3. Click **"Next"**

#### 3.5 Configure Build Settings

Amplify will auto-detect Next.js. You'll see:

- **App name**: `edugap` (you can keep this)
- **Environment**: `production`
- **Build settings**: Shows your `amplify.yml` configuration

**Scroll down** and click **"Advanced settings"** (optional but recommended):

**Add Environment Variables**:
- Click **"Add environment variable"**
- **Key**: `NODE_ENV`
- **Value**: `production`
- Click **"Add"**

**For MongoDB (Optional - Skip if you don't have it)**:
- Click **"Add environment variable"** again
- **Key**: `MONGODB_URI`
- **Value**: Your MongoDB connection string
- Click **"Add"**

**Note**: Your app works perfectly WITHOUT MongoDB!

#### 3.6 Review and Deploy

1. Click **"Next"**
2. Review all settings
3. Click **"Save and deploy"**

#### 3.7 Wait for Deployment

You'll see 4 stages:
1. ✅ **Provision** (1-2 min) - Creating resources
2. ✅ **Build** (3-5 min) - Building your app
3. ✅ **Deploy** (1-2 min) - Deploying to CDN
4. ✅ **Verify** (30 sec) - Health checks

**Total time**: 5-10 minutes

---

### STEP 4: Access Your Live App! (1 minute)

Once all stages show ✅:

1. You'll see a URL like: `https://main.d1234567890.amplifyapp.com`
2. **Click the URL** to open your live app
3. **Test it**:
   - Login page should load
   - Enter any email → Go to Profile
   - Select a subject → Start Quiz
   - Answer questions → See Dashboard
   - Click "Fix Now" → See Remediation
   - Click chat icon → Test Chatbot

---

## ✅ Success! Your App is Live!

**Your Live URL**: `https://main.dXXXXXXXXXX.amplifyapp.com`

Copy this URL and share it with your team!

---

## 🧪 Quick Test

Test your deployment:

```bash
# Replace YOUR_URL with your actual Amplify URL
curl https://YOUR_URL.amplifyapp.com/api/health

# Should return:
# {"status":"ok","timestamp":"...","database":"disconnected","message":"EduGap API is running"}
```

---

## 🔄 Automatic Updates

From now on, whenever you push to GitHub:

```bash
git add .
git commit -m "Update feature"
git push
```

Amplify will **automatically**:
1. Detect the push
2. Build your app
3. Deploy the update
4. Your live site updates in ~5 minutes

---

## 🗄️ Optional: Add MongoDB (5 minutes)

If you want to save quiz results to a database:

### 1. Create MongoDB Atlas Account
- Go to: https://www.mongodb.com/cloud/atlas/register
- Sign up (free)

### 2. Create Free Cluster
- Click "Build a Database"
- Choose **M0 (Free tier)**
- Region: **US East (N. Virginia)** (same as AWS)
- Click "Create"

### 3. Create Database User
- Username: `edugap_user`
- Password: (generate strong password - save it!)
- Click "Create User"

### 4. Network Access
- Click "Network Access" (left sidebar)
- Click "Add IP Address"
- Click "Allow Access from Anywhere" (`0.0.0.0/0`)
- Click "Confirm"

### 5. Get Connection String
- Click "Database" (left sidebar)
- Click "Connect" on your cluster
- Click "Connect your application"
- Copy the connection string:
  ```
  mongodb+srv://edugap_user:<password>@cluster0.xxxxx.mongodb.net/edugap?retryWrites=true&w=majority
  ```
- Replace `<password>` with your actual password

### 6. Add to Amplify
- Go to Amplify Console
- Click your app name
- Click "Environment variables" (left sidebar)
- Click "Manage variables"
- Add new variable:
  - **Key**: `MONGODB_URI`
  - **Value**: Your connection string (with password)
- Click "Save"
- Amplify will automatically redeploy

**Note**: This is completely optional! Your app works great without it.

---

## 🆘 Troubleshooting

### Build Failed?

1. **Check Build Logs**:
   - In Amplify Console, click on the failed build
   - Click "Build logs"
   - Look for error messages

2. **Common Issues**:
   - **Node version**: Should be 18+ (Amplify handles this)
   - **Missing dependencies**: Run `npm install` locally
   - **Build fails locally**: Test with `npm run build`

3. **Solution**:
   ```bash
   # Test locally first
   npm run build
   
   # If it works, push again
   git add .
   git commit -m "Fix build"
   git push
   ```

### App Not Loading?

1. Check deployment status is "Deployed" (green checkmark)
2. Verify URL is correct
3. Try opening in incognito/private window
4. Check browser console for errors (F12)

### Wrong Region?

If you accidentally created in wrong region:
1. Delete the app in Amplify
2. Switch to **us-east-1** (top-right)
3. Start over from Step 3

---

## 📊 What You've Deployed

- **Frontend**: Next.js 16 with TypeScript
- **Backend**: API Routes (analyze, remediate, saveResult)
- **UI**: Modern design with animations
- **Features**: 
  - Login & Profile
  - Diagnostic Quiz (5 questions)
  - Dashboard with risk analysis
  - Remediation content
  - AI Chatbot
- **Database**: Optional MongoDB
- **Hosting**: AWS Amplify (us-east-1)
- **Cost**: $0/month (free tier)

---

## 🎯 Next Steps

1. ✅ Share your live URL with team
2. ✅ Test all features thoroughly
3. ✅ Prepare demo presentation
4. ✅ Add MongoDB if needed (optional)
5. ✅ Practice your demo flow

---

## 📞 Need Help?

- **Amplify Docs**: https://docs.amplify.aws/
- **Hackathon Organizers**: Contact for AWS issues
- **Detailed Guide**: See `AWS_HACKATHON_DEPLOYMENT.md`

---

## 🎉 Congratulations!

Your EduGap application is now **LIVE ON AWS**! 🚀

**Live URL**: `https://main.dXXXXXXXXXX.amplifyapp.com`

Share it with your team and get ready to demo! 🎯
