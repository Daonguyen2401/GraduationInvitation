# 🎓 Graduation Invitation Generator

A modern web application for creating and sending personalized graduation invitation cards with beautiful UI and excellent user experience.

## 📋 Purpose

This project is developed to help graduates create professional and personalized graduation invitation cards, allowing them to invite friends and family to their graduation ceremony in an easy and impressive way.

## ✨ Key Features

### 🌐 Multi-language Support
- Complete **Vietnamese** and **English** translations
- Easy language switching with one click
- Interface optimized for both languages

### 🎨 Modern UI Design
- **Automatic image slideshow** with smooth transition effects
- **Responsive design** compatible with all devices
- **Gradient backgrounds** and beautiful visual effects
- **Smooth animations** and transitions

### 📝 Smart Registration Form
- Collect guest information:
  - Full name (required)
  - Nickname (optional)
  - Phone number
  - Email (required)
  - Attendance time (select from available time slots)
- **Input validation** for data integrity
- **Toast notifications** for status updates
- **Database integration** with Supabase for data persistence

### 🎫 Personalized Invitation Generation
- **Canvas-based** dynamically generated invitation cards
- Professional design featuring:
  - University logo and information
  - Personalized guest name
  - Event time and location
  - Beautiful gradient background
- **Download** invitation as PNG file
- Automatic filename based on guest name

### 🎯 User Experience
- **Interactive slideshow** with manual controls
- **Smooth animations** and hover effects
- **Loading states** and instant feedback
- **Mobile-first** responsive design

### 🗄️ Admin Features
- **Attendance management** dashboard
- **Real-time data** viewing and statistics
- **CSV export** functionality for data backup
- **Time-based statistics** for attendance planning

## 🛠️ Technology Stack

### Frontend Framework
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety and developer experience
- **React 18** - UI library with hooks and concurrent features

### UI/UX Libraries
- **Tailwind CSS** - Utility-first CSS framework
- **Radix UI** - Accessible component primitives
- **Lucide React** - Beautiful icon library
- **Class Variance Authority** - Component variant management

### Development Tools
- **Vercel Analytics** - Performance monitoring
- **PostCSS** - CSS processing
- **ESLint** - Code linting
- **TypeScript** - Static type checking

### Database & Backend
- **Supabase** - PostgreSQL database with real-time features
- **@supabase/supabase-js** - JavaScript client library
- **Next.js API Routes** - Serverless API endpoints

### Deployment
- **Netlify** - Static site hosting
- **PNPM** - Fast package manager

## 🚀 Installation and Setup

### System Requirements
- Node.js 18+ 
- PNPM (recommended) or NPM

### Installation
```bash
# Clone repository
git clone <repository-url>
cd graduation-invitation

# Install dependencies
pnpm install
# or
npm install
```

### Database Setup

#### 1. Configure Environment Variables
Create `.env.local` file in the root directory:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://nqatzqopczulipwhlsed.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_KEY=your_supabase_service_role_key_here
```

#### 2. Create Database Schema
Run the following SQL in Supabase SQL Editor:

```sql
-- Tạo bảng attendance_confirmations để lưu trữ thông tin xác nhận tham dự
CREATE TABLE IF NOT EXISTS attendance_confirmations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name VARCHAR(255) NOT NULL,
  nickname VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  email VARCHAR(255) NOT NULL,
  attendance_time VARCHAR(20) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tạo index để tối ưu hóa truy vấn
CREATE INDEX IF NOT EXISTS idx_attendance_confirmations_email ON attendance_confirmations(email);
CREATE INDEX IF NOT EXISTS idx_attendance_confirmations_created_at ON attendance_confirmations(created_at);

-- Tạo function để tự động cập nhật updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Tạo trigger để tự động cập nhật updated_at
CREATE TRIGGER update_attendance_confirmations_updated_at 
    BEFORE UPDATE ON attendance_confirmations 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

#### 3. Get Supabase Keys
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Navigate to **Settings** > **API**
4. Copy **Project URL** and **anon public** key
5. For service role key, copy **service_role** key (use with caution)

### Run Development Server
```bash
pnpm dev
# or
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

#### 4. Test the Application
- **Main page**: `http://localhost:3000` - Fill form and submit to test database integration
- **Admin page**: `http://localhost:3000/admin` - View attendance list and export data

### Build for Production
```bash
pnpm build
# or
npm run build
```

### Deploy to Netlify
```bash
pnpm deploy
# or
npm run deploy
```

## 📁 Project Structure

```
graduation-invitation/
├── app/                    # Next.js App Router
│   ├── api/               # API routes
│   │   └── attendance/    # Attendance API endpoints
│   ├── admin/             # Admin dashboard
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page component
├── components/            # Reusable components
│   ├── ui/               # UI component library
│   └── theme-provider.tsx # Theme context
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
│   └── supabase.ts      # Supabase client configuration
├── public/               # Static assets
│   └── images/          # Image resources
├── styles/               # Additional stylesheets
├── .env.local           # Environment variables (create this)
├── database-schema.sql  # Database schema for Supabase
├── netlify.toml         # Netlify configuration
├── next.config.mjs       # Next.js configuration
├── package.json          # Dependencies and scripts
└── tsconfig.json         # TypeScript configuration
```

## 🎨 Customization

### Change Event Information
Edit in `app/page.tsx`:
- University name
- Venue location
- Event time
- Graduate information

### Change Images
Replace files in `public/` directory:
- `graduation-photo-portrait.jpg` - Portrait photo
- `university-campus-with-graduation-decorations.jpg` - University campus
- `images/industry/education.png` - Industry logo

### Customize Colors
Edit in `app/globals.css` or use Tailwind CSS classes.

## 📱 Responsive Design

The application is optimized for:
- **Desktop** (1024px+)
- **Tablet** (768px - 1023px)  
- **Mobile** (320px - 767px)

## 🌟 Highlighted Features

1. **Real-time Canvas Generation** - Dynamic invitation creation with HTML5 Canvas
2. **Multi-language Support** - Complete multilingual support
3. **Interactive Slideshow** - Engaging image experience
4. **Form Validation** - Smart input data validation
5. **Download Functionality** - Save invitation to device
6. **Modern UI/UX** - Contemporary and user-friendly interface

## 🤝 Contributing

All contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push and create a Pull Request

## 📄 License

This project is released under the MIT License.

## 👨‍💻 Author

Developed with ❤️ for the graduating student community.

---

**Note**: This is a demo project for learning and reference purposes. Please customize according to your specific needs.
