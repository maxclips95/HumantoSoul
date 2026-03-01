# 🚀 Migration Guide: Render → Local Ubuntu VM + Cloudflare Tunnel

This guide migrates the **Jai Gurudev / HumantoSoul** app from Render to your local Ubuntu VM
with a permanent Cloudflare Tunnel for public access via CDN.

---

## Architecture Overview

```
Internet → Cloudflare CDN → cloudflared tunnel → Ubuntu VM (localhost:5000)
```

The Node/Express backend on port 5000 serves both the API **and** the pre-built React frontend
from the `build/` folder. PM2 keeps it alive 24/7.

---

## PART 1 — Ubuntu VM Setup

### 1.1 Update System

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.2 Install Node.js 20 (LTS)

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v   # should show v20.x.x
npm -v    # should show 10.x.x
```

### 1.3 Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

### 1.4 Install Git

```bash
sudo apt install -y git
```

---

## PART 2 — Clone and Configure the App

### 2.1 Clone the Repository

```bash
cd ~
git clone https://github.com/maxclips95/HumantoSoul.git
cd HumantoSoul
```

> **Note:** This is a private repo. You'll need to authenticate.
> The easiest way is a **GitHub Personal Access Token (PAT)**:
> 1. Go to GitHub → Settings → Developer Settings → Personal Access Tokens → Tokens (classic)
> 2. Generate token with `repo` scope
> 3. Use it as the password when git prompts you, OR use this URL format:
>    ```
>    git clone https://<YOUR_PAT>@github.com/maxclips95/HumantoSoul.git
>    ```

### 2.2 Create the .env File

```bash
nano .env
```

Paste in the following (copy your exact values from your Windows `.env`):

```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=$2a$10$YvhNBRuxGBbusKROC4ErWOJzb4nUCHlnrWRZgsSEbhxGXbT6ZPlo.
SERVER_PORT=5000
JWT_SECRET=JaiGurudev-Super-Secret-Key-2026-XyZ789!@#
PRODUCTION_URL=https://www.humantosoul.com

# Email Configuration (Waterfall Logic: Brevo -> SendGrid -> Gmail)
BREVO_USER=your_brevo_email_here
BREVO_PASS=your_brevo_smtp_key_here
SENDGRID_USER=your_sendgrid_user_here
SENDGRID_PASS=your_sendgrid_key_here
EMAIL_SERVICE=gmail
EMAIL_USER=ravi00242@gmail.com
EMAIL_PASS=xeyy mrkl tnhe ljfr
EMAIL_TO=ravi00242@gmail.com

# Supabase
SUPABASE_URL=https://barfyvaxotklnehfykdv.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJhcmZ5dmF4b3RrbG5laGZ5a2R2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MDM2NzY1NSwiZXhwIjoyMDg1OTQzNjU1fQ.43el-8jZJ-JtSjjtrZTwTeWlE7pzVs07PZZCLZAfGdU

USE_SUPABASE=true
```

Save: `Ctrl+X` → `Y` → `Enter`

### 2.3 Install Dependencies & Build Frontend

```bash
# Install root (frontend) dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..

# Build the React frontend
npm run build
```

This creates the `build/` folder that the Express server will serve statically.

---

## PART 3 — Run with PM2

### 3.1 Start the App

```bash
# From the root of the project (/root/HumantoSoul)
pm2 start server/server.js --name "humantosoul"
```

### 3.2 Verify It's Running

```bash
pm2 status
pm2 logs humantosoul --lines 30
```

You should see: `Server running on port 5000`

Test locally inside the VM:
```bash
curl http://localhost:5000/api/announcements
```

### 3.3 Make PM2 Start on Boot

```bash
pm2 startup
# Copy and run the command PM2 prints (it will look like sudo env PATH=...)
pm2 save
```

---

## PART 4 — Cloudflare Tunnel Setup

### 4.1 Install cloudflared

```bash
# Download the latest cloudflared for Linux
wget -q https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb
sudo dpkg -i cloudflared-linux-amd64.deb
cloudflared --version
```

### 4.2 Authenticate with Cloudflare

```bash
cloudflared tunnel login
```

This will print a URL — open it in a browser, log into your Cloudflare account, and select your domain (`humantosoul.com`). A credentials file will be saved at `~/.cloudflared/cert.pem`.

### 4.3 Create the Tunnel

```bash
cloudflared tunnel create humantosoul-tunnel
```

This creates a tunnel with a unique ID. Note the **Tunnel ID** from the output (looks like `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`).

List tunnels to confirm:
```bash
cloudflared tunnel list
```

### 4.4 Configure the Tunnel

```bash
mkdir -p ~/.cloudflared
nano ~/.cloudflared/config.yml
```

Paste this (replace `<TUNNEL_ID>` with your actual tunnel ID):

```yaml
tunnel: <TUNNEL_ID>
credentials-file: /root/.cloudflared/<TUNNEL_ID>.json

ingress:
  - hostname: www.humantosoul.com
    service: http://localhost:5000
  - hostname: humantosoul.com
    service: http://localhost:5000
  - service: http_status:404
```

Save: `Ctrl+X` → `Y` → `Enter`

### 4.5 Add DNS Routes in Cloudflare

```bash
cloudflared tunnel route dns humantosoul-tunnel www.humantosoul.com
cloudflared tunnel route dns humantosoul-tunnel humantosoul.com
```

This automatically creates CNAME records in your Cloudflare DNS pointing to the tunnel.

> **Important:** In the Cloudflare dashboard, make sure the DNS records for `www` and `@` have the **orange cloud (Proxied)** status enabled — that's what routes traffic through the CDN.

### 4.6 Test the Tunnel Manually

```bash
cloudflared tunnel run humantosoul-tunnel
```

Now visit `https://www.humantosoul.com` in your browser. If everything works, continue to the next step.

Press `Ctrl+C` to stop the manual run.

### 4.7 Run Tunnel as a System Service (Always-On)

```bash
sudo cloudflared service install
sudo systemctl enable cloudflared
sudo systemctl start cloudflared
sudo systemctl status cloudflared
```

The tunnel will now automatically restart on system reboot.

---

## PART 5 — Verification Checklist

After setup, verify the following:

- [ ] `pm2 status` shows `humantosoul` as **online**
- [ ] `systemctl status cloudflared` shows **active (running)**
- [ ] `https://www.humantosoul.com` loads the website
- [ ] `https://www.humantosoul.com/api/announcements` returns JSON
- [ ] Admin login at `https://www.humantosoul.com/admin-login` works
- [ ] Gallery, Downloads, Newsletter pages load correctly
- [ ] After VM reboot, app comes back automatically (test with `sudo reboot`)

---

## PART 6 — Ongoing Maintenance

### Update the App (after pushing changes from Windows)

```bash
cd ~/HumantoSoul
git pull origin main
cd server && npm install && cd ..
npm install
npm run build
pm2 restart humantosoul
```

### View Live Logs

```bash
pm2 logs humantosoul
```

### Check Tunnel Logs

```bash
sudo journalctl -u cloudflared -f
```

### Stop / Start Services

```bash
# App
pm2 stop humantosoul
pm2 start humantosoul

# Tunnel
sudo systemctl stop cloudflared
sudo systemctl start cloudflared
```

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Site not loading | Check `pm2 status` and `systemctl status cloudflared` |
| API returns 502 | Backend crashed — check `pm2 logs humantosoul` |
| Tunnel disconnected | `sudo systemctl restart cloudflared` |
| DNS not resolving | Wait 5 min for propagation; verify CNAME in Cloudflare dashboard |
| Build fails on VM | Ensure Node 20+ is installed: `node -v` |
| `.env` not found | Must be in `/root/HumantoSoul/.env` (project root, not `server/`) |

---

*Last updated: February 2026 | Stack: Node.js 20 + Express + React + Supabase + Cloudflare Tunnel*
