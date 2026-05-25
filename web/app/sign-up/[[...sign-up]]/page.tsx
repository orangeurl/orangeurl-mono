'use client';

import { SignUp } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { DarkModeToggle } from '@/components/DarkModeToggle';
import { useTheme } from 'next-themes';
import { dark } from '@clerk/themes';

export default function SignUpPage() {
  const { theme } = useTheme();

  return (
    <div className="min-h-screen h-screen flex overflow-hidden" style={{ backgroundColor: 'hsl(var(--background))' }}>
      {/* Left Side - Sign Up Form */}
      <div className="w-full lg:w-1/2 flex flex-col p-6 lg:p-8 relative overflow-y-auto">
        {/* Top Bar - Logo & Theme Toggle */}
        <div className="flex items-center justify-between mb-auto pb-6">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-10 h-10 bg-gradient-to-r from-primary to-orange-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <span className="text-xl font-bold gradient-text-primary">OrangeURL</span>
          </Link>
          <DarkModeToggle />
        </div>

        {/* Center Content - Form */}
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md">
            <SignUp 
              appearance={{
                baseTheme: theme === 'dark' ? dark : undefined,
                elements: {
                  formButtonPrimary: "bg-gradient-to-r from-primary to-orange-600 hover:opacity-90 transition-all",
                  footerActionLink: "text-primary hover:text-primary/80",
                },
              }}
              routing="path"
              path="/sign-up"
              signInUrl="/sign-in"
            />
          </div>
        </div>

        {/* Back Button - Bottom Left */}
        <div className="mt-auto pt-6">
          <Link 
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to home</span>
          </Link>
        </div>
      </div>

      {/* Right Side - Video Background with Rounded Corners */}
      <div className="hidden lg:flex lg:w-1/2 p-6 xl:p-8 items-center justify-center">
        <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl">
          {/* Video */}
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          >
            <source src="/videos/signin.mp4" type="video/mp4" />
          </video>

          {/* Subtle Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/5 via-transparent to-black/10" />

          {/* Text Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-10 xl:p-12 bg-gradient-to-t from-black/70 via-black/40 to-transparent">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <p className="text-white/90 text-base lg:text-lg mb-3 font-semibold">OrangeURL</p>
              <h2 className="text-white text-2xl lg:text-3xl font-bold leading-tight">
                Simplify your links, amplify your reach.
              </h2>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
