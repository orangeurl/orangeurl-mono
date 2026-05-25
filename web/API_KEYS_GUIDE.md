# API Keys Management Guide

## Accessing the API Keys Page

The API Keys management interface is now available at:

```
https://app.orangeurl.live/api-keys
```

**Or during development:**
```
http://localhost:3000/api-keys
```

## Features

### ✨ Complete API Key Management UI

- **Create API Keys**: Generate new API keys with custom permissions
- **View API Keys**: See all your active and inactive keys
- **Delete API Keys**: Revoke keys you no longer need
- **Copy to Clipboard**: Quick copy of key prefixes
- **Security Warnings**: Clear alerts when creating keys
- **Beautiful UI**: Matches your existing OrangeURL dashboard design

### 🎨 UI Components Created

1. **Main Page** (`/app/api-keys/page.tsx`)
   - Lists all API keys
   - Shows key details (name, prefix, permissions, last used, expiry)
   - Create/Delete actions
   - One-time key display with copy button
   - Documentation link to Swagger UI

2. **Create Dialog** (`/components/dashboard/CreateAPIKeyDialog.tsx`)
   - Key name input
   - Permission selection (checkboxes)
   - Expiration dropdown
   - Security warnings

## How to Use

### 1. Access the Page

**Option A: Direct URL**
- Navigate to: `https://app.orangeurl.live/api-keys`

**Option B: Add to Dashboard (Optional)**
You can add a card/button to the main dashboard by editing `/web/app/dashboard/page.tsx`:

```typescript
// Add after the stats grid (around line 540)
<motion.div variants={fadeInUp}>
  <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-white">
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-lg mb-2">API Access</h3>
          <p className="text-sm text-gray-600">Manage API keys for programmatic access</p>
        </div>
        <Button
          onClick={() => router.push('/api-keys')}
          className="bg-orange-500 hover:bg-orange-600"
        >
          <Key className="w-4 h-4 mr-2" />
          API Keys
        </Button>
      </div>
    </CardContent>
  </Card>
</motion.div>
```

### 2. Create an API Key

1. Click "Create API Key" button
2. Enter a descriptive name (e.g., "Production Server", "Mobile App")
3. Select permissions:
   - `urls:read` - View URL details
   - `urls:write` - Create/update URLs
   - `analytics:read` - View click analytics
   - `webhooks:read` - View webhook configs
   - `webhooks:write` - Create/update webhooks
4. Choose expiration (optional)
5. Click "Create API Key"
6. **⚠️ IMPORTANT**: Copy the full key immediately! It won't be shown again.

### 3. Use the API Key

```bash
# Example: Create a short URL
curl -X POST https://api.orangeurl.live/api/v1/urls \
  -H "Authorization: Bearer oran_live_YOUR_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://example.com"
  }'
```

### 4. View API Documentation

Click the "View API Docs" button or visit:
```
https://api.orangeurl.live/docs
```

Interactive Swagger UI with all endpoints, examples, and testing capability.

## Features Breakdown

### API Key List
- **Name**: Descriptive label you provided
- **Prefix**: First characters of the key (e.g., `oran_live_a1b2c3d4••••`)
- **Status**: Active/Inactive badge
- **Created**: When the key was generated
- **Last Used**: Most recent API call timestamp
- **Expires**: Expiration date (or "Never")
- **Permissions**: Visual badges showing granted scopes
- **Actions**: Copy prefix, Delete key

### One-Time Key Display
After creating a key, you'll see a **green success banner** with:
- Full API key value
- Copy button
- Security warning
- "I've saved my key" dismissal button

### Rate Limits
Keys inherit your subscription tier's rate limit:
- **Free**: 100 requests/hour
- **Pro**: 1,000 requests/hour
- **Premium**: 10,000 requests/hour

## Styling

The UI uses your existing design system:
- Framer Motion animations
- Orange color scheme
- Card-based layout
- Lucide icons
- Consistent with main dashboard

## Security Best Practices

1. **Never commit keys to Git**
2. **Use environment variables**
   ```bash
   # .env
   ORANGEURL_API_KEY=oran_live_abc123...
   ```
3. **Create separate keys per environment**
4. **Set expiration dates**
5. **Rotate keys regularly**
6. **Delete unused keys**

## Troubleshooting

### "Failed to load API keys"
- Check your internet connection
- Verify you're logged in with Clerk
- Check browser console for errors

### "API key limit reached"
- Free tier: 1 key max
- Pro tier: 5 keys max
- Premium tier: 20 keys max
- Solution: Delete unused keys or upgrade tier

### Key not working in API calls
- Ensure you copied the full key (not just prefix)
- Check format: `oran_live_` + 32 random characters
- Verify key hasn't expired
- Check permissions match your API call needs

## Next Steps

1. **Deploy Frontend**: Push your changes to Vercel
2. **Test**: Create a test API key and call an endpoint
3. **Documentation**: Share the Swagger UI link with developers
4. **Monitor**: Check "Last Used" timestamps to track key usage

## Files Modified/Created

```
web/
├── app/
│   └── dashboard/
│       └── api-keys/
│           └── page.tsx          ✨ NEW - Main API Keys page
├── components/
│   └── dashboard/
│       └── CreateAPIKeyDialog.tsx ✨ NEW - Creation dialog
└── API_KEYS_GUIDE.md              ✨ NEW - This file
```

## Support

If you encounter issues:
1. Check `/docs` for API documentation
2. Verify backend is running: `https://api.orangeurl.live/health`
3. Test authentication: Log out and back in
4. Check browser DevTools console for errors

---

**🎉 Your API Keys management system is ready!**

Navigate to `/api-keys` to start creating keys.
