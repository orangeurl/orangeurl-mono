'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, RefreshCw, AlertCircle } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="flex flex-col lg:flex-row items-center justify-center gap-12">
          {/* Left Content */}
          <div className="flex-1 space-y-6">
            <div className="space-y-4">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground leading-tight">
                This link or QR Code
                <br />
                has been deactivated
              </h1>
              
              <p className="text-lg text-muted-foreground">
                Use{' '}
                <Link href="/" className="text-primary hover:text-primary/80 font-semibold transition-colors">
                  OrangeURL
                </Link>{' '}
                to create short links, QR Codes, and landing pages.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link href="/">
                  <Home className="w-4 h-4 mr-2" />
                  Go to Homepage
                </Link>
              </Button>
              
              <Button variant="outline" size="lg" onClick={() => window.location.reload()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>

          {/* Right Illustration */}
          <div className="flex-1 max-w-md">
            <div className="relative">
              {/* Browser Window */}
              <div className="bg-background border-2 border-border rounded-lg p-4 shadow-lg">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <div className="bg-muted rounded p-3 text-center text-sm text-muted-foreground">
                  https://orangeurl.live/broken-link
                </div>
              </div>

              {/* Error X Icon */}
              <div className="absolute -top-4 -right-4 bg-red-500 text-white rounded-full p-3 shadow-lg">
                <AlertCircle className="w-6 h-6" />
              </div>

              {/* Dotted Connection Lines */}
              <div className="absolute top-1/2 -left-8 w-8 h-px border-t-2 border-dashed border-muted-foreground/30"></div>
              <div className="absolute top-1/2 -right-8 w-8 h-px border-t-2 border-dashed border-muted-foreground/30"></div>

              {/* Short URL Box */}
              <div className="mt-8 bg-background border-2 border-primary/20 rounded-lg p-4 shadow-sm">
                <div className="text-sm font-medium text-foreground">
                  orangeurl.live/link
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Original link unavailable
                </div>
              </div>

              {/* QR Code Representation */}
              <div className="mt-6 bg-background border-2 border-border rounded-lg p-4 shadow-sm w-24 h-24 mx-auto">
                <div className="grid grid-cols-6 gap-1 h-full">
                  {Array.from({ length: 36 }).map((_, i) => (
                    <div
                      key={i}
                      className={`rounded-sm ${
                        Math.random() > 0.5 
                          ? 'bg-foreground' 
                          : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
                <div className="absolute top-2 left-2 w-2 h-2 bg-primary rounded-sm"></div>
              </div>

              {/* Mobile Phone */}
              <div className="absolute -right-12 top-12 hidden lg:block">
                <div className="bg-background border-2 border-border rounded-2xl p-3 w-16 h-28 shadow-lg">
                  <div className="bg-muted rounded-lg h-full relative">
                    <div className="absolute top-2 left-2 w-1 h-1 bg-primary rounded-full"></div>
                    <div className="absolute top-4 left-1 right-1 space-y-1">
                      <div className="h-px bg-muted-foreground/30"></div>
                      <div className="h-px bg-muted-foreground/30"></div>
                      <div className="h-px bg-muted-foreground/30"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Help Section */}
        <div className="mt-16 p-6 bg-muted/30 rounded-lg border border-border">
          <h3 className="text-lg font-semibold mb-2">What happened?</h3>
          <p className="text-muted-foreground text-sm">
            The link you're looking for may have been removed, had its name changed, 
            or is temporarily unavailable. Double-check the URL for any typos.
          </p>
        </div>
      </div>
    </div>
  );
} 