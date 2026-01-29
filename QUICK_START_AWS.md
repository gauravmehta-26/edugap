# 🚀 Quick Start - Deploy to AWS in 15 Minutes

## Your AWS Hackathon Credentials

- **Console**: https://284333427150.signin.aws.amazon.com/console
- **Username**: Your email
- **Password**: IBMAWS@2026 (change on first login)
- **Region**: us-east-1 (N. Virginia)

---

## ⚡ 3-Step Deployment

### Step 1: Push to GitHub (5 minutes)

```bash
# Initialize Git
git init
git add .
git commit -m "Deploy EduGap to AWS"

# Push to GitHub (create repo first on github.com)
git remote add origin https://github.com/YOUR_USERNAME/edugap.git
git branch -M main
git push -u origin main
```

### Step 2: Deploy on AWS Amplify (5 minutes)

1. **Login**: https://284333427150.signin.aws.amazon.com/console
2. **Search**: Type "Amplify" in search bar
3. **Create**: Click "New app" → "Host web app"
4. **Connect**: Select GitHub → Choose your repo → Select main branch
5. **Deploy**: Click "Save and deploy"

### Step 3: Wait & Test (5 minutes)

1. **Wait**: Amplify builds your app (~5-10 minutes)
2. **Get URL**: Copy your app URL (e.g., `https://main.d123.amplifyapp.com`)
3. **Test**: Open URL and test the app!

---

## ✅ That's It!

Your app is now live on AWS! 🎉

### Your Live App Features:
- ✅ Login page
- ✅ Profile with subject selection
- ✅ Diagnostic quiz (5 questions)
- ✅ Dashboard with failure risk analysis
- ✅ Remediation content
- ✅ AI Chatbot

---

## 🗄️ Optional: Add MongoDB (5 minutes)

If you want to save quiz results:

1. **Create MongoDB Atlas**: https://www.mongodb.com/cloud/atlas/register
2. **Free Cluster**: Choose M0 tier in US East
3. **Get Connection String**: Copy from Atlas
4. **Add to Amplify**:
   - Go to Amplify Console
   - Click "Environment variables"
   - Add: `MONGODB_URI` = your connection string
   - Redeploy

**Note**: App works perfectly WITHOUT MongoDB (uses mock data)

---

## 🧪 Test Your Deployment

```bash
# Test health endpoint
curl https://your-url.amplifyapp.com/api/health

# Should return: {"status":"ok",...}
```

### Manual Test Flow:
1. Login → Enter email
2. Profile → Select Physics
3. Quiz → Answer 5 questions
4. Dashboard → See your results
5. Remediation → Click "Fix Now"
6. Chatbot → Ask a question

---

## 📊 What You've Deployed

- **Frontend**: Next.js 16 with TypeScript
- **Backend**: API Routes for quiz analysis
- **UI**: Modern design with animations
- **Features**: Quiz, Dashboard, Remediation, Chatbot
- **Database**: Optional MongoDB integration
- **Hosting**: AWS Amplify (us-east-1)
- **Cost**: $0/month (free tier)

---

## 🆘 Quick Troubleshooting

### Build Fails?
- Check build logs in Amplify Console
- Verify Node version (should be 18+)
- Test locally: `npm run build`

### App Not Loading?
- Check deployment status in Amplify
- Verify URL is correct
- Check browser console for errors

### Need Help?
- See `AWS_HACKATHON_DEPLOYMENT.md` for detailed guide
- Contact hackathon organizers

---

## 🎯 Next Steps

1. ✅ Share your live URL with team
2. ✅ Test all features
3. ✅ Prepare demo presentation
4. ✅ Add MongoDB if needed
5. ✅ Customize content for your demo

---

**Congratulations! Your EduGap app is live on AWS! 🚀**

**Live URL**: `https://main.dXXXXXXXXXX.amplifyapp.com` (get from Amplify Console)
