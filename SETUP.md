# Setup Guide - Reshow Investments Website

## Quick Start

### 1. Backend Setup

```bash
cd server
npm install
npm run init-admin
npm run dev
```

The `init-admin` script will create a super admin user:
- Email: `admin@reshow.co.zw`
- Password: `admin123`

**Important**: Change this password after first login!

### 2. Frontend Setup

```bash
cd client
npm install
npm start
```

### 3. Environment Variables

#### Server (.env in server folder):
```
PORT=5000
JWT_SECRET=reshow-secret-key-change-in-production
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

#### Client (.env in client folder):
```
REACT_APP_API_URL=http://localhost:5000/api
```

### 4. Using start.bat (Windows)

Simply double-click `start.bat` to start both server and client.

## First Time Login

1. Go to `http://localhost:3000/admin/login`
2. Login with:
   - Email: `admin@reshow.co.zw`
   - Password: `admin123`
3. You will be prompted to change your password
4. New password must meet requirements:
   - Minimum 8 characters
   - At least one uppercase letter
   - At least one lowercase letter
   - At least one number
   - At least one special character

## Admin Features

- **Dashboard**: View statistics
- **Products**: Add, edit, delete products
- **Quotes**: View and manage quote requests
- **Users** (Super Admin only): Create and manage admin users

## User Management

### Creating New Admin Users (Super Admin only)

1. Login as super admin
2. Go to Users section
3. Click "Create User"
4. Enter full name and email
5. New user will have default password: `12345`
6. User must change password on first login
7. If user doesn't login within 24 hours, account is automatically disabled

## Product Categories

- Apparel
- Headwear
- Promotional Gifts
- PPE Wear

## Image Uploads

- Product images: `server/uploads/products/`
- Gallery images: `server/uploads/gallery/`
- If no image uploaded, placeholder is used

## Contact Form

Sends emails to:
- tussym69@gmail.com
- sales@reshow.co.zw

Configure SMTP settings in `server/.env` for email functionality.

## Notes

- All data is stored in JSON files (no database)
- Images are stored locally in `server/uploads/`
- JWT tokens expire after 7 days
- Password changes are enforced on first login

