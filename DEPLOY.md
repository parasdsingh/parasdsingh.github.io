# Chat API Deployment Guide

This guide explains how to deploy the CV chat assistant API using Cloudflare Workers.

## Prerequisites

1. Cloudflare account (free tier works)
2. Groq API key (free tier available at https://console.groq.com)
3. Node.js and npm installed
4. Wrangler CLI (`npm install -g wrangler`)

## Setup Steps

### 1. Install Wrangler CLI
```bash
npm install -g wrangler
```

### 2. Login to Cloudflare
```bash
wrangler login
```

### 3. Set up the Groq API Key
Get your API key from https://console.groq.com and set it as a secret:

```bash
wrangler secret put GROQ_API_KEY
# Enter your Groq API key when prompted
```

### 4. Deploy the Worker
```bash
wrangler deploy
```

### 5. Configure Custom Domain (Optional)
If you want to use a custom domain:

1. Add your domain to Cloudflare
2. Update `wrangler.toml` with your domain routes
3. Redeploy: `wrangler deploy`

### 6. Update Frontend
After deployment, update the API endpoint in `chat.js`:

```javascript
// Replace '/api/chat' with your worker URL
const response = await fetch('https://cv-chat-api.your-subdomain.workers.dev/api/chat', {
  // ... rest of the fetch configuration
});
```

## Local Development

For local testing:

```bash
wrangler dev
```

This will start a local server, usually at `http://localhost:8787`.

## Environment Configuration

The worker expects the following environment variables:
- `GROQ_API_KEY`: Your Groq API key (set via `wrangler secret`)

## API Endpoints

- `POST /api/chat`: Send chat messages
  - Body: `{ "message": "string", "max_tokens": 300, "temperature": 0.7 }`
  - Response: `{ "response": "string" }`

## Troubleshooting

1. **API Key Issues**: Ensure `GROQ_API_KEY` is set correctly using `wrangler secret put`
2. **CORS Errors**: The worker includes CORS headers, but ensure your frontend domain is correct
3. **Rate Limits**: Groq has rate limits on the free tier; consider upgrading if needed
4. **Fallback Mode**: The frontend includes fallback responses when the API is unavailable

## Cost Considerations

- Cloudflare Workers: 100,000 requests/day on free tier
- Groq API: Limited free tier, check current rates at https://console.groq.com

## Security Notes

- API key is stored securely in Cloudflare Workers environment
- No API key exposure in frontend code
- CORS configured for security
- Rate limiting handled by Groq API