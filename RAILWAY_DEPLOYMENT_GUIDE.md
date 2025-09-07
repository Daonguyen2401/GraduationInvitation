# 🚀 Hướng Dẫn Deploy Lên Railway

## 📋 **Tổng Quan**
Railway là platform tốt nhất cho project này vì:
- ✅ Hỗ trợ **Canvas** và **Nodemailer** 
- ✅ **Native dependencies** được cài đặt tự động
- ✅ **Docker containers** với full system access
- ✅ **Environment variables** dễ quản lý
- ✅ **Auto-deploy** từ GitHub

## 🔧 **Cách 1: Deploy Qua Web Interface (Recommended)**

### **Bước 1: Chuẩn Bị Code**
```bash
# 1. Push code lên GitHub (nếu chưa có)
git add .
git commit -m "Prepare for Railway deployment"
git push origin main

# 2. Đảm bảo có file railway.json
# ✅ Đã tạo: railway.json
```

### **Bước 2: Tạo Project Trên Railway**
1. Truy cập: https://railway.app
2. Đăng nhập bằng GitHub
3. Click **"New Project"**
4. Chọn **"Deploy from GitHub repo"**
5. Chọn repository của bạn
6. Railway sẽ tự động detect Next.js

### **Bước 3: Cấu Hình Environment Variables**
Trong Railway Dashboard, thêm các biến:

```bash
# Email Configuration
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASS=your-app-password

# Supabase Configuration  
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# Next.js Configuration
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.railway.app
```

### **Bước 4: Deploy**
1. Railway sẽ tự động build và deploy
2. Chờ build hoàn thành (5-10 phút)
3. Truy cập URL được cung cấp

## 🛠️ **Cách 2: Deploy Qua CLI (Nếu có vấn đề kết nối)**

### **Bước 1: Cài Đặt Railway CLI**
```bash
# Cài đặt Railway CLI
npm install -g @railway/cli

# Đăng nhập
railway login
```

### **Bước 2: Tạo Project**
```bash
# Tạo project mới
railway init

# Tạo service
railway service create
```

### **Bước 3: Thiết Lập Environment Variables**
```bash
# Thêm environment variables
railway variables set EMAIL_USER=your-gmail@gmail.com
railway variables set EMAIL_PASS=your-app-password
railway variables set NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
railway variables set NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### **Bước 4: Deploy**
```bash
# Deploy project
railway up
```

## 📁 **Files Cần Thiết**

### **1. railway.json** ✅
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### **2. next.config.mjs** ✅
```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Remove static export for Railway deployment
  // output: 'export',
  trailingSlash: true,
}

export default nextConfig
```

### **3. package.json** ✅
```json
{
  "scripts": {
    "build": "next build",
    "start": "next start",
    "dev": "next dev"
  }
}
```

## 🔑 **Environment Variables Cần Thiết**

| Variable | Description | Example |
|----------|-------------|---------|
| `EMAIL_USER` | Gmail address | `your-email@gmail.com` |
| `EMAIL_PASS` | Gmail App Password | `abcdefghijklmnop` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase URL | `https://xxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase Anon Key | `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` |
| `NODE_ENV` | Environment | `production` |

## 🚨 **Troubleshooting**

### **Lỗi Build**
```bash
# Kiểm tra logs
railway logs

# Xem build logs trong Railway Dashboard
```

### **Lỗi Canvas**
- Railway hỗ trợ canvas tự động
- Nếu vẫn lỗi, kiểm tra Node.js version (phải là 18+)

### **Lỗi Email**
- Kiểm tra EMAIL_USER và EMAIL_PASS
- Đảm bảo Gmail App Password được tạo đúng
- Kiểm tra 2FA đã được bật

### **Lỗi Supabase**
- Kiểm tra URL và Anon Key
- Đảm bảo RLS policies được cấu hình đúng

## 🎯 **Sau Khi Deploy**

### **1. Test Email Function**
```bash
# Test API endpoint
curl -X POST https://your-app.railway.app/api/attendance \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com", 
    "phone": "+84 123 456 789",
    "attendanceTime": "8:00"
  }'
```

### **2. Kiểm Tra Logs**
```bash
# Xem logs real-time
railway logs --follow
```

### **3. Monitor Performance**
- Railway Dashboard cung cấp metrics
- Monitor CPU, Memory, Network usage

## 💰 **Pricing**

- **Free Tier**: $5 credit/month
- **Pro Plan**: $20/month
- **Team Plan**: $99/month

## 🎉 **Kết Quả**

Sau khi deploy thành công:
- ✅ Website hoạt động trên Railway
- ✅ Email service với canvas hoạt động
- ✅ Database Supabase kết nối
- ✅ Auto-deploy từ GitHub
- ✅ Environment variables được bảo mật

## 📞 **Hỗ Trợ**

- Railway Docs: https://docs.railway.app
- Railway Discord: https://discord.gg/railway
- Railway GitHub: https://github.com/railwayapp
