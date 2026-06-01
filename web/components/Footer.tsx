'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Mail, MessageCircle, Zap, Chrome } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.orangeurl.live';

export function Footer() {
  const [apiStatus, setApiStatus] = useState<'healthy' | 'down' | 'checking'>('checking');
  const { t } = useTranslation();

  useEffect(() => {
    const checkHealth = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/health`, {
          method: 'GET',
          signal: AbortSignal.timeout(5000), // 5 second timeout
        });

        if (response.ok) {
          setApiStatus('healthy');
        } else {
          setApiStatus('down');
        }
      } catch (error) {
        setApiStatus('down');
      }
    };

    // Check immediately
    checkHealth();

    // Check every 30 seconds
    const interval = setInterval(checkHealth, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <footer className="border-t border-border/40 bg-background/60 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Services */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg gradient-text-primary">{t.footer.services.title}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/features/short-links"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t.footer.services.shortLinks}
                </Link>
              </li>
              <li>
                <Link
                  href="/features/lock-links"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t.footer.services.lockLinks}
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t.footer.services.urlShortener}
                </Link>
              </li>
              <li>
                <Link
                  href="/utm-builder"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t.footer.services.utmBuilder}
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t.footer.services.qrCodes}
                </Link>
              </li>
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t.footer.services.linkAnalytics}
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg gradient-text-primary">{t.footer.company.title}</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/about" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t.footer.company.aboutUs}
                </Link>
              </li>
              <li>
                <Link 
                  href="/pricing" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t.footer.company.pricing}
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t.footer.company.blog}
                </Link>
              </li>
              <li>
                <Link 
                  href="/support" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t.footer.company.support}
                </Link>
              </li>
            </ul>
          </div>

          {/* Integrations */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg gradient-text-primary">{t.footer.integrations.title}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/integrations/zapier"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  {t.footer.integrations.zapier}
                </Link>
              </li>
              <li>
                <Link
                  href="/integrations/chrome-extension"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
                >
                  <Chrome className="w-4 h-4" />
                  {t.footer.integrations.chromeExtension}
                </Link>
              </li>
              <li>
                <Link
                  href="/webhooks"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t.footer.integrations.webhooks}
                </Link>
              </li>
              <li>
                <Link
                  href="/docs"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t.footer.integrations.apiDocs}
                </Link>
              </li>
              <li>
                <a
                  href="https://api.orangeurl.live/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t.footer.integrations.apiReference}
                </a>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg gradient-text-primary">{t.footer.legal.title}</h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t.footer.legal.terms}
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {t.footer.legal.privacy}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Community */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg gradient-text-primary">{t.footer.connect.title}</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="mailto:feature@orangeurl.live" 
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {t.footer.connect.featureRequests}
                </a>
              </li>
              <li>
                <a 
                  href="mailto:support@orangeurl.live" 
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  {t.footer.connect.emailSupport}
                </a>
              </li>
              <li>
                <a 
                  href="https://discord.gg/FvJtFw64WV" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-muted-foreground hover:text-primary transition-colors inline-flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  {t.footer.connect.discord}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border/40">
          <div className="flex flex-col items-center md:items-start gap-2">
            <div className="text-sm text-muted-foreground">
              {t.footer.copyright.replace('{year}', '2025')}
            </div>

            {/* API Status */}
            <div className="flex items-center gap-2 text-sm">
              <span className="text-muted-foreground">{t.footer.apiStatus.label}:</span>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      apiStatus === 'healthy'
                        ? 'bg-green-500'
                        : apiStatus === 'down'
                        ? 'bg-red-500'
                        : 'bg-yellow-500'
                    }`}
                  />
                  {apiStatus === 'healthy' && (
                    <div className="absolute inset-0 w-2 h-2 rounded-full bg-green-500 animate-ping opacity-75" />
                  )}
                </div>
                <span
                  className={`font-medium ${
                    apiStatus === 'healthy'
                      ? 'text-green-600 dark:text-green-400'
                      : apiStatus === 'down'
                      ? 'text-red-600 dark:text-red-400'
                      : 'text-yellow-600 dark:text-yellow-400'
                  }`}
                >
                  {apiStatus === 'healthy' ? t.footer.apiStatus.healthy : apiStatus === 'down' ? t.footer.apiStatus.down : t.footer.apiStatus.checking}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-4">
            <div className="text-sm text-muted-foreground">
              {t.footer.madeWith} <span className="text-primary">❤</span> {t.footer.forBusinesses}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
