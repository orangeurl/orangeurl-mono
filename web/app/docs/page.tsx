'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Key,
  Webhook,
  Code,
  ExternalLink,
  Copy,
  CheckCircle2,
  Book,
  Zap,
  Shield,
  Link as LinkIcon,
  Terminal,
  FileCode,
  GitBranch,
  Activity,
  Bell,
  Lock,
  ArrowRight,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function APIDocs() {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const { toast } = useToast();

  const copyCode = (code: string, id: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(id);
    toast({
      title: 'Copied',
      description: 'Code copied to clipboard',
    });
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const codeExamples = {
    createUrl: {
      curl: `curl -X POST https://api.orangeurl.live/api/v1/urls \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://example.com/very-long-url",
    "custom_id": "my-link",
    "expiry": 24
  }'`,
      javascript: `const response = await fetch('https://api.orangeurl.live/api/v1/urls', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://example.com/very-long-url',
    custom_id: 'my-link',
    expiry: 24
  })
});

const data = await response.json();
console.log(data.short_url); // https://orangeurl.live/abc123`,
      python: `import requests

response = requests.post(
    'https://api.orangeurl.live/api/v1/urls',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    json={
        'url': 'https://example.com/very-long-url',
        'custom_id': 'my-link',
        'expiry': 24
    }
)

data = response.json()
print(data['short_url'])  # https://orangeurl.live/abc123`,
      go: `package main

import (
    "bytes"
    "encoding/json"
    "net/http"
)

func main() {
    payload := map[string]interface{}{
        "url": "https://example.com/very-long-url",
        "custom_id": "my-link",
        "expiry": 24,
    }

    jsonData, _ := json.Marshal(payload)
    req, _ := http.NewRequest("POST",
        "https://api.orangeurl.live/api/v1/urls",
        bytes.NewBuffer(jsonData))

    req.Header.Set("Authorization", "Bearer YOUR_API_KEY")
    req.Header.Set("Content-Type", "application/json")

    client := &http.Client{}
    resp, _ := client.Do(req)
    defer resp.Body.Close()
}`,
    },
    createWebhook: {
      curl: `curl -X POST https://api.orangeurl.live/api/v1/webhooks \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "url": "https://myapp.com/webhooks/orangeurl",
    "events": ["url.created", "url.clicked"]
  }'`,
      javascript: `const response = await fetch('https://api.orangeurl.live/api/v1/webhooks', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://myapp.com/webhooks/orangeurl',
    events: ['url.created', 'url.clicked']
  })
});

const webhook = await response.json();
console.log('Webhook Secret:', webhook.secret); // Save this!`,
      python: `import requests

response = requests.post(
    'https://api.orangeurl.live/api/v1/webhooks',
    headers={
        'Authorization': 'Bearer YOUR_API_KEY',
        'Content-Type': 'application/json'
    },
    json={
        'url': 'https://myapp.com/webhooks/orangeurl',
        'events': ['url.created', 'url.clicked']
    }
)

webhook = response.json()
print('Webhook Secret:', webhook['secret'])  # Save this!`,
    },
    webhookHandler: {
      javascript: `// Express.js webhook handler
const crypto = require('crypto');

app.post('/webhooks/orangeurl', (req, res) => {
  // Verify webhook signature
  const signature = req.headers['x-orangeurl-signature'];
  const hmac = crypto.createHmac('sha256', WEBHOOK_SECRET);
  const digest = hmac.update(JSON.stringify(req.body)).digest('hex');

  if (signature !== digest) {
    return res.status(401).send('Invalid signature');
  }

  // Handle the event
  const { event, data } = req.body;

  switch(event) {
    case 'url.created':
      console.log('New URL created:', data.short_url);
      break;
    case 'url.clicked':
      console.log('URL clicked:', data.short_id);
      console.log('Location:', data.location);
      break;
  }

  res.status(200).send('OK');
});`,
      python: `import hmac
import hashlib
from flask import Flask, request

app = Flask(__name__)

@app.route('/webhooks/orangeurl', methods=['POST'])
def webhook_handler():
    # Verify webhook signature
    signature = request.headers.get('X-Orangeurl-Signature')
    body = request.get_data()

    expected = hmac.new(
        WEBHOOK_SECRET.encode(),
        body,
        hashlib.sha256
    ).hexdigest()

    if signature != expected:
        return 'Invalid signature', 401

    # Handle the event
    payload = request.json
    event = payload['event']
    data = payload['data']

    if event == 'url.created':
        print(f"New URL created: {data['short_url']}")
    elif event == 'url.clicked':
        print(f"URL clicked: {data['short_id']}")
        print(f"Location: {data['location']}")

    return 'OK', 200`,
    },
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="border-b">
        <div className="container mx-auto px-4 py-16">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 text-sm font-medium mb-6">
              <Book className="w-4 h-4" />
              API Documentation
            </div>
            <h1 className="text-5xl font-bold mb-6">
              Build with OrangeURL API
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Integrate powerful URL shortening, analytics, and webhooks into your application.
              Get started in minutes with our comprehensive API.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Button
                asChild
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Link href="/api-keys">
                  <Key className="w-4 h-4 mr-2" />
                  Get API Key
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={() => window.open('https://api.orangeurl.live/docs', '_blank')}
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                Interactive API Reference
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Quick Start */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Zap className="w-8 h-8 text-orange-500" />
            Quick Start
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
                  <span className="text-orange-600 dark:text-orange-400 font-bold text-lg">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Create an API Key
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Generate your API key from the dashboard. Pro and Premium plans only.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/api-keys">
                    Create Key
                    <ArrowRight className="w-3 h-3 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
                  <span className="text-orange-600 dark:text-orange-400 font-bold text-lg">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Make Your First Request
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Use your API key to shorten URLs, retrieve analytics, and more.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a href="#authentication">
                    View Examples
                    <ArrowRight className="w-3 h-3 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
                  <span className="text-orange-600 dark:text-orange-400 font-bold text-lg">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">
                  Set Up Webhooks
                </h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Receive real-time notifications when URLs are created or clicked.
                </p>
                <Button variant="outline" size="sm" asChild>
                  <a href="#webhooks">
                    Learn More
                    <ArrowRight className="w-3 h-3 ml-2" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Authentication */}
        <motion.div
          id="authentication"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Shield className="w-8 h-8 text-orange-500" />
            Authentication
          </h2>

          <Card className="mb-6">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-4">
                Using API Keys
              </h3>
              <p className="text-muted-foreground mb-6">
                All API requests require authentication using an API key. Include your API key in the{' '}
                <code className="px-2 py-1 bg-muted rounded text-sm">Authorization</code> header
                or <code className="px-2 py-1 bg-muted rounded text-sm">X-API-Key</code> header.
              </p>

              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      Authorization Header (Recommended)
                    </span>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 relative border border-gray-300 dark:border-gray-700">
                    <code className="text-sm text-green-600 dark:text-green-400 font-mono">
                      Authorization: Bearer oran_live_your_api_key_here
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      onClick={() => copyCode('Authorization: Bearer oran_live_your_api_key_here', 'auth1')}
                    >
                      {copiedCode === 'auth1' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">
                      X-API-Key Header (Alternative)
                    </span>
                  </div>
                  <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 relative border border-gray-300 dark:border-gray-700">
                    <code className="text-sm text-green-600 dark:text-green-400 font-mono">
                      X-API-Key: oran_live_your_api_key_here
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      onClick={() => copyCode('X-API-Key: oran_live_your_api_key_here', 'auth2')}
                    >
                      {copiedCode === 'auth2' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-muted border rounded-lg">
                <div className="flex gap-3">
                  <Lock className="w-5 h-5 text-orange-600 dark:text-orange-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1">
                      Keep Your API Keys Secret
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Never expose your API keys in client-side code, public repositories, or logs.
                      Always use environment variables and secure storage.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* API Endpoints */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Code className="w-8 h-8 text-orange-500" />
            Common Operations
          </h2>

          <div className="space-y-6">
            {/* Create Short URL */}
            <Card>
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2">
                      Create Short URL
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Shorten a URL with optional custom ID and expiration.
                    </p>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded font-mono">
                        POST
                      </span>
                      <code className="text-muted-foreground">/api/v1/urls</code>
                      <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded text-xs">
                        urls:write
                      </span>
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="curl" className="w-full">
                  <TabsList>
                    <TabsTrigger value="curl">cURL</TabsTrigger>
                    <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                    <TabsTrigger value="python">Python</TabsTrigger>
                    <TabsTrigger value="go">Go</TabsTrigger>
                  </TabsList>

                  <TabsContent value="curl">
                    <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 relative border border-gray-300 dark:border-gray-700">
                      <pre className="text-sm text-gray-700 dark:text-gray-300 font-mono overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                        {codeExamples.createUrl.curl}
                      </pre>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        onClick={() => copyCode(codeExamples.createUrl.curl, 'create-curl')}
                      >
                        {copiedCode === 'create-curl' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="javascript">
                    <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 relative border border-gray-300 dark:border-gray-700">
                      <pre className="text-sm text-gray-700 dark:text-gray-300 font-mono overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                        {codeExamples.createUrl.javascript}
                      </pre>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        onClick={() => copyCode(codeExamples.createUrl.javascript, 'create-js')}
                      >
                        {copiedCode === 'create-js' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="python">
                    <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 relative border border-gray-300 dark:border-gray-700">
                      <pre className="text-sm text-gray-700 dark:text-gray-300 font-mono overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                        {codeExamples.createUrl.python}
                      </pre>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        onClick={() => copyCode(codeExamples.createUrl.python, 'create-py')}
                      >
                        {copiedCode === 'create-py' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="go">
                    <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 relative border border-gray-300 dark:border-gray-700">
                      <pre className="text-sm text-gray-700 dark:text-gray-300 font-mono overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                        {codeExamples.createUrl.go}
                      </pre>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="absolute top-2 right-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                        onClick={() => copyCode(codeExamples.createUrl.go, 'create-go')}
                      >
                        {copiedCode === 'create-go' ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

            {/* More Endpoints */}
            <Card>
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-4">
                  Additional Endpoints
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-secondary/30 dark:bg-muted border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded font-mono text-sm">
                          GET
                        </span>
                        <code className="text-sm">/api/v1/urls</code>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        List all your shortened URLs
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded text-xs">
                      urls:read
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-secondary/30 dark:bg-muted border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded font-mono text-sm">
                          GET
                        </span>
                        <code className="text-sm">/api/v1/analytics/urls/:shortId</code>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Get analytics for a specific URL
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded text-xs">
                      analytics:read
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-secondary/30 dark:bg-muted border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded font-mono text-sm">
                          DELETE
                        </span>
                        <code className="text-sm">/api/v1/urls/:shortId</code>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Delete a shortened URL
                      </p>
                    </div>
                    <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded text-xs">
                      urls:write
                    </span>
                  </div>
                </div>

                <div className="mt-6">
                  <Button
                    variant="outline"
                    onClick={() => window.open('https://api.orangeurl.live/docs', '_blank')}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View All Endpoints in Swagger
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Webhooks */}
        <motion.div
          id="webhooks"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Webhook className="w-8 h-8 text-orange-500" />
            Webhooks
          </h2>

          <Card className="mb-6">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-4">
                Real-Time Event Notifications
              </h3>
              <p className="text-muted-foreground mb-6">
                Webhooks allow your application to receive real-time notifications when events occur in OrangeURL.
                Perfect for automation, analytics, and integrations.
              </p>

              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="p-4 bg-secondary/30 dark:bg-muted border-2 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <h4 className="font-semibold">url.created</h4>
                    </div>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-bold rounded">
                      Pro + Premium
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Triggered when a new short URL is created
                  </p>
                </div>

                <div className="p-4 bg-secondary/30 dark:bg-muted border-2 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-green-600 dark:text-green-400" />
                      <h4 className="font-semibold">url.clicked</h4>
                    </div>
                    <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-xs font-bold rounded">
                      Pro + Premium
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Triggered when someone clicks a short URL
                  </p>
                </div>

                <div className="p-4 bg-secondary/30 dark:bg-muted border-2 rounded-lg opacity-75">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Bell className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      <h4 className="font-semibold">url.deleted</h4>
                    </div>
                    <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded">
                      Premium Only
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Triggered when a short URL is deleted
                  </p>
                </div>

                <div className="p-4 bg-secondary/30 dark:bg-muted border-2 rounded-lg opacity-75">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Activity className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                      <h4 className="font-semibold">url.expired</h4>
                    </div>
                    <span className="px-2 py-1 bg-orange-500 text-white text-xs font-bold rounded">
                      Premium Only
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Triggered when a short URL expires
                  </p>
                </div>
              </div>

              <div className="mb-8 p-4 bg-secondary/30 dark:bg-muted border rounded-lg">
                <p className="text-sm">
                  <strong>Tier Differences:</strong> Pro subscribers can use basic events (url.created, url.clicked).
                  Premium subscribers get access to all events plus automatic retry logic for failed webhook deliveries.
                </p>
              </div>

              <h4 className="text-lg font-semibold mb-4">
                Creating a Webhook
              </h4>

              <Tabs defaultValue="curl" className="w-full mb-8">
                <TabsList>
                  <TabsTrigger value="curl">cURL</TabsTrigger>
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                </TabsList>

                <TabsContent value="curl">
                  <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 relative border border-gray-300 dark:border-gray-700">
                    <pre className="text-sm text-gray-700 dark:text-gray-300 font-mono overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                      {codeExamples.createWebhook.curl}
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      onClick={() => copyCode(codeExamples.createWebhook.curl, 'webhook-curl')}
                    >
                      {copiedCode === 'webhook-curl' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="javascript">
                  <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 relative border border-gray-300 dark:border-gray-700">
                    <pre className="text-sm text-gray-700 dark:text-gray-300 font-mono overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                      {codeExamples.createWebhook.javascript}
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      onClick={() => copyCode(codeExamples.createWebhook.javascript, 'webhook-js')}
                    >
                      {copiedCode === 'webhook-js' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="python">
                  <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 relative border border-gray-300 dark:border-gray-700">
                    <pre className="text-sm text-gray-700 dark:text-gray-300 font-mono overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                      {codeExamples.createWebhook.python}
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      onClick={() => copyCode(codeExamples.createWebhook.python, 'webhook-py')}
                    >
                      {copiedCode === 'webhook-py' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              <h4 className="text-lg font-semibold mb-4">
                Webhook Handler Example
              </h4>
              <p className="text-muted-foreground mb-4">
                Implement a webhook endpoint in your application to receive events. Always verify the signature to
                ensure the request is from OrangeURL.
              </p>

              <Tabs defaultValue="javascript" className="w-full">
                <TabsList>
                  <TabsTrigger value="javascript">Express.js</TabsTrigger>
                  <TabsTrigger value="python">Flask</TabsTrigger>
                </TabsList>

                <TabsContent value="javascript">
                  <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 relative border border-gray-300 dark:border-gray-700">
                    <pre className="text-sm text-gray-700 dark:text-gray-300 font-mono overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                      {codeExamples.webhookHandler.javascript}
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      onClick={() => copyCode(codeExamples.webhookHandler.javascript, 'handler-js')}
                    >
                      {copiedCode === 'handler-js' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="python">
                  <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 relative border border-gray-300 dark:border-gray-700">
                    <pre className="text-sm text-gray-700 dark:text-gray-300 font-mono overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 dark:scrollbar-thumb-gray-600 scrollbar-track-transparent">
                      {codeExamples.webhookHandler.python}
                    </pre>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="absolute top-2 right-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                      onClick={() => copyCode(codeExamples.webhookHandler.python, 'handler-py')}
                    >
                      {copiedCode === 'handler-py' ? (
                        <CheckCircle2 className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>

              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex gap-3">
                  <Shield className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <h4 className="font-semibold text-yellow-900 dark:text-yellow-300 mb-1">
                      Security Best Practices
                    </h4>
                    <ul className="text-sm text-yellow-800 dark:text-yellow-400 space-y-1 list-disc list-inside">
                      <li>Always verify webhook signatures before processing events</li>
                      <li>Store webhook secrets securely in environment variables</li>
                      <li>Use HTTPS endpoints only for webhook URLs</li>
                      <li>Implement retry logic for failed webhook deliveries</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Rate Limits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <Activity className="w-8 h-8 text-orange-500" />
            Rate Limits
          </h2>

          <Card>
            <CardContent className="p-8">
              <p className="text-muted-foreground mb-6">
                API rate limits vary by subscription tier to ensure fair usage and system stability. API access is only available for Pro and Premium plans.
              </p>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-secondary/20 dark:bg-card border-2 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-lg font-semibold">Pro</h3>
                    <span className="px-3 py-1 bg-orange-500 text-white text-xs font-bold rounded-full">
                      $5/month
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Basic API Access</span>
                  </div>
                  <div className="text-4xl font-bold text-orange-500 mb-2">5,000</div>
                  <p className="text-sm text-muted-foreground mb-4">requests per hour</p>
                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground mb-3">
                      <strong>120,000 requests/month</strong>
                      <br />
                      <span className="text-green-600 dark:text-green-400">2.4x more than Bitly Core ($8/mo)</span>
                    </p>
                    <ul className="space-y-2 text-xs text-muted-foreground">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>Up to 5 API keys</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span>Standard webhooks (url.created, url.clicked)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-muted-foreground/50 mt-0.5">✗</span>
                        <span className="text-muted-foreground/50">No webhook retry logic</span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="p-6 bg-secondary/20 dark:bg-card border-2 border-orange-500 dark:border-orange-600 rounded-lg relative overflow-hidden">
                  <div className="absolute top-0 right-0 bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                    RECOMMENDED
                  </div>
                  <div className="flex items-center justify-between mb-3 mt-2">
                    <h3 className="text-lg font-semibold">Premium</h3>
                    <span className="px-3 py-1 bg-orange-600 text-white text-xs font-bold rounded-full">
                      $15/month
                    </span>
                  </div>
                  <div className="mb-2">
                    <span className="text-xs font-semibold text-orange-600 dark:text-orange-400 uppercase tracking-wide">Advanced API Access</span>
                  </div>
                  <div className="text-4xl font-bold text-orange-500 mb-2">20,000</div>
                  <p className="text-sm text-muted-foreground mb-4">requests per hour</p>
                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground mb-3">
                      <strong>480,000 requests/month</strong>
                      <br />
                      <span className="text-green-600 dark:text-green-400">3.2x more than Bitly Enterprise</span>
                    </p>
                    <ul className="space-y-2 text-xs">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span className="font-medium">Unlimited API keys</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span className="font-medium">All webhook events + retry logic</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span className="font-medium">Priority API support</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-0.5">✓</span>
                        <span className="font-medium">SLA guarantees</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <div className="flex gap-3">
                  <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-yellow-900 dark:text-yellow-300 mb-2">
                      <strong>Note:</strong> API access requires a Pro or Premium plan.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-4 bg-muted border rounded-lg">
                <p className="text-sm">
                  <strong>Rate limit headers:</strong> Check the{' '}
                  <code className="px-1 py-0.5 bg-background rounded">X-RateLimit-Limit</code> and{' '}
                  <code className="px-1 py-0.5 bg-background rounded">X-RateLimit-Remaining</code>{' '}
                  headers in API responses to monitor your usage.
                </p>
              </div>

              {/* Detailed Comparison Table */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold mb-4">
                  Feature Comparison
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2">
                        <th className="text-left py-3 px-4 font-semibold">Feature</th>
                        <th className="text-center py-3 px-4 font-semibold">Pro</th>
                        <th className="text-center py-3 px-4 font-semibold text-orange-600 dark:text-orange-400">Premium</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr>
                        <td className="py-3 px-4 text-muted-foreground">API Rate Limit</td>
                        <td className="py-3 px-4 text-center">5,000/hour</td>
                        <td className="py-3 px-4 text-center font-medium">20,000/hour</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-muted-foreground">Monthly Requests</td>
                        <td className="py-3 px-4 text-center">~120,000</td>
                        <td className="py-3 px-4 text-center font-medium">~480,000</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-muted-foreground">Max API Keys</td>
                        <td className="py-3 px-4 text-center">5</td>
                        <td className="py-3 px-4 text-center font-medium">Unlimited</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-muted-foreground">Webhook Events</td>
                        <td className="py-3 px-4 text-center">2 basic events</td>
                        <td className="py-3 px-4 text-center font-medium">All events</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-muted-foreground">Webhook Retry Logic</td>
                        <td className="py-3 px-4 text-center text-red-500 dark:text-red-400">✗</td>
                        <td className="py-3 px-4 text-center text-green-500 dark:text-green-400">✓</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-muted-foreground">Priority Support</td>
                        <td className="py-3 px-4 text-center text-muted-foreground/50">Standard</td>
                        <td className="py-3 px-4 text-center text-green-500 dark:text-green-400">✓ Priority</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-muted-foreground">SLA Guarantee</td>
                        <td className="py-3 px-4 text-center text-red-500 dark:text-red-400">✗</td>
                        <td className="py-3 px-4 text-center text-green-500 dark:text-green-400">✓ 99.9%</td>
                      </tr>
                      <tr>
                        <td className="py-3 px-4 text-muted-foreground">Custom Rate Limits</td>
                        <td className="py-3 px-4 text-center text-red-500 dark:text-red-400">✗</td>
                        <td className="py-3 px-4 text-center text-green-500 dark:text-green-400">✓ On request</td>
                      </tr>
                      <tr className="bg-muted/50">
                        <td className="py-3 px-4 font-semibold">Price</td>
                        <td className="py-3 px-4 text-center font-bold text-orange-600 dark:text-orange-400">$5/month</td>
                        <td className="py-3 px-4 text-center font-bold text-orange-600 dark:text-orange-400">$15/month</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Resources */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
            <FileCode className="w-8 h-8 text-orange-500" />
            Additional Resources
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => window.open('https://api.orangeurl.live/docs', '_blank')}>
              <CardContent className="p-6">
                <Terminal className="w-10 h-10 text-orange-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Interactive API Reference
                </h3>
                <p className="text-muted-foreground mb-4">
                  Try out all API endpoints with our Swagger UI documentation. Test requests in your browser.
                </p>
                <div className="flex items-center text-orange-500 font-medium">
                  Open Swagger Docs
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => window.location.href = '/api-keys'}>
              <CardContent className="p-6">
                <Key className="w-10 h-10 text-orange-500 mb-4" />
                <h3 className="text-lg font-semibold mb-2">
                  Manage API Keys
                </h3>
                <p className="text-muted-foreground mb-4">
                  Create, view, and manage your API keys. Configure permissions and set expiration dates.
                </p>
                <div className="flex items-center text-orange-500 font-medium">
                  Go to Dashboard
                  <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
