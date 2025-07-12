# MongoDB Atlas Setup Guide for StackIt

## Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/atlas
2. Click "Try Free" or "Sign In"
3. Create account with your email

## Step 2: Create a New Cluster
1. After login, click "Create" or "Build a Database"
2. Choose "FREE" tier (M0 Sandbox)
3. Select a cloud provider (AWS, Google Cloud, or Azure)
4. Choose a region close to you
5. Give your cluster a name (e.g., "stackit-cluster")
6. Click "Create Cluster" (takes 1-3 minutes)

## Step 3: Configure Network Access
1. Go to "Network Access" in left sidebar
2. Click "Add IP Address"
3. Choose "Allow access from anywhere" (0.0.0.0/0)
   - For production, add only your specific IP
4. Click "Confirm"

## Step 4: Create Database User
1. Go to "Database Access" in left sidebar
2. Click "Add New Database User"
3. Choose "Password" authentication
4. Enter username (e.g., "stackit-user")
5. Enter a strong password (save this!)
6. Set role to "Read and write to any database"
7. Click "Add User"

## Step 5: Get Connection String
1. Go to "Databases" in left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" and latest version
5. Copy the connection string

## Step 6: Update Your .env File
Replace the MONGODB_URI in your .env file:

```
MONGODB_URI=mongodb+srv://stackit-user:YOUR_PASSWORD@stackit-cluster.xxxxx.mongodb.net/stackit?retryWrites=true&w=majority
```

**Important:**
- Replace `YOUR_PASSWORD` with the password you created
- Replace `stackit-cluster.xxxxx` with your actual cluster name
- Keep `stackit` as the database name

## Step 7: Test Connection
1. Save the .env file
2. Restart your server: `node index.js`
3. Look for "✅ MongoDB Atlas Connected" message

## Example Connection String
```
MONGODB_URI=mongodb+srv://john:mySecurePass123@stackit-cluster.ab1cd.mongodb.net/stackit?retryWrites=true&w=majority
```

## Troubleshooting
- **Authentication failed**: Check username/password
- **Network timeout**: Check network access settings
- **Connection refused**: Ensure cluster is running
- **IP not allowed**: Add your IP to network access

## Security Best Practices
1. Use strong passwords
2. Restrict IP access in production
3. Use environment variables (never commit .env to git)
4. Regularly rotate passwords
5. Monitor database access logs

## Free Tier Limits
- 512 MB storage
- Shared RAM and vCPU
- No backup (upgrade for backups)
- Perfect for development and small projects
