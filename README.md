# Maysalward Trainee Check-in System

A comprehensive web application for managing trainee registration, QR code-based attendance tracking, reward systems, and behavior management.

## Features

### 🎯 Core Functionality
- **Trainee Registration**: Public form with automatic serial number generation
- **QR Code Generation**: Secure QR codes for each trainee card
- **Digital ID Cards**: Downloadable trainee cards with QR codes
- **Check-in System**: Camera-based QR code scanning for attendance
- **Reward System**: Points awarded for each check-in
- **Behavior Management**: Flag system with point deduction

### 🎨 Premium Design
- Modern, responsive UI with Tailwind CSS
- Smooth animations with Framer Motion
- Mobile-first design approach
- Professional color schemes and typography
- Intuitive user experience

### 🔐 Security & Access
- Supabase authentication for admin access
- Role-based permissions (Admin/Trainer)
- Secure QR token generation
- Protected routes and data access

## Tech Stack

- **Frontend**: React 18, Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: React Icons
- **Backend**: Supabase (Database, Auth, Storage)
- **QR Code**: qrcode library, QR Scanner
- **Card Generation**: html2canvas
- **Routing**: React Router DOM

## Quick Start

### Prerequisites
- Node.js 16+ and npm
- Supabase account and project

### Installation

1. **Clone and install dependencies**
```bash
git clone <repository-url>
cd maysalward-checkin-system
npm install
```

2. **Environment Setup**
```bash
cp .env.example .env
```

Edit `.env` with your Supabase credentials:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. **Database Setup**

Run these SQL commands in your Supabase SQL editor:

```sql
-- Create trainees table
CREATE TABLE trainees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  serial_number TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  id_card_number TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  email TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  education_level TEXT NOT NULL,
  reward_points INTEGER DEFAULT 0,
  card_image_url TEXT,
  qr_token TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create checkins table
CREATE TABLE checkins (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trainee_id UUID REFERENCES trainees(id) ON DELETE CASCADE,
  checkin_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  points_awarded INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create flags table
CREATE TABLE flags (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  trainee_id UUID REFERENCES trainees(id) ON DELETE CASCADE,
  reason TEXT NOT NULL,
  points_deducted INTEGER DEFAULT 0,
  flagged_by UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved BOOLEAN DEFAULT FALSE
);

-- Create storage bucket for trainee cards
INSERT INTO storage.buckets (id, name, public) VALUES ('trainee-cards', 'trainee-cards', true);

-- Set up RLS policies (adjust as needed)
ALTER TABLE trainees ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE flags ENABLE ROW LEVEL SECURITY;

-- Allow public read access to trainees for registration/checkin
CREATE POLICY "Public read access" ON trainees FOR SELECT USING (true);
CREATE POLICY "Public insert access" ON trainees FOR INSERT WITH CHECK (true);
CREATE POLICY "Public update access" ON trainees FOR UPDATE USING (true);

-- Allow public access to checkins for QR scanning
CREATE POLICY "Public checkin access" ON checkins FOR ALL USING (true);

-- Restrict flags to authenticated users only
CREATE POLICY "Authenticated access to flags" ON flags FOR ALL USING (auth.role() = 'authenticated');
```

4. **Create Admin User**

In Supabase Auth, create an admin user or use the demo credentials in the login form.

5. **Start Development Server**
```bash
npm run dev
```

## Project Structure

```
src/
├── components/
│   ├── Admin/           # Admin dashboard components
│   ├── Forms/           # Registration forms
│   ├── Home/            # Homepage components
│   ├── Layout/          # Layout components
│   └── QR/              # QR scanner components
├── config/              # Configuration files
├── utils/               # Utility functions
├── common/              # Shared components
└── App.jsx              # Main application component
```

## Key Components

### Registration Flow
1. **TraineeRegistration**: Collects trainee information
2. **QR Code Generation**: Creates secure tokens and QR codes
3. **Card Generation**: Creates downloadable digital ID cards
4. **Database Storage**: Saves trainee data and card images

### Check-in Flow
1. **QRScanner**: Camera-based QR code scanning
2. **Token Validation**: Verifies QR code against database
3. **Attendance Recording**: Logs check-in with timestamp
4. **Points Award**: Adds reward points to trainee profile

### Admin Features
1. **Dashboard**: Overview statistics and recent activity
2. **Trainee Management**: Search, filter, and manage trainees
3. **Profile View**: Detailed trainee information and history
4. **Behavior Management**: Flag system with point deduction

## Deployment

### Build for Production
```bash
npm run build
```

### Deploy to Vercel/Netlify
The app is configured for static hosting. Upload the `dist` folder to your hosting provider.

### Environment Variables
Ensure all environment variables are set in your hosting platform:
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

## Usage Guide

### For Trainees
1. **Registration**: Fill out the registration form
2. **Card Download**: Download your digital ID card
3. **Check-in**: Show QR code to scanner for attendance

### For Trainers/Admins
1. **Login**: Access admin dashboard with credentials
2. **Scan QR Codes**: Use the check-in scanner for attendance
3. **Manage Trainees**: View profiles, check-in history, and manage flags
4. **Download Reports**: Export trainee data as needed

## Customization

### Branding
- Update colors in `tailwind.config.js`
- Modify logos and text in components
- Customize card design in `cardGenerator.js`

### Features
- Add new trainee fields in registration form
- Extend reward system with badges/levels
- Add email notifications for check-ins
- Implement CSV export functionality

## Support

For issues and feature requests, please create an issue in the repository or contact the development team.

## License

This project is licensed under the MIT License - see the LICENSE file for details.