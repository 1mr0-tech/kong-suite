#!/bin/bash

# Kong Suite - Quick Deploy Script
# This script will commit changes and push to GitHub

set -e  # Exit on error

echo "🚀 Kong Suite - Quick Deploy Script"
echo "===================================="
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in Kong Suite root directory"
    echo "Please run this script from: /Users/imranroshan/Documents/personal-projects/kong-suite"
    exit 1
fi

# Step 1: Fix git permissions
echo "📝 Step 1: Fixing git permissions..."
sudo chown -R imranroshan:staff .git/
if [ $? -eq 0 ]; then
    echo "✅ Git permissions fixed"
else
    echo "❌ Failed to fix permissions. You may need to run this script with sudo"
    exit 1
fi

# Step 2: Show git status
echo ""
echo "📊 Step 2: Checking git status..."
git status --short
echo ""

# Step 3: Stage all changes
echo "📦 Step 3: Staging all changes..."
git add .
echo "✅ All changes staged"
echo ""

# Step 4: Commit
echo "💾 Step 4: Creating commit..."
git commit -m "feat: Add comprehensive educational features and demo flows

## Features Added
- Plugin scope visualization with current connections display
- Demo flows gallery with 5 professional examples
- Search and filter functionality for demos
- Step-by-step guides with learning objectives
- Testing instructions and common mistakes
- Connection debugging with detailed logs

## Demo Flows
1. Simple API Gateway (beginner)
2. API with Rate Limiting (beginner)
3. Secured API with Key Auth (intermediate)
4. Multi-Tier Rate Limiting (advanced)
5. Load-Balanced Microservice (intermediate)

## Bug Fixes
- Fixed plugin connection validation logic
- Resolved duplicate connection issues
- Improved single-connection enforcement

## Documentation
- Complete project status and roadmap
- Comprehensive connection model guide
- Deployment and setup instructions
- Educational content for all demos

## Security
- Updated .gitignore to exclude sensitive data
- No API keys or credentials in repository
- Claude session files excluded

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"

echo "✅ Commit created"
echo ""

# Step 5: Push to GitHub
echo "🌍 Step 5: Pushing to GitHub..."
echo "Checking remote..."

# Check if remote exists
if git remote | grep -q "origin"; then
    echo "Remote 'origin' exists"
    git remote set-url origin git@github.com:1mr0-tech/kong-suite.git
else
    echo "Adding remote 'origin'"
    git remote add origin git@github.com:1mr0-tech/kong-suite.git
fi

echo "Pushing to main branch..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🎉 Deployment Complete!"
    echo "===================="
    echo ""
    echo "Next steps:"
    echo "1. Visit: https://github.com/1mr0-tech/kong-suite"
    echo "2. Verify all files are there"
    echo "3. Deploy to Vercel:"
    echo "   cd frontend"
    echo "   npx vercel --prod"
    echo ""
    echo "Or use Vercel GitHub integration:"
    echo "https://vercel.com/new/import?repository-url=https://github.com/1mr0-tech/kong-suite"
    echo ""
else
    echo ""
    echo "⚠️  Push failed. This might be because:"
    echo "1. Remote branch has changes - run: git pull origin main --rebase"
    echo "2. SSH key not set up - check: ssh -T git@github.com"
    echo "3. Repository doesn't exist - create it on GitHub first"
    echo ""
    echo "Try manual push:"
    echo "git pull origin main --rebase"
    echo "git push -u origin main"
fi
