#!/bin/bash

# EduGap Deployment Script
# This script helps deploy to various platforms

echo "🚀 EduGap Deployment Helper"
echo "============================"
echo ""
echo "Choose deployment platform:"
echo "1) AWS Amplify (Recommended)"
echo "2) Vercel"
echo "3) AWS EC2"
echo "4) Docker Build"
echo ""
read -p "Enter choice (1-4): " choice

case $choice in
  1)
    echo ""
    echo "📦 AWS Amplify Deployment"
    echo "========================="
    echo ""
    echo "Steps to deploy to AWS Amplify:"
    echo "1. Ensure code is pushed to GitHub/GitLab/Bitbucket"
    echo "2. Go to: https://console.aws.amazon.com/amplify/"
    echo "3. Click 'New app' → 'Host web app'"
    echo "4. Connect your repository"
    echo "5. Amplify will auto-detect Next.js and use amplify.yml"
    echo "6. Add environment variables (MONGODB_URI if needed)"
    echo "7. Deploy!"
    echo ""
    read -p "Push to Git now? (y/n): " push
    if [ "$push" = "y" ]; then
      git add .
      git commit -m "Deploy to AWS Amplify"
      git push
      echo "✅ Code pushed! Now connect in AWS Amplify Console"
    fi
    ;;
    
  2)
    echo ""
    echo "📦 Vercel Deployment"
    echo "==================="
    echo ""
    echo "Installing Vercel CLI..."
    npm install -g vercel
    echo ""
    echo "Deploying to Vercel..."
    vercel --prod
    ;;
    
  3)
    echo ""
    echo "📦 AWS EC2 Deployment"
    echo "===================="
    echo ""
    read -p "Enter EC2 IP address: " ec2_ip
    read -p "Enter path to SSH key (.pem file): " ssh_key
    echo ""
    echo "Building application..."
    npm run build
    echo ""
    echo "Deploying to EC2..."
    ssh -i "$ssh_key" ubuntu@"$ec2_ip" "mkdir -p ~/edugap"
    scp -i "$ssh_key" -r ./* ubuntu@"$ec2_ip":~/edugap/
    ssh -i "$ssh_key" ubuntu@"$ec2_ip" "cd ~/edugap && npm ci && npm run build && pm2 restart edugap || pm2 start ecosystem.config.js"
    echo "✅ Deployed to EC2!"
    ;;
    
  4)
    echo ""
    echo "🐳 Docker Build"
    echo "==============="
    echo ""
    echo "Building Docker image..."
    docker build -t edugap:latest .
    echo ""
    echo "✅ Docker image built!"
    echo ""
    echo "To run locally:"
    echo "  docker run -p 3000:3000 -e MONGODB_URI='your_uri' edugap:latest"
    echo ""
    echo "To push to registry:"
    echo "  docker tag edugap:latest YOUR_REGISTRY/edugap:latest"
    echo "  docker push YOUR_REGISTRY/edugap:latest"
    ;;
    
  *)
    echo "Invalid choice"
    exit 1
    ;;
esac

echo ""
echo "✅ Deployment process complete!"
