# Starting the Backend Server

## Quick Start

The backend server must be running for the Services page and admin features to work.

### Method 1: Use start.bat (Recommended)
Double-click `start.bat` in the project root. This starts both server and client.

### Method 2: Manual Start

1. Open a new terminal/PowerShell window
2. Navigate to server directory:
   ```bash
   cd server
   ```
3. Start the server:
   ```bash
   npm run dev
   ```

### Verify Server is Running

You should see:
```
Server running on port 5000
```

### Test the Server

Open in browser: http://localhost:5000/api/health

You should see:
```json
{"status":"ok","message":"Reshow API is running"}
```

## Troubleshooting

### Port 5000 Already in Use
If you get "port already in use" error:
1. Find and close the process using port 5000
2. Or change PORT in `server/.env` to a different port (e.g., 5001)
3. Update `client/.env` with the new port

### Server Won't Start
1. Make sure you're in the `server` directory
2. Run `npm install` to ensure dependencies are installed
3. Check that `server/data/users.json` exists
4. Check console for error messages

## Required for:
- Services page (product listing)
- Admin panel (all features)
- Contact form (email sending)
- Quote requests

