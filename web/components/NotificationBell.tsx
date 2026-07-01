'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useAuth } from '@clerk/nextjs';
import { Bell, Check, CheckCheck, Trash2, AlertTriangle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from '@/components/ui/dropdown-menu';

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string;
  short_id?: string;
  is_read: boolean;
  created_at: string;
};

function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const secs = Math.floor((Date.now() - then) / 1000);
  if (secs < 60) return 'just now';
  const mins = Math.floor(secs / 60);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function NotificationBell() {
  const { isSignedIn } = useAuth();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState<Set<string>>(new Set());
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications/unread-count');
      if (res.ok) {
        const data = await res.json();
        setUnread(data.unread_count || 0);
      }
    } catch {
      /* silent — badge just stays put */
    }
  }, []);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setItems(data.notifications || []);
        setUnread(data.unread_count || 0);
      }
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, []);

  // Poll the unread count while signed in.
  useEffect(() => {
    if (!isSignedIn) return;
    fetchCount();
    pollRef.current = setInterval(fetchCount, 60000);
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, [isSignedIn, fetchCount]);

  // Load the full list whenever the panel opens.
  useEffect(() => {
    if (open) fetchList();
  }, [open, fetchList]);

  const withBusy = async (id: string, fn: () => Promise<void>) => {
    setBusy(prev => new Set(prev).add(id));
    try {
      await fn();
    } finally {
      setBusy(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  };

  const markRead = (id: string) =>
    withBusy(id, async () => {
      const res = await fetch(`/api/notifications/${id}/read`, { method: 'POST' });
      if (res.ok) {
        setItems(prev => prev.map(n => (n.id === id ? { ...n, is_read: true } : n)));
        setUnread(prev => Math.max(0, prev - 1));
      }
    });

  const remove = (id: string) =>
    withBusy(id, async () => {
      const res = await fetch(`/api/notifications/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems(prev => prev.filter(n => n.id !== id));
        fetchCount();
      }
    });

  const markAllRead = async () => {
    const res = await fetch('/api/notifications/read-all', { method: 'POST' });
    if (res.ok) {
      setItems(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnread(0);
    }
  };

  if (!isSignedIn) return null;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative" aria-label="Notifications">
          <Bell className="h-4 w-4" />
          {unread > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center">
              {unread > 99 ? '99+' : unread}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[360px] max-w-[calc(100vw-2rem)] p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Notifications</span>
            {unread > 0 && (
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-primary/10 text-primary">
                {unread} new
              </span>
            )}
          </div>
          {unread > 0 && (
            <button
              onClick={markAllRead}
              className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
          )}
        </div>

        <div className="max-h-[420px] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
              <Bell className="w-8 h-8 text-muted-foreground/40 mb-2" />
              <p className="text-sm text-muted-foreground">You&apos;re all caught up</p>
            </div>
          ) : (
            items.map(n => (
              <div
                key={n.id}
                className={`group relative flex gap-3 px-4 py-3 border-b last:border-0 transition-colors ${
                  n.is_read ? 'bg-transparent' : 'bg-primary/[0.04]'
                }`}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {n.type === 'url_flagged' ? (
                    <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <Bell className="w-4 h-4 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-sm font-medium leading-snug">{n.title}</p>
                    {!n.is_read && <span className="mt-1 w-2 h-2 rounded-full bg-primary flex-shrink-0" />}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 break-words">{n.message}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[11px] text-muted-foreground">{timeAgo(n.created_at)}</span>
                    {!n.is_read && (
                      <button
                        onClick={() => markRead(n.id)}
                        disabled={busy.has(n.id)}
                        className="text-[11px] text-primary hover:underline flex items-center gap-0.5"
                      >
                        <Check className="w-3 h-3" />
                        Mark read
                      </button>
                    )}
                    <button
                      onClick={() => remove(n.id)}
                      disabled={busy.has(n.id)}
                      className="text-[11px] text-muted-foreground hover:text-red-600 flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      {busy.has(n.id) ? <Loader2 className="w-3 h-3 animate-spin" /> : <Trash2 className="w-3 h-3" />}
                      Dismiss
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
