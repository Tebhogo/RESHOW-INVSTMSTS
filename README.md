# Reshow Investments Website

Corporate branding & promotional website for Reshow Investments (Pvt) Ltd.

🌐 **Live Site**: [https://tebhogo.github.io/RESHOW-INVSTMSTS/](https://tebhogo.github.io/RESHOW-INVSTMSTS/)

📚 **Deployment Guide**: See [GITHUB_PAGES_DEPLOY.md](./GITHUB_PAGES_DEPLOY.md) or [DEPLOY.md](./DEPLOY.md)

## Tech Stack

- **Frontend**: React, Tailwind CSS, React Router
- **Backend**: Node.js, Express.js
- **Storage**: JSON files (no database)
- **Auth**: JWT with bcrypt

## Setup Instructions

### Backend Setup

1. Navigate to server directory:
```bash
cd server
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file (copy from `.env.example`):
```
PORT=5000
JWT_SECRET=your-secret-key
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

4. Initialize super admin password:
   - Edit `server/data/users.json`
   - Generate bcrypt hash for default password
   - Or use: `npm run init-admin` (if script exists)

5. Start server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```
REACT_APP_API_URL=http://localhost:5000/api
```

4. Start development server:
```bash
npm start
```

## Default Admin Credentials

- Email: admin@reshow.co.zw
- Password: (set in users.json - must be bcrypt hashed)

## Features

- Public pages: Home, About, Services, Gallery, Contact
- Admin panel with product management
- Quote request system
- Image uploads (stored locally)
- JWT authentication
- Password enforcement

## Project Structure

```
reshow/
├── server/
│   ├── data/          # JSON files (users, products, quotes)
│   ├── uploads/       # Image uploads
│   ├── routes/        # API routes
│   ├── middleware/    # Auth middleware
│   └── utils/         # Helper functions
└── client/
    ├── src/
    │   ├── pages/     # Page components
    │   ├── components/ # Reusable components
    │   ├── context/    # React context
    │   └── utils/     # Utilities
    └── public/        # Static files
```

