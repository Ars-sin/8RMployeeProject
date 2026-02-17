# Deployment Guide - 8RM Employee Management System

This guide covers multiple deployment options for your Employee Management System.

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended - Easiest)
**Best for:** Quick deployment, automatic HTTPS, free tier available

#### Frontend (React App)
1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy Frontend:**
   ```bash
   cd 8RMployeeProject
   vercel
   ```

4. **Follow prompts:**
   - Set up and deploy? Yes
   - Which scope? Your account
   - Link to existing project? No
   - Project name? 8rm-employee-system
   - Directory? ./
   - Override settings? No

5. **Production deployment:**
   ```bash
   vercel --prod
   ```

#### Backend (API Server)
1. **Deploy API separately:**
   ```bash
   cd 8RMployeeProject/api
   vercel
   ```

2. **Update environment variables in Vercel dashboard:**
   - Go to project settings → Environment Variables
   - Add all variables from `.env`

3. **Update API URL in frontend:**
   - Update `8RMployeeProject/src/OTPService.js`
   - Change `API_BASE_URL` to your Vercel API URL

**Pros:** Free, automatic HTTPS, easy updates, great performance
**Cons:** Serverless (cold starts for API)

---

### Option 2: Netlify
**Best for:** Static sites with serverless functions

#### Frontend Deployment
1. **Install Netlify CLI:**
   ```bash
   npm install -g netlify-cli
   ```

2. **Build the app:**
   ```bash
   cd 8RMployeeProject
   npm run build
   ```

3. **Deploy:**
   ```bash
   netlify deploy --prod
   ```

4. **Or use Netlify Dashboard:**
   - Go to https://app.netlify.com
   - Drag and drop the `dist` folder

#### Backend (API)
- Convert to Netlify Functions or deploy separately on Heroku/Railway

**Pros:** Free tier, easy to use, automatic HTTPS
**Cons:** Need to convert API to serverless functions

---

### Option 3: Firebase Hosting + Cloud Functions
**Best for:** Already using Firebase, integrated solution

#### Setup
1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Login:**
   ```bash
   firebase login
   ```

3. **Initialize:**
   ```bash
   cd 8RMployeeProject
   firebase init
   ```
   - Select: Hosting, Functions
   - Use existing project: rm-employee-system
   - Public directory: dist
   - Single-page app: Yes

4. **Build frontend:**
   ```bash
   npm run build
   ```

5. **Deploy:**
   ```bash
   firebase deploy
   ```

**Pros:** Integrated with Firebase, good performance, free tier
**Cons:** More complex setup, learning curve

---

### Option 4: Heroku
**Best for:** Full-stack deployment, traditional hosting

#### Frontend + Backend Together
1. **Install Heroku CLI:**
   ```bash
   npm install -g heroku
   ```

2. **Login:**
   ```bash
   heroku login
   ```

3. **Create app:**
   ```bash
   heroku create 8rm-employee-system
   ```

4. **Add buildpacks:**
   ```bash
   heroku buildpacks:add heroku/nodejs
   ```

5. **Set environment variables:**
   ```bash
   heroku config:set SMTP_HOST=smtp.gmail.com
   heroku config:set SMTP_USER=your-email@gmail.com
   # ... add all env variables
   ```

6. **Deploy:**
   ```bash
   git push heroku main
   ```

**Pros:** Easy full-stack deployment, free tier (with limitations)
**Cons:** Free tier sleeps after 30 min inactivity, paid plans can be expensive

---

### Option 5: Railway
**Best for:** Modern alternative to Heroku, better free tier

1. **Go to:** https://railway.app
2. **Connect GitHub repository**
3. **Deploy automatically**
4. **Add environment variables in dashboard**

**Pros:** Better free tier than Heroku, automatic deployments
**Cons:** Newer platform, smaller community

---

### Option 6: DigitalOcean App Platform
**Best for:** Scalable production apps

1. **Go to:** https://cloud.digitalocean.com/apps
2. **Create new app**
3. **Connect GitHub repository**
4. **Configure:**
   - Build command: `npm run build`
   - Run command: `npm start`
5. **Add environment variables**
6. **Deploy**

**Pros:** Good performance, scalable, $5/month starter
**Cons:** Not free, requires payment method

---

### Option 7: AWS (Advanced)
**Best for:** Enterprise, full control, scalability

#### Using AWS Amplify (Frontend)
1. **Go to:** AWS Amplify Console
2. **Connect repository**
3. **Configure build settings**
4. **Deploy**

#### Using AWS EC2 (Backend)
1. **Launch EC2 instance**
2. **Install Node.js**
3. **Clone repository**
4. **Install dependencies**
5. **Use PM2 for process management**
6. **Configure nginx as reverse proxy**

**Pros:** Enterprise-grade, highly scalable, full control
**Cons:** Complex, expensive, requires DevOps knowledge

---

### Option 8: Self-Hosted (VPS)
**Best for:** Full control, custom requirements

#### Using VPS (DigitalOcean, Linode, Vultr)
1. **Create VPS instance**
2. **SSH into server:**
   ```bash
   ssh root@your-server-ip
   ```

3. **Install Node.js:**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

4. **Install PM2:**
   ```bash
   npm install -g pm2
   ```

5. **Clone repository:**
   ```bash
   git clone your-repo-url
   cd 8RMployeeProject
   ```

6. **Install dependencies:**
   ```bash
   npm install
   cd api && npm install
   ```

7. **Build frontend:**
   ```bash
   npm run build
   ```

8. **Start API with PM2:**
   ```bash
   cd api
   pm2 start server.js --name "8rm-api"
   ```

9. **Install nginx:**
   ```bash
   sudo apt install nginx
   ```

10. **Configure nginx:**
    ```nginx
    server {
        listen 80;
        server_name your-domain.com;

        # Frontend
        location / {
            root /path/to/8RMployeeProject/dist;
            try_files $uri $uri/ /index.html;
        }

        # API
        location /api {
            proxy_pass http://localhost:3002;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_cache_bypass $http_upgrade;
        }
    }
    ```

11. **Setup SSL with Let's Encrypt:**
    ```bash
    sudo apt install certbot python3-certbot-nginx
    sudo certbot --nginx -d your-domain.com
    ```

**Pros:** Full control, cost-effective for multiple apps
**Cons:** Requires server management, security updates

---

## 📋 Pre-Deployment Checklist

### 1. Environment Variables
- [ ] Update Firebase credentials
- [ ] Update SMTP credentials
- [ ] Change admin password
- [ ] Update API URLs
- [ ] Set production session secrets

### 2. Security
- [ ] Update Firestore security rules for production
- [ ] Update Storage security rules
- [ ] Enable CORS only for your domain
- [ ] Use HTTPS everywhere
- [ ] Secure environment variables

### 3. Firebase Configuration
- [ ] Update Firestore rules (remove `allow read, write: if true`)
- [ ] Set up Firebase Authentication (optional)
- [ ] Configure Firebase Storage rules
- [ ] Set up backup strategy

### 4. Testing
- [ ] Test all login flows (Admin, HR, Accounting)
- [ ] Test OTP email delivery
- [ ] Test employee CRUD operations
- [ ] Test on mobile devices
- [ ] Test different browsers

### 5. Performance
- [ ] Optimize images
- [ ] Enable caching
- [ ] Minify assets (done by build)
- [ ] Test loading speed

---

## 🔒 Production Security Checklist

### Update Firestore Rules:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /employees/{employeeId} {
      // Only authenticated users can read/write
      allow read, write: if request.auth != null;
    }
  }
}
```

### Update Storage Rules:
```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /contracts/{fileName} {
      // Only authenticated users can upload/download
      allow read, write: if request.auth != null;
    }
  }
}
```

### Update CORS in API:
```javascript
app.use(cors({
  origin: 'https://your-production-domain.com',
  credentials: true
}));
```

### Change Admin Credentials:
Update in `src/services/authService.js`:
```javascript
const ADMIN_CREDENTIALS = {
  email: 'admin@your-company.com',
  password: 'StrongPassword123!'
};
```

---

## 🎯 Recommended Deployment Strategy

### For Small Business / Startup:
**Frontend:** Vercel (Free)
**Backend:** Railway (Free tier)
**Database:** Firebase (Free tier)
**Total Cost:** $0/month

### For Growing Business:
**Frontend:** Vercel (Pro - $20/month)
**Backend:** Railway ($5-10/month)
**Database:** Firebase (Blaze plan - pay as you go)
**Total Cost:** ~$30-40/month

### For Enterprise:
**Frontend:** AWS Amplify
**Backend:** AWS EC2 / ECS
**Database:** Firebase or AWS RDS
**Total Cost:** $100+/month (scalable)

---

## 📞 Post-Deployment

1. **Monitor application:**
   - Set up error tracking (Sentry)
   - Monitor uptime (UptimeRobot)
   - Check Firebase usage

2. **Backup strategy:**
   - Regular Firestore backups
   - Database export schedule
   - Code repository backups

3. **Updates:**
   - Keep dependencies updated
   - Monitor security advisories
   - Regular testing

4. **Support:**
   - Document admin procedures
   - Train client on system usage
   - Provide maintenance plan

---

## 🆘 Troubleshooting

### API not connecting:
- Check API URL in `OTPService.js`
- Verify CORS settings
- Check environment variables

### OTP not sending:
- Verify SMTP credentials
- Check Gmail App Password
- Test email service separately

### Firebase errors:
- Check Firestore rules
- Verify Firebase config
- Check API keys

### Build errors:
- Clear node_modules: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`
- Check Node.js version: `node -v` (should be 16+)

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Firebase Hosting](https://firebase.google.com/docs/hosting)
- [Railway Documentation](https://docs.railway.app)
- [DigitalOcean Tutorials](https://www.digitalocean.com/community/tutorials)

---

**Need Help?** Contact your development team for deployment assistance.
