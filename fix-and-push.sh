#!/bin/bash

# Kong Suite - Fix Permissions and Push to Git
# This script will remove .md files from git (except README.md) and push

set -e

echo "🚀 Kong Suite - Fix and Push to GitHub"
echo "======================================"
echo ""

# Step 1: Fix git permissions
echo "📝 Step 1: Fixing git permissions..."
echo "You'll need to enter your password:"
sudo chown -R imranroshan:staff .git/

if [ $? -eq 0 ]; then
    echo "✅ Git permissions fixed"
else
    echo "❌ Failed to fix permissions"
    exit 1
fi

echo ""

# Step 2: Update .gitignore (already done)
echo "📝 Step 2: Updated .gitignore to exclude *.md except README.md"
echo "✅ .gitignore updated"
echo ""

# Step 3: Remove tracked .md files except README.md
echo "📝 Step 3: Removing markdown files from git (keeping local copies)..."
git rm --cached SETUP.md 2>/dev/null || echo "SETUP.md not tracked"
git rm --cached scripts/README.md 2>/dev/null || echo "scripts/README.md not tracked"

# Remove any other .md files that might be tracked
find . -name "*.md" -type f ! -name "README.md" ! -path "*/node_modules/*" ! -path "*/.git/*" -exec git rm --cached {} \; 2>/dev/null || true

echo "✅ Markdown files removed from git tracking (local files preserved)"
echo ""

# Step 4: Stage .gitignore change
echo "📝 Step 4: Staging .gitignore..."
git add .gitignore
echo "✅ .gitignore staged"
echo ""

# Step 5: Stage all other changes
echo "📝 Step 5: Staging all changes..."
git add .
echo "✅ All changes staged"
echo ""

# Step 6: Show what will be committed
echo "📊 Step 6: Files to be committed:"
git status --short
echo ""

# Step 7: Commit
echo "📝 Step 7: Creating commit..."
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
- Excluded all .md files from repo except README.md
- Updated .gitignore for better security

## Code Changes
- Updated plugin form with auto-save on blur
- Enhanced YAML generator
- Improved connection validator
- Added demo gallery UI components

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"

if [ $? -eq 0 ]; then
    echo "✅ Commit created"
else
    echo "⚠️  Commit failed or nothing to commit"
fi

echo ""

# Step 8: Set remote
echo "📝 Step 8: Setting up remote..."
if git remote | grep -q "origin"; then
    git remote set-url origin git@github.com:1mr0-tech/kong-suite.git
    echo "✅ Remote updated"
else
    git remote add origin git@github.com:1mr0-tech/kong-suite.git
    echo "✅ Remote added"
fi

echo ""

# Step 9: Push to GitHub
echo "📝 Step 9: Pushing to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Successfully pushed to GitHub!"
    echo ""
    echo "🎉 Deployment Complete!"
    echo "===================="
    echo ""
    echo "✅ All code changes pushed"
    echo "✅ Only README.md included in repo"
    echo "✅ All other .md files excluded (kept locally)"
    echo ""
    echo "Next: Deploy to Vercel"
    echo "  cd frontend"
    echo "  npx vercel --prod"
    echo ""
else
    echo ""
    echo "⚠️  Push failed. Trying to pull and rebase..."
    git pull origin main --rebase

    if [ $? -eq 0 ]; then
        echo "✅ Rebased successfully, pushing again..."
        git push -u origin main

        if [ $? -eq 0 ]; then
            echo "✅ Successfully pushed!"
        else
            echo "❌ Push still failed. Please check the error above."
            exit 1
        fi
    else
        echo "❌ Rebase failed. Please resolve conflicts manually."
        exit 1
    fi
fi
