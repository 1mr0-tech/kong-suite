# Kong Suite - Deployment Guide

**Date:** February 1, 2026

---

## 🚨 IMPORTANT: Fix Git Permissions First

The `.git` directory is owned by root, which prevents git operations. Run this command to fix it:

```bash
cd /Users/imranroshan/Documents/personal-projects/kong-suite
sudo chown -R imranroshan:staff .git/
```

After entering your password, git operations will work normally.

---

## 📦 Files Ready for Commit

### New Files Created Today
- ✅ `COMPREHENSIVE-FLOW-BUILDER-PLAN.md` - Complete product vision and planning
- ✅ `CONNECTION-IMPROVEMENTS.md` - Connection system improvements documentation
- ✅ `FIXES-2026-02-01.md` - Detailed bug fixes from today
- ✅ `IMPLEMENTED-FEATURES.md` - Comprehensive feature guide
- ✅ `KONG-ARCHITECTURE.md` - Kong entity relationships
- ✅ `KONG-CONNECTION-MODEL.md` - Technical connection model
- ✅ `PROJECT-STATUS.md` - Complete project status (what's done, what's to-do)
- ✅ `DEPLOYMENT-GUIDE.md` - This file
- ✅ `frontend/src/components/FlowBuilder/DeletableEdge.tsx` - Edge deletion component
- ✅ `frontend/src/components/FlowBuilder/DemoGallery.tsx` - Demo flows gallery UI
- ✅ `frontend/src/data/demos/*.json` - 5 professional demo flows
- ✅ `frontend/src/services/demoService.ts` - Demo management service
- ✅ `frontend/src/types/demo.ts` - Demo flow types

### Modified Files
- ✅ `.gitignore` - Updated to exclude Claude docs and sensitive data
- ✅ `backend/src/services/flow-generator/DeckGenerator.ts` - Plugin instance generation
- ✅ `frontend/src/components/FlowBuilder/*` - Various UI improvements
- ✅ `frontend/src/utils/connectionValidator.ts` - Fixed validation logic
- ✅ Multiple form components with enhanced UX

---

## 🔒 Security: What's Excluded from Git

The `.gitignore` now excludes:
- ✅ Claude AI session files (`.claude/`, `SESSION-*.md`)
- ✅ Environment variables (`.env`, `.env.local`)
- ✅ Secrets and credentials (`*.key`, `*.pem`, `secrets/`)
- ✅ Temporary logs (`*.log`, `*-debug.log`)
- ✅ Local configuration files (`*.local.json`)
- ✅ Kong temp files (`kong-config-*.yaml`)
- ✅ Node modules and build outputs

**SAFE TO COMMIT** - No sensitive data will be pushed to GitHub.

---

## 📤 Push to GitHub

### Step 1: Fix Permissions (if needed)
```bash
cd /Users/imranroshan/Documents/personal-projects/kong-suite
sudo chown -R imranroshan:staff .git/
```

### Step 2: Stage All Changes
```bash
git add .
```

### Step 3: Commit with Meaningful Message
```bash
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

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"
```

### Step 4: Add Remote (if not already added)
```bash
git remote add origin git@github.com:1mr0-tech/kong-suite.git
```

Or if remote already exists:
```bash
git remote set-url origin git@github.com:1mr0-tech/kong-suite.git
```

### Step 5: Push to GitHub
```bash
git push -u origin main
```

If you encounter "Updates were rejected" error:
```bash
git pull origin main --rebase
git push -u origin main
```

---

## 🚀 Deploy to Vercel

### Option 1: Vercel CLI (Recommended)

#### Install Vercel CLI
```bash
npm install -g vercel
```

#### Login to Vercel
```bash
vercel login
```

#### Deploy Frontend
```bash
cd frontend
vercel --prod
```

Follow the prompts:
- Set up and deploy? **Yes**
- Which scope? **Select your account**
- Link to existing project? **No** (first time)
- What's your project's name? **kong-suite**
- In which directory is your code located? **./frontend**
- Want to modify settings? **Yes**
- Output directory? **dist**
- Build command? **npm run build**

### Option 2: Vercel GitHub Integration (Easier)

1. **Push to GitHub** (follow steps above)

2. **Go to Vercel Dashboard**
   - Visit: https://vercel.com/dashboard
   - Click "Add New Project"

3. **Import Repository**
   - Select "Import Git Repository"
   - Choose: `1mr0-tech/kong-suite`
   - Click "Import"

4. **Configure Project**
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend`
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

5. **Environment Variables** (if needed)
   - Add any required env vars
   - Click "Add" for each variable

6. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Get your production URL: `https://kong-suite.vercel.app`

---

## 🔧 Backend Deployment Options

### Option 1: Vercel Serverless Functions

Convert Express routes to Vercel serverless functions:

1. Create `api/` directory in root:
```bash
mkdir -p api
```

2. Create serverless functions:
```javascript
// api/flows/generate.js
export default async function handler(req, res) {
  // Your flow generation logic
}
```

3. Update `vercel.json`:
```json
{
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" }
  ]
}
```

### Option 2: Separate Backend Deployment (Recommended)

Deploy backend separately on:
- **Railway:** https://railway.app
- **Render:** https://render.com
- **Fly.io:** https://fly.io
- **Heroku:** https://heroku.com

**Railway Example:**
```bash
cd backend
railway login
railway init
railway up
```

### Option 3: Hybrid (Frontend on Vercel, Backend on Railway)

1. Deploy frontend to Vercel (see above)
2. Deploy backend to Railway:
```bash
cd backend
railway login
railway init
railway up
```

3. Update frontend env vars:
```
VITE_API_URL=https://your-backend.railway.app
```

4. Redeploy frontend to pick up new env var

---

## 🗄️ Database Setup

### For Production

**Option 1: Vercel Postgres**
```bash
vercel postgres create
```

**Option 2: Railway Postgres**
- Add Postgres plugin in Railway dashboard
- Get connection string from environment variables

**Option 3: Supabase**
- Create project at https://supabase.com
- Get connection string
- Add as environment variable

### Environment Variables Needed
```env
# Backend
DATABASE_URL=postgresql://...
KONG_ADMIN_URL=http://your-kong-instance:8001
PORT=3001

# Frontend
VITE_API_URL=https://your-backend-url.com
```

---

## 🧪 Test Deployment

### After Deploying Frontend
1. Visit your Vercel URL
2. Test demo flows:
   - Click "Demo Flows"
   - Load "Simple API Gateway"
   - Click "View YAML"
   - Verify YAML generation works

### After Deploying Backend
1. Test health endpoint:
```bash
curl https://your-backend-url.com/health
```

2. Test YAML generation:
```bash
curl -X POST https://your-backend-url.com/api/flows/generate \
  -H "Content-Type: application/json" \
  -d '{"nodes":[],"edges":[]}'
```

---

## 📋 Pre-Deployment Checklist

### Code
- [x] All features tested locally
- [x] No console errors in browser
- [x] YAML generation working
- [x] Demo flows loading correctly
- [x] Connection validation working

### Security
- [x] `.gitignore` updated
- [x] No API keys in code
- [x] Environment variables used for secrets
- [x] CORS configured properly

### Documentation
- [x] README updated
- [x] PROJECT-STATUS.md complete
- [x] Deployment guide created
- [x] Feature documentation complete

### Git
- [ ] Permissions fixed (`sudo chown` command)
- [ ] All changes staged
- [ ] Commit message written
- [ ] Pushed to GitHub

### Deployment
- [ ] Vercel project created
- [ ] Frontend deployed
- [ ] Backend deployed (if needed)
- [ ] Environment variables set
- [ ] Production URL tested

---

## 🎯 Quick Deploy Commands

```bash
# 1. Fix git permissions
sudo chown -R imranroshan:staff .git/

# 2. Commit and push
git add .
git commit -m "feat: Add educational features and demo flows

- Plugin scope visualization
- 5 professional demo flows
- Demo gallery with search/filter
- Comprehensive documentation
- Bug fixes and improvements

Co-Authored-By: Claude Opus 4.5 <noreply@anthropic.com>"

git push -u origin main

# 3. Deploy to Vercel (from frontend directory)
cd frontend
npx vercel --prod
```

---

## 🆘 Troubleshooting

### Git Permission Denied
```bash
sudo chown -R imranroshan:staff .git/
```

### Vercel Build Fails
- Check build logs in Vercel dashboard
- Verify `package.json` scripts
- Ensure all dependencies are in `dependencies`, not `devDependencies`

### Backend Connection Issues
- Verify CORS settings in backend
- Check environment variables
- Ensure backend is running and accessible

### YAML Generation Fails
- Check backend logs
- Verify backend is deployed
- Test API endpoint directly with curl

---

## 📞 Support

- **GitHub Issues:** https://github.com/1mr0-tech/kong-suite/issues
- **Documentation:** See markdown files in repository
- **Kong Docs:** https://docs.konghq.com

---

## ✅ Success Criteria

Your deployment is successful when:
- ✅ Frontend loads at Vercel URL
- ✅ Demo flows gallery opens
- ✅ Can load demo flows
- ✅ YAML generation works
- ✅ No console errors
- ✅ All features functional

---

## 🎉 You're Ready!

Kong Suite is production-ready with:
- Professional UI
- 5 comprehensive demo flows
- Educational content
- Production-ready YAML generation
- Complete documentation

Happy deploying! 🚀
