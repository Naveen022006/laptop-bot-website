# Bot Website - GitHub Deployment Guide

## Quick Setup for GitHub Pages

### 1. Create a GitHub Repository
```bash
cd bot-website
git init
git add .
git commit -m "Initial commit: Bot website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/bot-website.git
git push -u origin main
```

### 2. Enable GitHub Pages
1. Go to your repository on GitHub
2. Settings → Pages
3. Source: Deploy from branch
4. Branch: main / (root)
5. Click Save

### 3. Your Website Will Be Live At:
`https://YOUR_USERNAME.github.io/bot-website`

---

## Alternative: Deploy to Vercel (Faster)

### 1. Push to GitHub (same as above)

### 2. Go to [vercel.com](https://vercel.com)
1. Click "New Project"
2. Import your bot-website repository
3. Framework: Other (since it's static HTML)
4. Deploy

### 3. Your Website Will Be Live At:
`https://bot-website-XXXX.vercel.app` (custom domain available)

---

## How to Update the Website

### Add a New Command:
1. Edit `pages/features.html`
2. Add the command item in the appropriate category
3. Commit and push to GitHub
4. Changes will auto-deploy

### Update Setup Guide:
1. Edit `pages/setup.html`
2. Modify the steps or troubleshooting section
3. Commit and push

### Change Colors:
1. Edit `css/styles.css`
2. Modify the CSS variables in `:root`
3. Commit and push

---

## File Structure for Reference:
```
bot-website/
├── index.html
├── css/styles.css
├── css/pages.css
├── js/script.js
├── pages/
│   ├── features.html
│   ├── setup.html
│   └── contact.html
└── README.md
```

---

**Status**: Ready for Deployment ✨
