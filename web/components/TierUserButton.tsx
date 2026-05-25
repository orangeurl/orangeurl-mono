'use client';

import { useState, useEffect } from 'react';
import { UserButton, useAuth } from '@clerk/nextjs';
import { User, CreditCard, Key, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface TierUserButtonProps {
  tier?: 'free' | 'pro' | 'premium';
  className?: string;
}

export function TierUserButton({ tier = 'free', className }: TierUserButtonProps) {
  const router = useRouter();
  const { getToken } = useAuth();
  const [portalUrl, setPortalUrl] = useState<string | null>(null);
  const [showBillingDialog, setShowBillingDialog] = useState(false);
  const [hasTeamAccess, setHasTeamAccess] = useState(false);
  const isPaidTier = tier === 'pro' || tier === 'premium';

  // Check if user has team access (premium tier OR is a team member)
  useEffect(() => {
    const checkTeamAccess = async () => {
      if (tier === 'premium') {
        setHasTeamAccess(true);
        return;
      }
      
      // Check if user is part of a team (even if free tier)
      try {
        const token = await getToken();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teams/my-team`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setHasTeamAccess(response.ok);
      } catch (error) {
        setHasTeamAccess(false);
      }
    };
    
    checkTeamAccess();
  }, [tier, getToken]);

  // Fetch customer portal URL for paid users
  useEffect(() => {
    if (isPaidTier) {
      fetch('/api/user/billing-portal')
        .then(res => res.json())
        .then(data => {
          if (data.portalUrl) {
            setPortalUrl(data.portalUrl);
          }
        })
        .catch(err => {
          console.error('Failed to fetch portal URL:', err);
        });
    }
  }, [isPaidTier]);

  // Get tier label
  const getTierLabel = () => {
    switch (tier) {
      case 'premium':
        return 'Premium';
      case 'pro':
        return 'Pro';
      default:
        return 'Free';
    }
  };

  return (
    <>
      <div className={cn("relative inline-block", className)}>
        <style jsx global>{`
          .cl-userButtonPopoverCard .cl-userPreviewMainIdentifier,
          .cl-userButtonPopoverCard .cl-userPreviewSecondaryIdentifier {
            color: #1F2937 !important;
            font-weight: 700 !important;
          }

          /* Make all action buttons have the same style */
          .cl-userButtonPopoverCard .cl-userButtonPopoverActionButton {
            color: #0f172a !important;
            font-weight: 600 !important;
          }

          .cl-userButtonPopoverCard .cl-userButtonPopoverActionButton__label {
            color: #0f172a !important;
            font-weight: 600 !important;
            opacity: 1 !important;
            font-size: 0.875rem !important;
          }

          .cl-userButtonPopoverCard .cl-userButtonPopoverActionButton:hover {
            background-color: #FFF7ED !important;
          }

          .cl-userButtonPopoverCard .cl-userButtonPopoverActionButton:hover .cl-userButtonPopoverActionButton__label {
            color: #EA580C !important;
          }

          .cl-userButtonPopoverCard .cl-userButtonPopoverActionButtonIcon {
            color: #0f172a !important;
            opacity: 1 !important;
          }

          .cl-userButtonPopoverCard .cl-userButtonPopoverActionButton:hover .cl-userButtonPopoverActionButtonIcon {
            color: #EA580C !important;
          }
        `}</style>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-8 h-8",
              userButtonPopoverCard: "shadow-2xl border border-gray-200 bg-white dark:bg-gray-900 dark:border-gray-800 min-w-0 w-56",
              userButtonPopoverMain: "p-2",
              userButtonPopoverFooter: "hidden",
              userPreviewMainIdentifier: "text-sm font-medium !text-gray-900",
              userPreviewSecondaryIdentifier: "text-xs !text-gray-900",
              userButtonPopoverActionButton: "text-sm py-1.5 px-2 rounded-md transition-all !text-slate-900 !font-semibold hover:bg-orange-50 hover:!text-orange-600",
              userButtonPopoverActionButtonIcon: "w-4 h-4 !text-slate-900",
              userButtonPopoverActions: "space-y-0.5",
            },
            variables: {
              borderRadius: "8px",
              spacingUnit: "0.5rem"
            }
          }}
        >
          <UserButton.MenuItems>
            {/* Tier Display */}
            <UserButton.Action
              label={`Plan: ${getTierLabel()}`}
              labelIcon={<User className="w-4 h-4" />}
              onClick={() => {}}
            />

            {/* Team - For Premium users OR team members */}
            {hasTeamAccess && (
              <UserButton.Action
                label="Team"
                labelIcon={<Users className="w-4 h-4" />}
                onClick={() => {
                  router.push('/team');
                }}
              />
            )}

            {/* API Keys - Only for Pro/Premium users */}
            {isPaidTier && (
              <UserButton.Action
                label="API Keys"
                labelIcon={<Key className="w-4 h-4" />}
                onClick={() => {
                  router.push('/api-keys');
                }}
              />
            )}

            {/* Billing/Invoice Link - Only for paid users */}
            {isPaidTier && (
              <UserButton.Action
                label="Billing & Invoices"
                labelIcon={<CreditCard className="w-4 h-4" />}
                onClick={() => {
                  setShowBillingDialog(true);
                }}
              />
            )}
          </UserButton.MenuItems>
        </UserButton>
      </div>

      {/* Billing Dialog */}
      <AlertDialog open={showBillingDialog} onOpenChange={setShowBillingDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Invoice Sent</AlertDialogTitle>
            <AlertDialogDescription>
              Your invoice has been sent to your email address on the purchase date. Please check your inbox for billing details.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowBillingDialog(false)}>
              Got it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
