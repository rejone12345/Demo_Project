# Azure Linux Virtual Machine Deployment Guide

This guide explains how to deploy the **Student Registration Management System** on a Microsoft Azure Linux (Ubuntu) Virtual Machine using Docker, Docker Compose, and Caddy.

---

## Architecture Overview

```
[ Internet Users / Admin ]
           │
           ▼ (HTTP Port 80 / HTTPS Port 443)
[ Azure Virtual Machine Public IP ]
           │
           ▼
┌─────────────────────────────────────────────────────────────┐
│ Docker Host                                                 │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ Caddy Container (frontend)                          │   │
│   │ - Serves React production build                     │   │
│   │ - Handles SPA React Router routing                  │   │
│   │ - Automatic HTTPS/SSL when domain provided          │   │
│   │ - Reverse proxies `/api/*` to backend:5000         │   │
│   └──────────────────────┬──────────────────────────────┘   │
│                          │                                  │
│                          ▼ (Internal Docker Bridge Network) │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ Express Container (backend:5000)                    │   │
│   │ - REST API endpoints                                │   │
│   │ - JWT cookie authentication                         │   │
│   └──────────────────────┬──────────────────────────────┘   │
└──────────────────────────┼──────────────────────────────────┘
                           │
                           ▼ (Encrypted TLS Outbound to Cloud)
                 [ MongoDB Atlas Database ]
```

---

## Step 1: Push Project to GitHub (from your Windows PC)

1. Open PowerShell in `e:\New folder`:
   ```powershell
   git init
   git add .
   git commit -m "feat: complete student registration system with docker and mongodb"
   ```

2. Create a new **private** or **public** repository on [GitHub](https://github.com/new).

3. Push the code:
   ```powershell
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git branch -M main
   git push -u origin main
   ```
   *(Notice: `.gitignore` automatically prevents your `.env` file from being pushed to GitHub).*

---

## Step 2: Create an Ubuntu Virtual Machine in Azure

1. Log in to [Azure Portal](https://portal.azure.com/).
2. In the search bar, type **Virtual machines** and click **Create > Azure virtual machine**.
3. Fill out the basics:
   - **Subscription**: Select your active subscription (e.g., Azure for Students or Pay-As-You-Go).
   - **Resource Group**: Click *Create new* -> Name it `student-rg`.
   - **Virtual machine name**: `student-portal-vm`.
   - **Region**: Choose closest region (e.g., `East US`, `Southeast Asia`, etc.).
   - **Image**: **Ubuntu Server 24.04 LTS** or **22.04 LTS - x64 Gen2**.
   - **Size**: `Standard_B1s` (1 vCPU, 1 GiB RAM - eligible for free/low-cost tier) or `Standard_B2s`.
   - **Authentication type**: **SSH public key** (recommended) or **Password**.
   - **Username**: `azureuser`.
4. **Inbound port rules**:
   - Allow selected ports: Check **SSH (22)**, **HTTP (80)**, and **HTTPS (443)**.
5. Click **Review + create**, then click **Create**.
6. Download your private key (`.pem`) if using SSH key authentication.

---

## Step 3: Configure Inbound Security Rules in Azure

1. Go to your created Virtual Machine resource in the Azure portal.
2. Under the left menu, select **Networking > Network settings**.
3. Verify that the following inbound rules exist:
   - **Port 22** (SSH) - Priority 300
   - **Port 80** (HTTP) - Priority 310
   - **Port 443** (HTTPS) - Priority 320
4. Copy the **Public IP address** of your VM from the Overview page (e.g. `20.x.x.x`).

---

## Step 4: Allow the VM's Public IP in MongoDB Atlas

1. Go to [cloud.mongodb.com](https://cloud.mongodb.com/).
2. In the left menu, click **Security > Network Access**.
3. Click **Add IP Address**.
4. Enter your Azure VM's **Public IP address** and click **Confirm**.
   *(This ensures the Azure VM can securely talk to your MongoDB cluster).*

---

## Step 5: Connect to the Azure VM via SSH

From your local computer (PowerShell / Terminal):
```powershell
ssh -i /path/to/your-key.pem azureuser@<AZURE_PUBLIC_IP>
```
*(If you chose password authentication during VM creation, simply run `ssh azureuser@<AZURE_PUBLIC_IP>` and type your password).*

---

## Step 6: Install Docker & Docker Compose on the Ubuntu VM

Run the following commands inside the SSH terminal on your Azure VM:

```bash
# 1. Update existing packages
sudo apt update && sudo apt upgrade -y

# 2. Install prerequisites
sudo apt install -y ca-certificates curl gnupg lsb-release git

# 3. Add Docker official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

# 4. Set up the Docker repository
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 5. Install Docker Engine and Docker Compose Plugin
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 6. Allow your user to run docker without sudo
sudo usermod -aG docker $USER
newgrp docker

# 7. Verify docker installation
docker --version
docker compose version
```

---

## Step 7: Clone the Project and Configure Environment

```bash
# 1. Clone your repository
git clone https://github.com/<your-username>/<your-repo-name>.git app
cd app

# 2. Create the backend/.env file on the VM
nano backend/.env
```

Paste your environment variables into `backend/.env`:
```env
NODE_ENV=production
PORT=5000
MONGO_URI=mongodb+srv://Hams:uNhHuNvFYeHN8Rue@cluster0.qbgqzbv.mongodb.net/student_registration?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_super_strong_random_secret_string
CLIENT_ORIGIN=http://<YOUR_AZURE_PUBLIC_IP>
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=ChangeMe123!
```
*(Press `Ctrl + O` then `Enter` to save, and `Ctrl + X` to exit `nano`).*

---

## Step 8: Seed Initial Admin and Launch Containers

```bash
# 1. Build and start the containers in background
docker compose up -d --build

# 2. Seed the initial admin account directly inside the backend container
docker compose exec backend node scripts/seedAdmin.js

# 3. Check container status
docker compose ps

# 4. View live logs to ensure backend is connected to MongoDB
docker compose logs -f
```

---

## Step 9: Access Your Live Website

Open your browser and enter your Azure VM Public IP:
```text
http://<YOUR_AZURE_PUBLIC_IP>
```

- **Student Form**: `http://<YOUR_AZURE_PUBLIC_IP>/register`
- **Admin Login**: `http://<YOUR_AZURE_PUBLIC_IP>/admin/login`
- **Admin Dashboard**: `http://<YOUR_AZURE_PUBLIC_IP>/admin/dashboard`

---

## Step 10: (Optional) Enable Free Automatic HTTPS with a Domain

If you have a domain or free subdomain (e.g. `portal.yourname.com` or from DuckDNS/Cloudflare):
1. In your domain DNS manager, create an **A Record**:
   - **Name**: `@` or `portal`
   - **Value**: Your Azure VM Public IP.
2. In your Azure VM `app` folder, open `.env` or set `SITE_ADDRESS`:
   ```bash
   export SITE_ADDRESS=portal.yourname.com
   ```
   Or edit `docker-compose.yml` to set:
   ```yaml
   environment:
     - SITE_ADDRESS=portal.yourname.com
   ```
3. Restart Caddy:
   ```bash
   docker compose up -d
   ```
   Caddy will **automatically obtain a free SSL certificate from Let's Encrypt** and redirect all HTTP traffic to secure HTTPS (`https://portal.yourname.com`)!
