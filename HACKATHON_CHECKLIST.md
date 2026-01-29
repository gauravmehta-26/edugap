# AWS Hackathon Deployment Checklist ✅

## 🎯 Pre-Deployment (5 minutes)

- [ ] **AWS Console Access**
  - [ ] Login URL: https://284333427150.signin.aws.amazon.com/console
  - [ ] Username: Your email
  - [ ] Password: IBMAWS@2026
  - [ ] Password changed on first login
  - [ ] Region set to: **us-east-1** (N. Virginia)

- [ ] **Local Setup**
  - [ ] Code builds successfully: `npm run build` ✅
  - [ ] Dev server works: `npm run dev` ✅
  - [ ] All files committed to Git
  - [ ] No `.env.local` in Git (check `.gitignore`)

- [ ] **GitHub Repository**
  - [ ] GitHub account ready
  - [ ] Repository created: `edugap`
  - [ ] Code pushed to main branch

---

## 🚀 Deployment Steps (10 minutes)

### Step 1: Push to GitHub
- [ ] Git initialized: `git init`
- [ ] Files added: `git add .`
- [ ] Committed: `git commit -m "Deploy to AWS"`
- [ ] Remote added: `git remote add origin YOUR_REPO_URL`
- [ ] Pushed: `git push -u origin main`

### Step 2: AWS Amplify Setup
- [ ] Logged into AWS Console
- [ ] Navigated to AWS Amplify service
- [ ] Region confirmed: **us-east-1**
- [ ] Clicked "New app" → "Host web app"
- [ ] Selected GitHub as provider
- [ ] Authorized AWS Amplify on GitHub

### Step 3: Configure Deployment
- [ ] Selected `edugap` repository
- [ ] Selected `main` branch
- [ ] Build settings auto-detected (Next.js)
- [ ] `amplify.yml` configuration verified
- [ ] App name set: `edugap`

### Step 4: Environment Variables (Optional)
- [ ] Clicked "Advanced settings"
- [ ] Added `NODE_ENV=production`
- [ ] Added `MONGODB_URI` (if using database)
- [ ] Or skipped (app works without MongoDB)

### Step 5: Deploy
- [ ] Clicked "Save and deploy"
- [ ] Deployment started
- [ ] Provision phase completed ✅
- [ ] Build phase completed ✅
- [ ] Deploy phase completed ✅
- [ ] Verify phase completed ✅

---

## 🧪 Testing (5 minutes)

### Automated Tests
- [ ] Health endpoint works:
  ```bash
  curl https://your-url.amplifyapp.com/api/health
  ```
- [ ] Returns: `{"status":"ok",...}`

### Manual Testing
- [ ] **Homepage**: Loads successfully
- [ ] **Login Page**: 
  - [ ] Email input works
  - [ ] "Continue to Dashboard" button works
  - [ ] Redirects to profile page
  
- [ ] **Profile Page**:
  - [ ] Shows 4 subjects (Physics, Math, Chemistry, Biology)
  - [ ] Subject cards are clickable
  - [ ] "Start Learning Journey" button works
  - [ ] Redirects to quiz page
  
- [ ] **Quiz Page**:
  - [ ] Shows 5 questions
  - [ ] Can select answers
  - [ ] Progress bar updates
  - [ ] "Next Question" button works
  - [ ] "Submit Quiz" button works
  - [ ] Redirects to dashboard
  
- [ ] **Dashboard Page**:
  - [ ] Shows failure risk percentage
  - [ ] Shows weak concepts list
  - [ ] "Fix Now" buttons work
  - [ ] Charts display correctly
  - [ ] Chatbot icon visible
  
- [ ] **Remediation Page**:
  - [ ] Loads concept content
  - [ ] Shows explanation, example, tips
  - [ ] "Mark as Fixed" button works
  - [ ] "Back to Dashboard" link works
  
- [ ] **Chatbot**:
  - [ ] Opens when clicked
  - [ ] Can send messages
  - [ ] Receives responses
  - [ ] Can close chatbot

### Responsive Testing
- [ ] Desktop view works
- [ ] Tablet view works (if available)
- [ ] Mobile view works (if available)

### Performance Testing
- [ ] Page loads in < 3 seconds
- [ ] No console errors
- [ ] All images load
- [ ] Animations smooth

---

## 📊 MongoDB Setup (Optional - 5 minutes)

If you want to save quiz results:

- [ ] **MongoDB Atlas Account**
  - [ ] Created account: https://www.mongodb.com/cloud/atlas/register
  - [ ] Email verified

- [ ] **Create Cluster**
  - [ ] Selected M0 (free tier)
  - [ ] Region: US East (N. Virginia)
  - [ ] Cluster name: `edugap-cluster`

- [ ] **Database User**
  - [ ] Username: `edugap_user`
  - [ ] Password: (strong password generated)
  - [ ] User created

- [ ] **Network Access**
  - [ ] IP whitelist: `0.0.0.0/0` added
  - [ ] Access from anywhere enabled

- [ ] **Connection String**
  - [ ] Clicked "Connect" → "Connect your application"
  - [ ] Copied connection string
  - [ ] Format: `mongodb+srv://user:pass@cluster.mongodb.net/edugap`

- [ ] **Add to Amplify**
  - [ ] Opened Amplify Console
  - [ ] Clicked app → "Environment variables"
  - [ ] Added `MONGODB_URI` with connection string
  - [ ] Clicked "Save"
  - [ ] Redeployed app

- [ ] **Test Database**
  - [ ] Completed quiz
  - [ ] Checked MongoDB Atlas for saved result
  - [ ] Or checked health endpoint: `"database":"connected"`

---

## 🎯 Post-Deployment

### Documentation
- [ ] Deployment URL saved: `https://main.dXXXXXXXXXX.amplifyapp.com`
- [ ] MongoDB connection string saved (if used)
- [ ] AWS credentials saved securely
- [ ] Team members have access to URL

### Monitoring
- [ ] Amplify Console bookmarked
- [ ] Build history reviewed
- [ ] Logs checked for errors
- [ ] Metrics reviewed

### Demo Preparation
- [ ] Live URL shared with team
- [ ] Demo flow practiced
- [ ] Backup plan ready (local dev server)
- [ ] Screenshots taken
- [ ] Presentation prepared

---

## 🔄 Continuous Deployment

- [ ] **Automatic Deployment Enabled**
  - [ ] Push to GitHub triggers build
  - [ ] Amplify auto-deploys changes
  - [ ] Tested with small change

- [ ] **Update Process**:
  ```bash
  git add .
  git commit -m "Update feature"
  git push
  # Amplify automatically deploys
  ```

---

## 💰 Cost Tracking

- [ ] **AWS Free Tier**
  - [ ] Amplify: 1000 build minutes/month
  - [ ] Amplify: 15 GB served/month
  - [ ] Current usage: ~5 minutes per build
  - [ ] Estimated cost: $0/month

- [ ] **MongoDB Atlas**
  - [ ] M0 free tier: 512 MB storage
  - [ ] Estimated cost: $0/month

- [ ] **Total Estimated Cost**: $0/month ✅

---

## 🆘 Troubleshooting Checklist

### Build Fails
- [ ] Checked build logs in Amplify Console
- [ ] Verified Node version (18+)
- [ ] Tested build locally: `npm run build`
- [ ] Checked for missing dependencies
- [ ] Verified environment variables

### App Not Loading
- [ ] Checked deployment status (should be "Deployed")
- [ ] Verified URL is correct
- [ ] Checked browser console for errors
- [ ] Tried different browser
- [ ] Cleared browser cache

### API Not Working
- [ ] Checked API route files exist
- [ ] Verified environment variables set
- [ ] Checked Amplify logs
- [ ] Tested API endpoints directly

### Database Issues
- [ ] Verified connection string format
- [ ] Checked IP whitelist in MongoDB Atlas
- [ ] Verified username/password correct
- [ ] Tested connection locally
- [ ] Remembered: App works without DB!

---

## 📞 Support Resources

- [ ] **AWS Amplify Docs**: https://docs.amplify.aws/
- [ ] **Next.js Docs**: https://nextjs.org/docs
- [ ] **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/
- [ ] **Hackathon Organizers**: Contact for AWS issues
- [ ] **Deployment Guides**: 
  - [ ] `AWS_HACKATHON_DEPLOYMENT.md`
  - [ ] `QUICK_START_AWS.md`
  - [ ] `DEPLOYMENT_CHECKLIST.md`

---

## ✅ Final Verification

- [ ] **Application Live**: ✅
- [ ] **All Features Working**: ✅
- [ ] **Performance Good**: ✅
- [ ] **No Errors**: ✅
- [ ] **Team Has Access**: ✅
- [ ] **Demo Ready**: ✅

---

## 🎉 Success Criteria

Your deployment is successful when:
- ✅ App accessible via public URL
- ✅ All pages load correctly
- ✅ Quiz flow works end-to-end
- ✅ Dashboard shows results
- ✅ Remediation content displays
- ✅ Chatbot functions
- ✅ No console errors
- ✅ Performance acceptable
- ✅ Ready for demo!

---

**Deployment Status**: 
- [ ] Not Started
- [ ] In Progress
- [ ] Completed ✅
- [ ] Tested ✅
- [ ] Demo Ready ✅

**Live URL**: `_______________________________`

**Deployed By**: `_______________________________`

**Date**: `_______________________________`

---

**🎉 Congratulations! Your EduGap app is live on AWS! 🚀**
