'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth, SignedIn, SignedOut } from '@clerk/nextjs';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Link as LinkIcon,
  Trash2,
  Search,
  Shield,
  ShieldAlert,
  Database,
  Server,
  CheckCircle2,
  XCircle,
  Loader2,
  AlertTriangle,
  Lock,
  RefreshCw,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Mail,
  Clock,
  Activity,
  Zap,
  Users,
  X,
  User,
  ArrowLeft,
  Globe,
  Ban,
  Plus,
  ShieldBan,
  UserX,
  UserCheck,
} from 'lucide-react';

// --- Types ---

type AdminURL = {
  id: string;
  short_id: string;
  original_url: string;
  is_active: boolean;
  is_locked: boolean;
  created_at: string;
  owner_email: string;
  expiry?: string;
};

type SortField = 'created_at' | 'short_id' | 'owner_email';
type SortDir = 'asc' | 'desc';
type FilterStatus = 'all' | 'active' | 'inactive';

type UserSummary = {
  email: string;
  total: number;
  active: number;
  inactive: number;
  locked: number;
  latest: string;
};

type BlockedDomain = {
  id: string;
  domain: string;
  include_subdomains: boolean;
  block_reason: string;
  created_at: string;
};

type AdminUser = {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  subscription_tier: string;
  is_admin: boolean;
  is_banned: boolean;
  avatar_url?: string;
  created_at: string;
};

export default function AdminPage() {
  // --- URL State ---
  const [urls, setUrls] = useState<AdminURL[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [accessDenied, setAccessDenied] = useState(false);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('all');
  const [sortField, setSortField] = useState<SortField>('created_at');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [deleteTarget, setDeleteTarget] = useState<AdminURL | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState<Set<string>>(new Set());
  const [selectedUser, setSelectedUser] = useState<string | null>(null);

  // --- Domain Blocking State ---
  const [blockedDomains, setBlockedDomains] = useState<BlockedDomain[]>([]);
  const [domainsLoading, setDomainsLoading] = useState(false);
  const [newDomain, setNewDomain] = useState('');
  const [newDomainReason, setNewDomainReason] = useState('');
  const [includeSubdomains, setIncludeSubdomains] = useState(true);
  const [addingDomain, setAddingDomain] = useState(false);
  const [removingDomain, setRemovingDomain] = useState<Set<string>>(new Set());
  const [domainDeleteTarget, setDomainDeleteTarget] = useState<BlockedDomain | null>(null);

  // --- User Management State ---
  const [allUsers, setAllUsers] = useState<AdminUser[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState('');
  const [banTarget, setBanTarget] = useState<AdminUser | null>(null);
  const [banningUser, setBanningUser] = useState<Set<string>>(new Set());

  const { toast } = useToast();
  const { isSignedIn } = useAuth();

  // --- URL Fetch ---
  const fetchURLs = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setAccessDenied(false);

      const response = await fetch('/api/admin/urls');

      if (response.status === 403) {
        setAccessDenied(true);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to fetch URLs');
      }

      const data = await response.json();
      setUrls(data.urls || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load URLs');
    } finally {
      setLoading(false);
    }
  }, []);

  // --- Domain Fetch ---
  const fetchBlockedDomains = useCallback(async () => {
    try {
      setDomainsLoading(true);
      const response = await fetch('/api/admin/domains');
      if (response.status === 403) {
        setAccessDenied(true);
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch blocked domains');
      const data = await response.json();
      setBlockedDomains(data.blocked_domains || []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load blocked domains', variant: 'error' });
    } finally {
      setDomainsLoading(false);
    }
  }, [toast]);

  // --- Users Fetch ---
  const fetchUsers = useCallback(async () => {
    try {
      setUsersLoading(true);
      const response = await fetch('/api/admin/users');
      if (response.status === 403) {
        setAccessDenied(true);
        return;
      }
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      setAllUsers(data.users || []);
    } catch {
      toast({ title: 'Error', description: 'Failed to load users', variant: 'error' });
    } finally {
      setUsersLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (isSignedIn) {
      fetchURLs();
      fetchBlockedDomains();
      fetchUsers();
    } else {
      setLoading(false);
    }
  }, [isSignedIn, fetchURLs, fetchBlockedDomains, fetchUsers]);

  // --- URL helpers ---
  const userSummaries = useMemo(() => {
    const map = new Map<string, UserSummary>();
    for (const u of urls) {
      const email = u.owner_email || '(anonymous)';
      const existing = map.get(email);
      if (existing) {
        existing.total++;
        if (u.is_active) existing.active++;
        else existing.inactive++;
        if (u.is_locked) existing.locked++;
        if (new Date(u.created_at) > new Date(existing.latest)) {
          existing.latest = u.created_at;
        }
      } else {
        map.set(email, {
          email,
          total: 1,
          active: u.is_active ? 1 : 0,
          inactive: u.is_active ? 0 : 1,
          locked: u.is_locked ? 1 : 0,
          latest: u.created_at,
        });
      }
    }
    const arr = Array.from(map.values());
    arr.sort((a, b) => b.total - a.total);
    return arr;
  }, [urls]);

  const filteredAndSorted = useMemo(() => {
    let result = urls;

    if (selectedUser) {
      result = result.filter(u =>
        selectedUser === '(anonymous)' ? !u.owner_email : u.owner_email === selectedUser
      );
    }

    if (filterStatus !== 'all') {
      result = result.filter(u =>
        filterStatus === 'active' ? u.is_active : !u.is_active
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        u =>
          u.short_id.toLowerCase().includes(q) ||
          u.original_url.toLowerCase().includes(q) ||
          u.owner_email.toLowerCase().includes(q)
      );
    }

    result = [...result].sort((a, b) => {
      let cmp = 0;
      if (sortField === 'created_at') {
        cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      } else if (sortField === 'short_id') {
        cmp = a.short_id.localeCompare(b.short_id);
      } else {
        cmp = a.owner_email.localeCompare(b.owner_email);
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [urls, search, filterStatus, sortField, sortDir, selectedUser]);

  const stats = useMemo(() => ({
    total: urls.length,
    active: urls.filter(u => u.is_active).length,
    inactive: urls.filter(u => !u.is_active).length,
    locked: urls.filter(u => u.is_locked).length,
    users: new Set(urls.map(u => u.owner_email || '(anonymous)')).size,
  }), [urls]);

  const handleDelete = async (url: AdminURL) => {
    setDeleting(prev => new Set(prev).add(url.id));
    try {
      const response = await fetch(`/api/admin/urls/${url.id}`, { method: 'DELETE' });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to delete');
      }

      setUrls(prev => prev.filter(u => u.id !== url.id));
      setSelectedIds(prev => {
        const next = new Set(prev);
        next.delete(url.id);
        return next;
      });

      toast({
        title: 'Permanently Deleted',
        description: `${url.short_id} removed from PostgreSQL & Redis`,
        variant: 'success',
        icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
      });
    } catch (err) {
      toast({
        title: 'Delete Failed',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'error',
        icon: <XCircle className="h-5 w-5 text-red-600" />,
      });
    } finally {
      setDeleting(prev => {
        const next = new Set(prev);
        next.delete(url.id);
        return next;
      });
      setDeleteTarget(null);
    }
  };

  const handleBulkDelete = async () => {
    const idsToDelete = Array.from(selectedIds);
    const urlsToDelete = urls.filter(u => idsToDelete.includes(u.id));
    for (const url of urlsToDelete) {
      await handleDelete(url);
    }
    setBulkDeleteOpen(false);
    setSelectedIds(new Set());
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filteredAndSorted.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredAndSorted.map(u => u.id)));
    }
  };

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDir('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return null;
    return sortDir === 'asc' ? (
      <ChevronUp className="w-3.5 h-3.5 inline ml-0.5" />
    ) : (
      <ChevronDown className="w-3.5 h-3.5 inline ml-0.5" />
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Unknown';
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Unknown';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const handleUserClick = (email: string) => {
    setSelectedUser(email);
    setSearch('');
    setFilterStatus('all');
    setSelectedIds(new Set());
  };

  const clearUserFilter = () => {
    setSelectedUser(null);
    setSelectedIds(new Set());
  };

  // --- Domain helpers ---
  const handleAddDomain = async () => {
    if (!newDomain.trim()) return;
    setAddingDomain(true);
    try {
      const response = await fetch('/api/admin/domains', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain: newDomain.trim(),
          include_subdomains: includeSubdomains,
          block_reason: newDomainReason.trim() || 'Blocked by admin',
        }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to block domain');
      }
      const data = await response.json();
      setBlockedDomains(prev => [{
        id: data.id,
        domain: data.domain,
        include_subdomains: data.include_subdomains,
        block_reason: data.block_reason,
        created_at: data.created_at,
      }, ...prev]);
      setNewDomain('');
      setNewDomainReason('');
      setIncludeSubdomains(true);
      toast({
        title: 'Domain Blocked',
        description: `${data.domain} and ${data.include_subdomains ? 'all subdomains' : 'exact match only'} blocked`,
        variant: 'success',
        icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
      });
    } catch (err) {
      toast({
        title: 'Failed to Block Domain',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'error',
      });
    } finally {
      setAddingDomain(false);
    }
  };

  const handleRemoveDomain = async (domain: BlockedDomain) => {
    setRemovingDomain(prev => new Set(prev).add(domain.id));
    try {
      const response = await fetch(`/api/admin/domains/${domain.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to unblock domain');
      setBlockedDomains(prev => prev.filter(d => d.id !== domain.id));
      toast({
        title: 'Domain Unblocked',
        description: `${domain.domain} removed from blocked list`,
        variant: 'success',
        icon: <CheckCircle2 className="h-5 w-5 text-emerald-600" />,
      });
    } catch (err) {
      toast({
        title: 'Failed to Unblock',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'error',
      });
    } finally {
      setRemovingDomain(prev => {
        const next = new Set(prev);
        next.delete(domain.id);
        return next;
      });
      setDomainDeleteTarget(null);
    }
  };

  // --- User ban helpers ---
  const filteredUsers = useMemo(() => {
    if (!userSearch.trim()) return allUsers;
    const q = userSearch.toLowerCase();
    return allUsers.filter(
      u =>
        u.email.toLowerCase().includes(q) ||
        u.first_name.toLowerCase().includes(q) ||
        u.last_name.toLowerCase().includes(q)
    );
  }, [allUsers, userSearch]);

  const handleBanUser = async (targetUser: AdminUser) => {
    setBanningUser(prev => new Set(prev).add(targetUser.id));
    try {
      const endpoint = targetUser.is_banned
        ? `/api/admin/users/${targetUser.id}/unban`
        : `/api/admin/users/${targetUser.id}/ban`;
      const response = await fetch(endpoint, { method: 'POST' });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || 'Failed');
      }
      setAllUsers(prev =>
        prev.map(u => u.id === targetUser.id ? { ...u, is_banned: !u.is_banned } : u)
      );
      toast({
        title: targetUser.is_banned ? 'User Unbanned' : 'User Banned',
        description: `${targetUser.email} has been ${targetUser.is_banned ? 'unbanned' : 'banned'}`,
        variant: 'success',
        icon: targetUser.is_banned
          ? <UserCheck className="h-5 w-5 text-emerald-600" />
          : <UserX className="h-5 w-5 text-red-600" />,
      });
    } catch (err) {
      toast({
        title: 'Action Failed',
        description: err instanceof Error ? err.message : 'Unknown error',
        variant: 'error',
      });
    } finally {
      setBanningUser(prev => {
        const next = new Set(prev);
        next.delete(targetUser.id);
        return next;
      });
      setBanTarget(null);
    }
  };

  // -- Access Denied --
  if (accessDenied) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <Card className="max-w-md w-full text-center">
            <CardHeader className="pb-2">
              <div className="mx-auto w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center mb-4">
                <ShieldAlert className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h2 className="text-2xl font-bold">Access Denied</h2>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                You don&apos;t have admin privileges to access this page. Contact your system administrator.
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <SignedOut>
        <div className="min-h-screen flex items-center justify-center p-4">
          <Card className="max-w-md w-full text-center">
            <CardHeader className="pb-2">
              <div className="mx-auto w-16 h-16 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-4">
                <Shield className="w-8 h-8 text-orange-600" />
              </div>
              <h2 className="text-2xl font-bold">Admin Panel</h2>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Please sign in with an admin account to continue.</p>
            </CardContent>
          </Card>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="min-h-screen bg-background">
          {/* Header */}
          <div className="border-b bg-card/50 backdrop-blur-sm sticky top-16 z-40">
            <div className="container mx-auto px-4 py-4">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500 to-red-600 shadow-lg">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold gradient-text-primary">Admin Panel</h1>
                    <p className="text-xs text-muted-foreground">URL Management Console</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" onClick={() => { fetchURLs(); fetchBlockedDomains(); fetchUsers(); }} disabled={loading} className="gap-1.5">
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </motion.div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-6 space-y-6">
            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-2 md:grid-cols-5 gap-3"
            >
              {[
                { label: 'Total URLs', value: stats.total, icon: Database, color: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/30' },
                { label: 'Active', value: stats.active, icon: Activity, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30' },
                { label: 'Inactive', value: stats.inactive, icon: XCircle, color: 'text-red-600 dark:text-red-400', bg: 'bg-red-100 dark:bg-red-900/30' },
                { label: 'Locked', value: stats.locked, icon: Lock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30' },
                { label: 'Users', value: stats.users, icon: Users, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
                >
                  <Card className="relative overflow-hidden">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                          <p className="text-2xl font-bold mt-1">{loading ? '-' : stat.value}</p>
                        </div>
                        <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center`}>
                          <stat.icon className={`w-5 h-5 ${stat.color}`} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>

            {/* Tabs */}
            <Tabs defaultValue="urls" className="space-y-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="urls" className="gap-1.5">
                  <LinkIcon className="w-3.5 h-3.5" />
                  URLs
                </TabsTrigger>
                <TabsTrigger value="domains" className="gap-1.5">
                  <Globe className="w-3.5 h-3.5" />
                  Blocked Domains
                </TabsTrigger>
                <TabsTrigger value="users" className="gap-1.5">
                  <Users className="w-3.5 h-3.5" />
                  Users
                </TabsTrigger>
              </TabsList>

              {/* ===== URLS TAB ===== */}
              <TabsContent value="urls" className="space-y-4">
                {/* User Breakdown */}
                {!loading && !error && !selectedUser && userSummaries.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                  >
                    <Card>
                      <CardHeader className="pb-3 pt-4 px-4">
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          <h2 className="text-sm font-semibold">Users ({userSummaries.length})</h2>
                          <span className="text-xs text-muted-foreground">- click to view their URLs</span>
                        </div>
                      </CardHeader>
                      <CardContent className="px-4 pb-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                          {userSummaries.map(user => (
                            <button
                              key={user.email}
                              onClick={() => handleUserClick(user.email)}
                              className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 hover:border-orange-300 dark:hover:border-orange-700 transition-all text-left group"
                            >
                              <div className="flex items-center gap-2.5 min-w-0">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40 flex items-center justify-center flex-shrink-0">
                                  <User className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                </div>
                                <div className="min-w-0">
                                  <p className="text-sm font-medium truncate">{user.email}</p>
                                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span>{user.total} URL{user.total !== 1 ? 's' : ''}</span>
                                    <span className="text-emerald-600 dark:text-emerald-400">{user.active} active</span>
                                    {user.inactive > 0 && (
                                      <span className="text-red-500">{user.inactive} inactive</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-orange-600 transition-colors flex-shrink-0" />
                            </button>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {/* User filter banner */}
                <AnimatePresence>
                  {selectedUser && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Card className="border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20">
                        <CardContent className="p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm" onClick={clearUserFilter} className="h-7 w-7 p-0">
                              <ArrowLeft className="w-4 h-4" />
                            </Button>
                            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            <span className="text-sm font-medium">
                              Showing URLs for <span className="text-blue-600 dark:text-blue-400 font-semibold">{selectedUser}</span>
                            </span>
                            <span className="text-xs text-muted-foreground">
                              ({filteredAndSorted.length} URL{filteredAndSorted.length !== 1 ? 's' : ''})
                            </span>
                          </div>
                          <Button variant="ghost" size="sm" onClick={clearUserFilter} className="h-7 px-2 text-xs gap-1">
                            <X className="w-3 h-3" />
                            Clear
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Search & Filters */}
                <Card>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="Search by short ID, URL, or email..."
                          value={search}
                          onChange={e => setSearch(e.target.value)}
                          className="pl-9"
                        />
                      </div>
                      <div className="flex gap-2">
                        {(['all', 'active', 'inactive'] as FilterStatus[]).map(status => (
                          <Button
                            key={status}
                            variant={filterStatus === status ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilterStatus(status)}
                            className="capitalize"
                          >
                            {status}
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Bulk Actions */}
                    <AnimatePresence>
                      {selectedIds.size > 0 && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <div className="flex items-center justify-between mt-3 pt-3 border-t">
                            <span className="text-sm text-muted-foreground">
                              <span className="font-semibold text-foreground">{selectedIds.size}</span> selected
                            </span>
                            <Button variant="destructive" size="sm" onClick={() => setBulkDeleteOpen(true)} className="gap-1.5">
                              <Trash2 className="w-3.5 h-3.5" />
                              Delete Selected
                            </Button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </CardContent>
                </Card>

                {/* Loading */}
                {loading && (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
                  </div>
                )}

                {/* Error */}
                {error && !loading && (
                  <Card className="border-red-200 dark:border-red-900/50">
                    <CardContent className="p-6 text-center">
                      <AlertTriangle className="w-10 h-10 text-red-500 mx-auto mb-3" />
                      <p className="font-medium text-red-600 dark:text-red-400">{error}</p>
                      <Button variant="outline" size="sm" onClick={fetchURLs} className="mt-3">
                        Retry
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Empty */}
                {!loading && !error && filteredAndSorted.length === 0 && (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Database className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium text-muted-foreground">
                        {search || filterStatus !== 'all' || selectedUser ? 'No URLs match your filters' : 'No URLs found'}
                      </p>
                      {selectedUser && (
                        <Button variant="outline" size="sm" onClick={clearUserFilter} className="mt-3">
                          Clear user filter
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )}

                {/* URL Table */}
                {!loading && !error && filteredAndSorted.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                  >
                    {/* Desktop Table */}
                    <Card className="hidden md:block overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b bg-muted/50">
                              <th className="px-4 py-3 text-left w-10">
                                <input
                                  type="checkbox"
                                  checked={selectedIds.size === filteredAndSorted.length && filteredAndSorted.length > 0}
                                  onChange={toggleSelectAll}
                                  className="rounded border-input accent-orange-600"
                                />
                              </th>
                              <th className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground select-none" onClick={() => toggleSort('short_id')}>
                                Short ID <SortIcon field="short_id" />
                              </th>
                              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Original URL</th>
                              <th className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground select-none" onClick={() => toggleSort('owner_email')}>
                                Owner <SortIcon field="owner_email" />
                              </th>
                              <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                              <th className="px-4 py-3 text-left font-medium text-muted-foreground cursor-pointer hover:text-foreground select-none" onClick={() => toggleSort('created_at')}>
                                Created <SortIcon field="created_at" />
                              </th>
                              <th className="px-4 py-3 text-right font-medium text-muted-foreground">Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            <AnimatePresence mode="popLayout">
                              {filteredAndSorted.map(url => (
                                <motion.tr
                                  key={url.id}
                                  layout
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0, x: -20, height: 0 }}
                                  transition={{ duration: 0.25 }}
                                  className={`border-b last:border-0 hover:bg-muted/30 transition-colors ${selectedIds.has(url.id) ? 'bg-orange-50/50 dark:bg-orange-950/20' : ''}`}
                                >
                                  <td className="px-4 py-3">
                                    <input type="checkbox" checked={selectedIds.has(url.id)} onChange={() => toggleSelect(url.id)} className="rounded border-input accent-orange-600" />
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex items-center gap-2">
                                      <LinkIcon className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
                                      <span className="font-mono font-medium text-orange-600 dark:text-orange-400">{url.short_id}</span>
                                      {url.is_locked && <Lock className="w-3 h-3 text-amber-500" />}
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 max-w-xs">
                                    <a href={url.original_url} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground truncate block max-w-[280px]" title={url.original_url}>
                                      {url.original_url}
                                    </a>
                                  </td>
                                  <td className="px-4 py-3">
                                    <button onClick={() => handleUserClick(url.owner_email || '(anonymous)')} className="text-xs text-muted-foreground hover:text-blue-600 dark:hover:text-blue-400 hover:underline transition-colors" title={`View all URLs by ${url.owner_email || '(anonymous)'}`}>
                                      {url.owner_email || '(anonymous)'}
                                    </button>
                                  </td>
                                  <td className="px-4 py-3">
                                    {url.is_active ? (
                                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Active
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />Inactive
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{formatDate(url.created_at)}</td>
                                  <td className="px-4 py-3 text-right">
                                    <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(url)} disabled={deleting.has(url.id)} className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 h-8 px-2.5">
                                      {deleting.has(url.id) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                    </Button>
                                  </td>
                                </motion.tr>
                              ))}
                            </AnimatePresence>
                          </tbody>
                        </table>
                      </div>
                      <div className="px-4 py-3 border-t bg-muted/30 text-xs text-muted-foreground">
                        Showing {filteredAndSorted.length} of {urls.length} URLs
                        {selectedUser && <span> (filtered by {selectedUser})</span>}
                      </div>
                    </Card>

                    {/* Mobile Cards */}
                    <div className="md:hidden space-y-3">
                      <div className="flex items-center gap-2 px-1">
                        <input type="checkbox" checked={selectedIds.size === filteredAndSorted.length && filteredAndSorted.length > 0} onChange={toggleSelectAll} className="rounded border-input accent-orange-600" />
                        <span className="text-xs text-muted-foreground">Select all ({filteredAndSorted.length})</span>
                      </div>
                      <AnimatePresence mode="popLayout">
                        {filteredAndSorted.map(url => (
                          <motion.div key={url.id} layout initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: -40, height: 0 }} transition={{ duration: 0.25 }}>
                            <Card className={`overflow-hidden ${selectedIds.has(url.id) ? 'ring-1 ring-orange-400' : ''}`}>
                              <CardContent className="p-4">
                                <div className="flex items-start gap-3">
                                  <input type="checkbox" checked={selectedIds.has(url.id)} onChange={() => toggleSelect(url.id)} className="rounded border-input accent-orange-600 mt-1" />
                                  <div className="flex-1 min-w-0 space-y-2">
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2">
                                        <LinkIcon className="w-3.5 h-3.5 text-orange-600 flex-shrink-0" />
                                        <span className="font-mono font-medium text-orange-600 dark:text-orange-400">{url.short_id}</span>
                                        {url.is_locked && <Lock className="w-3 h-3 text-amber-500" />}
                                        {url.is_active ? <span className="w-2 h-2 rounded-full bg-emerald-500" /> : <span className="w-2 h-2 rounded-full bg-red-500" />}
                                      </div>
                                      <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(url)} disabled={deleting.has(url.id)} className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 h-8 w-8 p-0">
                                        {deleting.has(url.id) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                      </Button>
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate">{url.original_url}</p>
                                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                      <button onClick={() => handleUserClick(url.owner_email || '(anonymous)')} className="flex items-center gap-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                        <Mail className="w-3 h-3" />{url.owner_email || '(anonymous)'}
                                      </button>
                                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{formatDateShort(url.created_at)}</span>
                                    </div>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                      <p className="text-center text-xs text-muted-foreground pt-2">
                        Showing {filteredAndSorted.length} of {urls.length} URLs
                      </p>
                    </div>
                  </motion.div>
                )}
              </TabsContent>

              {/* ===== BLOCKED DOMAINS TAB ===== */}
              <TabsContent value="domains" className="space-y-4">
                {/* Add Domain Form */}
                <Card>
                  <CardHeader className="pb-3 pt-4 px-4">
                    <div className="flex items-center gap-2">
                      <ShieldBan className="w-4 h-4 text-red-600 dark:text-red-400" />
                      <h2 className="text-sm font-semibold">Block a Domain</h2>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 space-y-3">
                    <div className="flex flex-col sm:flex-row gap-3">
                      <div className="relative flex-1">
                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          placeholder="example.com"
                          value={newDomain}
                          onChange={e => setNewDomain(e.target.value)}
                          className="pl-9"
                          onKeyDown={e => e.key === 'Enter' && handleAddDomain()}
                        />
                      </div>
                      <Input
                        placeholder="Reason (optional)"
                        value={newDomainReason}
                        onChange={e => setNewDomainReason(e.target.value)}
                        className="sm:max-w-[200px]"
                      />
                      <Button onClick={handleAddDomain} disabled={addingDomain || !newDomain.trim()} className="gap-1.5 bg-red-600 hover:bg-red-700">
                        {addingDomain ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Block
                      </Button>
                    </div>
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={includeSubdomains}
                        onChange={e => setIncludeSubdomains(e.target.checked)}
                        className="rounded border-input accent-orange-600"
                      />
                      <span className="text-muted-foreground">Include all subdomains (e.g. *.example.com)</span>
                    </label>
                  </CardContent>
                </Card>

                {/* Blocked Domains List */}
                {domainsLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
                  </div>
                ) : blockedDomains.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Globe className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium text-muted-foreground">No blocked domains</p>
                      <p className="text-sm text-muted-foreground mt-1">Add a domain above to block it from being shortened</p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Domain</th>
                            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Subdomains</th>
                            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Reason</th>
                            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Blocked At</th>
                            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <AnimatePresence mode="popLayout">
                            {blockedDomains.map(domain => (
                              <motion.tr
                                key={domain.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, x: -20, height: 0 }}
                                transition={{ duration: 0.25 }}
                                className="border-b last:border-0 hover:bg-muted/30 transition-colors"
                              >
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <Ban className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                                    <span className="font-mono font-medium text-red-600 dark:text-red-400">{domain.domain}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  {domain.include_subdomains ? (
                                    <span className="inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                                      *.{domain.domain}
                                    </span>
                                  ) : (
                                    <span className="text-xs text-muted-foreground">Exact only</span>
                                  )}
                                </td>
                                <td className="px-4 py-3 text-xs text-muted-foreground max-w-[200px] truncate">{domain.block_reason}</td>
                                <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{formatDateShort(domain.created_at)}</td>
                                <td className="px-4 py-3 text-right">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setDomainDeleteTarget(domain)}
                                    disabled={removingDomain.has(domain.id)}
                                    className="text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30 h-8 px-2.5"
                                  >
                                    {removingDomain.has(domain.id) ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                  </Button>
                                </td>
                              </motion.tr>
                            ))}
                          </AnimatePresence>
                        </tbody>
                      </table>
                    </div>
                    <div className="px-4 py-3 border-t bg-muted/30 text-xs text-muted-foreground">
                      {blockedDomains.length} blocked domain{blockedDomains.length !== 1 ? 's' : ''}
                    </div>
                  </Card>
                )}
              </TabsContent>

              {/* ===== USERS TAB ===== */}
              <TabsContent value="users" className="space-y-4">
                {/* Search */}
                <Card>
                  <CardContent className="p-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <Input
                        placeholder="Search users by email or name..."
                        value={userSearch}
                        onChange={e => setUserSearch(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </CardContent>
                </Card>

                {usersLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="w-6 h-6 animate-spin text-orange-600" />
                  </div>
                ) : filteredUsers.length === 0 ? (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                      <p className="text-lg font-medium text-muted-foreground">
                        {userSearch ? 'No users match your search' : 'No users found'}
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b bg-muted/50">
                            <th className="px-4 py-3 text-left font-medium text-muted-foreground">User</th>
                            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Tier</th>
                            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Status</th>
                            <th className="px-4 py-3 text-left font-medium text-muted-foreground">Joined</th>
                            <th className="px-4 py-3 text-right font-medium text-muted-foreground">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <AnimatePresence mode="popLayout">
                            {filteredUsers.map(u => (
                              <motion.tr
                                key={u.id}
                                layout
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0, x: -20, height: 0 }}
                                transition={{ duration: 0.25 }}
                                className={`border-b last:border-0 hover:bg-muted/30 transition-colors ${u.is_banned ? 'bg-red-50/30 dark:bg-red-950/10' : ''}`}
                              >
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2.5">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${u.is_banned ? 'bg-red-100 dark:bg-red-900/30' : 'bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40'}`}>
                                      {u.is_banned ? (
                                        <UserX className="w-4 h-4 text-red-600 dark:text-red-400" />
                                      ) : (
                                        <User className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                                      )}
                                    </div>
                                    <div className="min-w-0">
                                      <p className="text-sm font-medium truncate">{u.email}</p>
                                      <p className="text-xs text-muted-foreground">{u.first_name} {u.last_name}</p>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <span className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${
                                    u.subscription_tier === 'premium' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400' :
                                    u.subscription_tier === 'pro' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400' :
                                    'bg-gray-100 dark:bg-gray-900/30 text-gray-700 dark:text-gray-400'
                                  }`}>
                                    {u.subscription_tier}
                                  </span>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-1.5">
                                    {u.is_admin && (
                                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400">
                                        <Shield className="w-3 h-3" />Admin
                                      </span>
                                    )}
                                    {u.is_banned && (
                                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400">
                                        <Ban className="w-3 h-3" />Banned
                                      </span>
                                    )}
                                    {!u.is_admin && !u.is_banned && (
                                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />Active
                                      </span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{formatDateShort(u.created_at)}</td>
                                <td className="px-4 py-3 text-right">
                                  {!u.is_admin && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => setBanTarget(u)}
                                      disabled={banningUser.has(u.id)}
                                      className={`h-8 px-2.5 gap-1 text-xs ${u.is_banned ? 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-100 dark:hover:bg-emerald-900/30' : 'text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900/30'}`}
                                    >
                                      {banningUser.has(u.id) ? (
                                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                      ) : u.is_banned ? (
                                        <><UserCheck className="w-3.5 h-3.5" /> Unban</>
                                      ) : (
                                        <><UserX className="w-3.5 h-3.5" /> Ban</>
                                      )}
                                    </Button>
                                  )}
                                </td>
                              </motion.tr>
                            ))}
                          </AnimatePresence>
                        </tbody>
                      </table>
                    </div>
                    <div className="px-4 py-3 border-t bg-muted/30 text-xs text-muted-foreground">
                      {filteredUsers.length} of {allUsers.length} users
                      {allUsers.filter(u => u.is_banned).length > 0 && (
                        <span className="ml-2 text-red-500">({allUsers.filter(u => u.is_banned).length} banned)</span>
                      )}
                    </div>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Single Delete Confirmation */}
        <AlertDialog open={!!deleteTarget} onOpenChange={open => !open && setDeleteTarget(null)}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <AlertDialogTitle className="text-lg">Permanent Deletion</AlertDialogTitle>
                </div>
              </div>
              <AlertDialogDescription className="pt-4 space-y-3">
                <p>
                  You are about to <span className="font-semibold text-red-600 dark:text-red-400">permanently delete</span>{' '}
                  <span className="font-mono font-semibold text-orange-600 dark:text-orange-400">{deleteTarget?.short_id}</span>
                </p>
                {deleteTarget?.owner_email && (
                  <p className="text-xs text-muted-foreground">
                    Owned by: <span className="font-medium text-foreground">{deleteTarget.owner_email}</span>
                  </p>
                )}
                <div className="rounded-lg bg-muted/80 p-3 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-blue-500" />
                    <span>Row deleted from <span className="font-semibold">PostgreSQL</span> (urls + url_clicks)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Server className="w-3.5 h-3.5 text-red-500" />
                    <span>Key removed from <span className="font-semibold">Redis</span> cache</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Zap className="w-3.5 h-3.5 text-amber-500" />
                    <span>All analytics data will be lost</span>
                  </div>
                </div>
                <p className="text-xs font-medium text-red-600 dark:text-red-400">This action cannot be undone.</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 sm:gap-0">
              <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => deleteTarget && handleDelete(deleteTarget)} className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800">
                Delete Forever
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Bulk Delete Confirmation */}
        <AlertDialog open={bulkDeleteOpen} onOpenChange={setBulkDeleteOpen}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1">
                  <AlertDialogTitle className="text-lg">Bulk Permanent Deletion</AlertDialogTitle>
                </div>
              </div>
              <AlertDialogDescription className="pt-4 space-y-3">
                <p>
                  You are about to permanently delete{' '}
                  <span className="font-semibold text-red-600 dark:text-red-400">{selectedIds.size} URL{selectedIds.size !== 1 ? 's' : ''}</span>{' '}
                  from both PostgreSQL and Redis.
                </p>
                <div className="rounded-lg bg-muted/80 p-3 space-y-1.5 text-xs">
                  <div className="flex items-center gap-2">
                    <Database className="w-3.5 h-3.5 text-blue-500" />
                    <span>{selectedIds.size} rows deleted from <span className="font-semibold">PostgreSQL</span></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Server className="w-3.5 h-3.5 text-red-500" />
                    <span>{selectedIds.size} keys removed from <span className="font-semibold">Redis</span></span>
                  </div>
                </div>
                <p className="text-xs font-medium text-red-600 dark:text-red-400">This action cannot be undone.</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 sm:gap-0">
              <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleBulkDelete} className="bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800">
                Delete {selectedIds.size} URL{selectedIds.size !== 1 ? 's' : ''} Forever
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Domain Unblock Confirmation */}
        <AlertDialog open={!!domainDeleteTarget} onOpenChange={open => !open && setDomainDeleteTarget(null)}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                  <Globe className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div className="flex-1">
                  <AlertDialogTitle className="text-lg">Unblock Domain</AlertDialogTitle>
                </div>
              </div>
              <AlertDialogDescription className="pt-4 space-y-3">
                <p>
                  Remove <span className="font-mono font-semibold text-foreground">{domainDeleteTarget?.domain}</span> from the blocked list?
                </p>
                {domainDeleteTarget?.include_subdomains && (
                  <p className="text-xs text-muted-foreground">
                    This will also unblock all subdomains (*.{domainDeleteTarget.domain})
                  </p>
                )}
                <p className="text-xs text-muted-foreground">Users will be able to shorten URLs from this domain again.</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 sm:gap-0">
              <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={() => domainDeleteTarget && handleRemoveDomain(domainDeleteTarget)} className="bg-amber-600 hover:bg-amber-700">
                Unblock Domain
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Ban/Unban Confirmation */}
        <AlertDialog open={!!banTarget} onOpenChange={open => !open && setBanTarget(null)}>
          <AlertDialogContent className="max-w-md">
            <AlertDialogHeader>
              <div className="flex items-center gap-3">
                <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${banTarget?.is_banned ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                  {banTarget?.is_banned ? (
                    <UserCheck className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <UserX className="w-6 h-6 text-red-600 dark:text-red-400" />
                  )}
                </div>
                <div className="flex-1">
                  <AlertDialogTitle className="text-lg">
                    {banTarget?.is_banned ? 'Unban User' : 'Ban User'}
                  </AlertDialogTitle>
                </div>
              </div>
              <AlertDialogDescription className="pt-4 space-y-3">
                <p>
                  {banTarget?.is_banned ? 'Restore access for' : 'Ban'}{' '}
                  <span className="font-semibold text-foreground">{banTarget?.email}</span>?
                </p>
                {!banTarget?.is_banned && (
                  <div className="rounded-lg bg-muted/80 p-3 space-y-1.5 text-xs">
                    <p>Banned users cannot:</p>
                    <ul className="list-disc list-inside space-y-0.5 text-muted-foreground">
                      <li>Create new short URLs</li>
                      <li>Access URL shortening features</li>
                    </ul>
                    <p className="text-muted-foreground mt-1">Existing URLs will remain active but the user cannot create new ones.</p>
                  </div>
                )}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className="gap-2 sm:gap-0">
              <AlertDialogCancel className="mt-0">Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={() => banTarget && handleBanUser(banTarget)}
                className={banTarget?.is_banned ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800'}
              >
                {banTarget?.is_banned ? 'Unban User' : 'Ban User'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </SignedIn>
    </>
  );
}
