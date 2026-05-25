'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { ParticleBackground } from '@/components/ParticleBackground';

export default function Template({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Don't show navbar/footer on auth pages
  const isAuthPage = pathname?.startsWith('/sign-in') || pathname?.startsWith('/sign-up');

  return (
    <>
      {!isAuthPage && (
        <>
          <ParticleBackground />
          <Navbar />
        </>
      )}
      
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
          className={!isAuthPage ? 'container mx-auto px-4 py-8 min-h-screen' : ''}
        >
          {children}
        </motion.main>
      </AnimatePresence>
      
      {!isAuthPage && <Footer />}
    </>
  );
}
