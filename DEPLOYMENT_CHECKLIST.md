# EduGap AWS Deployment Checklist ✅

## Pre-Deployment (Do This First)

### 1. Code Preparation
- [ ] All code committed to Git
- [ ] Build succeeds locally: `npm run build`
- [ ] Dev server works: `npm run dev`
- [ ] No sensitive data in code (API keys, passwords)
- [ ] `.env.local` is in `.gitignore`

### 2. Environment Variables Ready
- [ ] MongoDB URI (if using database)
- [ ] Any API keys needed
- [ ] NODE_ENV=production

### 3. AWS Account Setup
- [ ] AWS account credentials received
- [ ] AWS Console access verified
- [ ] Billing alerts configured (optional but recommended)

---

## Deployment Options (Choose One)

### ⭐ OPTION A: AWS Amplify (RECOMMENDED)

#### Prerequisites
- [ ] Code pushed to GitHub/GitLab/Bitbucket
- [ ] AWS account access

#### Steps
1. [ ] Push code to Git repository
   ```bash
   git init
   git add .
   git commit -m "Initial deployment"
   git remote add origin YOUR_REPO_URL
   git push -u origin main
   ```

2. [ ] Go to AWS Amplify Console
   - URL: https://console.aws.amazon.com/amplify/

3. [ ] Create New App
   - [ ] Click "New app" → "Host web app"
   - [ ] Connect Git repository
   - [ ] Select repository and branch
   - [ ] Amplify auto-detects Next.js (uses `amplify.yml`)

4. [ ] Configure Environment Variables
   - [ ] Add `MONGODB_URI` (if using database)
   - [ ] Add `NODE_ENV=production`

5. [ ] Deploy
   - [ ] Click "Save and deploy"
   - [ ] Wait 5-10 minutes
   - [ ] Note your deployment URL

6. [ ] Test Deployment
   - [ ] Visit homepage
   - [ ] Test `/api/health` endpoint
   - [ ] Complete full user flow (Login → Quiz → Dashboard)

#### Post-Deployment
- [ ] Custom domain configured (optional)
- [ ] SSL certificate active (automatic with Amplify)
- [ ] Monitoring enabled

---

### OPTION B: Vercel (Alternative)

#### Prerequisites
- [ ] Vercel account created
- [ ] Vercel CLI installed: `npm install -g vercel`

#### Steps
1. [ ] Login to Vercel
   ```bash
   vercel login
   ```

2. [ ] Deploy
   ```bash
   vercel --prod
   ```

3. [ ] Add Environment Variables
   ```bash
   vercel env add MONGODB_URI
   ```

4. [ ] Test deployment at provided URL

---

### OPTION C: AWS EC2 (Advanced)

#### Prerequisites
- [ ] EC2 instance launched (t2.micro recommended)
- [ ] Security group configured (ports 22, 80, 443)
- [ ] SSH key pair downloaded (.pem file)

#### Steps
1. [ ] Connect to EC2
   ```bash
   ssh -i your-key.pem ubuntu@YOUR_EC2_IP
   ```

2. [ ] Install Node.js
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   ```

3. [ ] Install PM2
   ```bash
   sudo npm install -g pm2
   ```

4. [ ] Clone Repository
   ```bash
   git clone YOUR_REPO_URL
   cd edugap
   ```

5. [ ] Install Dependencies
   ```bash
   npm ci
   ```

6. [ ] Create Environment File
   ```bash
   nano .env.local
   # Add: MONGODB_URI=your_connection_string
   ```

7. [ ] Build Application
   ```bash
   npm run build
   ```

8. [ ] Start with PM2
   ```bash
   pm2 start ecosystem.config.js
   pm2 save
   pm2 startup
   ```

9. [ ] Configure Nginx (optional)
   ```bash
   sudo apt install -y nginx
   # Configure reverse proxy
   ```

10. [ ] Test deployment at `http://YOUR_EC2_IP`

---

## MongoDB Setup

### Option A: MongoDB Atlas (Recommended)

1. [ ] Create MongoDB Atlas account
   - URL: https://www.mongodb.com/cloud/atlas/register

2. [ ] Create Free Cluster
   - [ ] Choose M0 (free tier)
   - [ ] Select region closest to AWS deployment

3. [ ] Create Database User
   - [ ] Username: `edugap_user`
   - [ ] Strong password generated

4. [ ] Configure Network Access
   - [ ] Add IP: `0.0.0.0/0` (allow all)
   - [ ] Or add specific AWS IP

5. [ ] Get Connection String
   - [ ] Format: `mongodb+srv://user:pass@cluster.mongodb.net/edugap`
   - [ ] Copy to environment variables

### Option B: AWS DocumentDB

1. [ ] Create DocumentDB cluster
2. [ ] Configure security group
3. [ ] Get connection string
4. [ ] Download SSL certificate

---

## Post-Deployment Testing

### Automated Tests
- [ ] Health check: `curl https://your-domain.com/api/health`
- [ ] Analyze API: Test with sample data
- [ ] Remediate API: Test with concept name

### Manual Testing
- [ ] Homepage loads
- [ ] Login flow works
- [ ] Profile page displays
- [ ] Quiz can be completed
- [ ] Dashboard shows results
- [ ] Remediation content loads
- [ ] Chatbot functions
- [ ] Mobile responsive
- [ ] All images/assets load

### Performance Testing
- [ ] Page load time < 3 seconds
- [ ] API response time < 500ms
- [ ] No console errors
- [ ] No broken links

---

## Monitoring & Maintenance

### Set Up Monitoring
- [ ] AWS CloudWatch (for Amplify/EC2)
- [ ] Vercel Analytics (for Vercel)
- [ ] Error tracking configured
- [ ] Uptime monitoring

### Regular Checks
- [ ] Check application logs
- [ ] Monitor database usage
- [ ] Review AWS billing
- [ ] Test critical user flows

---

## Rollback Plan

### If Deployment Fails

#### AWS Amplify
- [ ] Check build logs in Amplify Console
- [ ] Verify environment variables
- [ ] Rollback to previous deployment (one-click)

#### Vercel
- [ ] Check deployment logs
- [ ] Rollback: `vercel rollback`

#### EC2
- [ ] SSH to server
- [ ] Check PM2 logs: `pm2 logs`
- [ ] Restart: `pm2 restart edugap`
- [ ] Rollback code: `git checkout previous-commit`

---

## Common Issues & Solutions

### Build Fails
**Problem**: Build fails during deployment
**Solution**:
- [ ] Test build locally: `npm run build`
- [ ] Check Node version (should be 18+)
- [ ] Clear cache: `rm -rf .next node_modules && npm install`

### API Routes Not Working
**Problem**: API endpoints return 404
**Solution**:
- [ ] Verify environment variables are set
- [ ] Check API route file structure
- [ ] Review deployment logs

### Database Connection Fails
**Problem**: Cannot connect to MongoDB
**Solution**:
- [ ] Verify connection string format
- [ ] Check IP whitelist in MongoDB Atlas
- [ ] Test connection locally first
- [ ] Ensure SSL/TLS settings correct

### Slow Performance
**Problem**: App loads slowly
**Solution**:
- [ ] Enable caching
- [ ] Optimize images
- [ ] Check database queries
- [ ] Review server resources

---

## Security Checklist

- [ ] Environment variables not in code
- [ ] HTTPS enabled (automatic with Amplify/Vercel)
- [ ] Database credentials secure
- [ ] API rate limiting considered
- [ ] CORS configured properly
- [ ] Security headers set

---

## Cost Optimization

### AWS Amplify
- [ ] Monitor build minutes
- [ ] Review data transfer
- [ ] Use free tier efficiently

### EC2
- [ ] Use t2.micro (free tier)
- [ ] Stop instance when not needed
- [ ] Monitor data transfer

### MongoDB Atlas
- [ ] Use M0 free tier
- [ ] Monitor storage usage
- [ ] Set up alerts

---

## Documentation

- [ ] Deployment URL documented
- [ ] Environment variables documented
- [ ] Access credentials stored securely
- [ ] Deployment process documented
- [ ] Team members have access

---

## Final Verification

- [ ] Application accessible at public URL
- [ ] All features working
- [ ] Performance acceptable
- [ ] No errors in logs
- [ ] Team can access
- [ ] Demo ready!

---

## Quick Reference

### Important URLs
- **AWS Amplify Console**: https://console.aws.amazon.com/amplify/
- **AWS EC2 Console**: https://console.aws.amazon.com/ec2/
- **MongoDB Atlas**: https://cloud.mongodb.com/
- **Vercel Dashboard**: https://vercel.com/dashboard

### Important Commands
```bash
# Build locally
npm run build

# Deploy to Vercel
vercel --prod

# Check PM2 status
pm2 status

# View logs
pm2 logs edugap

# Restart app
pm2 restart edugap
```

---

## Support Resources

- **AWS Amplify Docs**: https://docs.amplify.aws/
- **Next.js Deployment**: https://nextjs.org/docs/deployment
- **MongoDB Atlas Docs**: https://docs.atlas.mongodb.com/

---

**✅ Deployment Complete!** Your EduGap application is now live on AWS! 🎉
