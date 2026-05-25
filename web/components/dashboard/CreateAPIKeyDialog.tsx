'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, Shield, Clock } from 'lucide-react';

interface CreateAPIKeyDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (name: string, permissions: string[], expiresIn?: number) => Promise<void>;
}

const PERMISSION_OPTIONS = [
  { value: 'urls:read', label: 'Read URLs', description: 'View URL details and list' },
  { value: 'urls:write', label: 'Write URLs', description: 'Create and update URLs' },
  { value: 'analytics:read', label: 'Read Analytics', description: 'View click analytics' },
  { value: 'webhooks:read', label: 'Read Webhooks', description: 'View webhook configurations' },
  { value: 'webhooks:write', label: 'Write Webhooks', description: 'Create and update webhooks' },
];

const EXPIRY_OPTIONS = [
  { value: 'never', label: 'Never expires' },
  { value: '30', label: '30 days' },
  { value: '90', label: '90 days' },
  { value: '180', label: '180 days' },
  { value: '365', label: '1 year' },
];

export function CreateAPIKeyDialog({ open, onClose, onConfirm }: CreateAPIKeyDialogProps) {
  const [name, setName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([
    'urls:read',
    'urls:write',
    'analytics:read',
  ]);
  const [expiry, setExpiry] = useState('never');
  const [loading, setLoading] = useState(false);

  function togglePermission(permission: string) {
    if (selectedPermissions.includes(permission)) {
      setSelectedPermissions(selectedPermissions.filter((p) => p !== permission));
    } else {
      setSelectedPermissions([...selectedPermissions, permission]);
    }
  }

  async function handleSubmit() {
    if (!name.trim()) {
      return;
    }

    if (selectedPermissions.length === 0) {
      return;
    }

    setLoading(true);
    try {
      const expiresIn = expiry === 'never' ? undefined : parseInt(expiry);
      await onConfirm(name, selectedPermissions, expiresIn);
      // Reset form
      setName('');
      setSelectedPermissions(['urls:read', 'urls:write', 'analytics:read']);
      setExpiry('never');
    } finally {
      setLoading(false);
    }
  }

  function handleClose() {
    if (!loading) {
      setName('');
      setSelectedPermissions(['urls:read', 'urls:write', 'analytics:read']);
      setExpiry('never');
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-orange-500" />
            Create New API Key
          </DialogTitle>
          <DialogDescription>
            Create an API key to authenticate requests to the OrangeURL API.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4 overflow-y-auto flex-1 scrollbar-hide">
          {/* Name Input */}
          <div className="space-y-2">
            <Label htmlFor="name">Key Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Production Server, Mobile App, Testing"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
            />
            <p className="text-sm text-gray-500">
              Give your API key a descriptive name to identify where it's used.
            </p>
          </div>

          {/* Permissions */}
          <div className="space-y-3">
            <Label>Permissions *</Label>
            <div className="space-y-2 border dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
              {PERMISSION_OPTIONS.map((option) => (
                <label
                  key={option.value}
                  className="flex items-start gap-3 cursor-pointer hover:bg-white dark:hover:bg-gray-700 p-2 rounded transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={selectedPermissions.includes(option.value)}
                    onChange={() => togglePermission(option.value)}
                    disabled={loading}
                    className="mt-1 w-4 h-4 text-orange-500 border-gray-300 dark:border-gray-600 rounded focus:ring-orange-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900 dark:text-white">{option.label}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>
            {selectedPermissions.length === 0 && (
              <p className="text-sm text-red-500 dark:text-red-400">Select at least one permission</p>
            )}
          </div>

          {/* Expiry */}
          <div className="space-y-2">
            <Label htmlFor="expiry" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Expiration
            </Label>
            <Select value={expiry} onValueChange={setExpiry} disabled={loading}>
              <SelectTrigger id="expiry">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {EXPIRY_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-500">
              Set an expiration date for added security. The key will stop working after this period.
            </p>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 dark:bg-yellow-900/30 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
            <div className="flex gap-3">
              <div className="flex-shrink-0">⚠️</div>
              <div className="text-sm text-yellow-800 dark:text-yellow-400">
                <strong className="font-semibold">Important:</strong> The full API key will only be shown once after creation. Make sure to copy and store it securely!
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={loading || !name.trim() || selectedPermissions.length === 0}
            className="bg-orange-500 hover:bg-orange-600"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              'Create API Key'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
