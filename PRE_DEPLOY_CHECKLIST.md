# ✅ Pre-Deployment Checklist

## Before You Deploy to AWS

### 1. AWS Credentials Setup (5 minutes)

**Create Access Keys:**

1. Login to AWS Console: https://284333427150.signin.aws.amazon.com/console
2. Username: Your email
3. Password: `IBMAWS@2026` (change on first login)
4. Click your username (top-right) → **Security credentials**
5. Scroll to **Access keys** section
6. Click **Create access key**
7. Select **Command Line Interface (CLI)**
8. Click **Next** → **Create access key**
9. **SAVE THESE** (you'll need them):
   - Access Key ID: `AKIAXXXXXXXXXXXXXXXX`
   - Secret Access Key: `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

### 2. Configure Environment Variables

**For Amplify Deployment:**

When deploying to Amplify, you'll add these as environment variables in the Amplify Console:

```
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<your_access_key_from_step_1>
AWS_SECRET_ACCESS_KEY=<your_secret_key_from_step_1>
NODE_ENV=production
```

**Optional (MongoDB):**
```
MONGODB_URI=<your_mongodb_connection_string>
```

### 3. Verify Model Access

**CRITICAL**: Your app uses **Amazon Nova Pro** model (`amazon.nova-pro-v1:0`)

**Check Model Access:**

1. Go to AWS Console → Search "Bedrock"
2. Click **Amazon Bedrock**
3. Left sidebar → **Model access**
4. Verify **Amazon Nova Pro** is **Available** (green checkmark)
5. If not available:
   - Click **Manage model access**
   - Check **Amazon Nova Pro**
   - Click **Request model access**
   - Wait 1-2 minutes for approval

**Allowed Models** (per hackathon rules):
- ✅ Amazon Nova Premier - `amazon.nova-premier-v1:0`
- ✅ Amazon Nova Pro - `amazon.nova-pro-v1:0` (currently used)
- ✅ Amazon Nova Lite - `amazon.nova-lite-v1:0`
- ✅ Amazon Titan Text Large - `amazon.titan-tg1-large`
- ❌ Anthropic Claude (BLOCKED)
- ❌ Meta Llama (BLOCKED)
- ❌ Cohere (BLOCKED)

### 4. Test Build Locally

```bash
# Install dependencies
npm install

# Test build
npm run build

# Should complete successfully with no errors
```

### 5. Push to GitHub

```bash
# Initialize Git (if not done)
git init

# Add all files
git add .

# Commit
git commit -m "Ready for AWS deployment with Nova Pro"

# Create GitHub repo and push
git remote add origin https://github.com/YOUR_USERNAME/edugap.git
git branch -M main
git push -u origin main
```

### 6. Deploy to AWS Amplify

Follow the complete guide in: **`DEPLOY_NOW.md`**

**Quick Steps:**
1. AWS Console → Search "Amplify"
2. Click **New app** → **Host web app**
3. Connect GitHub → Select `edugap` repo
4. Add environment variables (from Step 2)
5. Click **Save and deploy**
6. Wait 5-10 minutes
7. Get your live URL!

---

## ⚠️ Common Issues

### Issue: "Model not found" error

**Solution:**
- Go to Bedrock → Model access
- Request access to Amazon Nova Pro
- Wait 1-2 minutes

### Issue: "Access Denied" error

**Solution:**
- Verify your Access Key ID and Secret Key are correct
- Check they're added to Amplify environment variables
- Ensure you're in `us-east-1` region

### Issue: Build fails in Amplify

**Solution:**
- Check build logs in Amplify Console
- Verify `npm run build` works locally
- Ensure all dependencies are in `package.json`

---

## 🎯 Ready to Deploy?

If you've completed all steps above:

1. ✅ AWS credentials created
2. ✅ Model access verified (Nova Pro)
3. ✅ Build tested locally
4. ✅ Code pushed to GitHub

**→ Follow `DEPLOY_NOW.md` for deployment!**

---

## 📞 Need Help?

- **Deployment Guide**: `DEPLOY_NOW.md`
- **Hackathon Guide**: `AWS_HACKATHON_DEPLOYMENT.md`
- **AWS Docs**: https://docs.aws.amazon.com/amplify/
- **Bedrock Docs**: https://docs.aws.amazon.com/bedrock/

---

**Estimated Total Time**: 20-25 minutes
- AWS Setup: 5 min
- GitHub Push: 5 min
- Amplify Deployment: 10-15 min

🚀 **Let's deploy!**
