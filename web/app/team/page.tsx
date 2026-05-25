'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@clerk/nextjs';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Users,
  Plus,
  Trash2,
  Mail,
  Crown,
  Shield,
  AlertCircle,
  Loader2,
  UserPlus,
  Calendar,
  MoreVertical,
} from 'lucide-react';
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

interface TeamMember {
  id: string;
  user_id: string;
  email: string;
  clerk_id: string;
  joined_at: string;
}

interface Team {
  id: string;
  name: string;
  owner_id: string;
  is_owner: boolean;
  created_at: string;
}

export default function TeamPage() {
  const { getToken } = useAuth();
  const { toast } = useToast();

  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasAccess, setHasAccess] = useState(false);
  const [userTier, setUserTier] = useState<'free' | 'pro' | 'premium' | null>(null);

  // Create team dialog
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [creating, setCreating] = useState(false);

  // Add member dialog
  const [showAddMemberDialog, setShowAddMemberDialog] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [addingMember, setAddingMember] = useState(false);

  // Delete member confirmation
  const [memberToDelete, setMemberToDelete] = useState<TeamMember | null>(null);
  const [deletingMember, setDeletingMember] = useState(false);

  // Delete team confirmation
  const [showDeleteTeamDialog, setShowDeleteTeamDialog] = useState(false);
  const [deletingTeam, setDeletingTeam] = useState(false);

  useEffect(() => {
    checkAccess();
  }, []);

  async function checkAccess() {
    try {
      // First check tier
      const tierResponse = await fetch('/api/user/tier');
      const tierData = await tierResponse.json();
      const tier = (tierData.tier || 'free').toLowerCase();
      setUserTier(tier as 'free' | 'pro' | 'premium');

      // Check if premium (can create team) OR is a team member (can view team)
      if (tier === 'premium') {
        setHasAccess(true);
        await fetchTeam();
        return;
      }

      // Not premium, check if user is a team member
      const token = await getToken();
      const teamResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teams/my-team`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (teamResponse.ok) {
        // User is a team member
        setHasAccess(true);
        const data = await teamResponse.json();
        setTeam(data.team);
        setMembers(data.members || []);
      } else {
        // User is not premium and not a team member
        setHasAccess(false);
      }
    } catch (error) {
      console.error('Error checking access:', error);
      setUserTier('free');
      setHasAccess(false);
    } finally {
      setLoading(false);
    }
  }

  async function fetchTeam() {
    try {
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teams/my-team`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 404) {
        // User doesn't have a team yet
        setTeam(null);
        setMembers([]);
        return;
      }

      if (!response.ok) throw new Error('Failed to fetch team');

      const data = await response.json();
      setTeam(data.team);
      setMembers(data.members || []);
    } catch (error) {
      console.error('Error fetching team:', error);
      setTeam(null);
      setMembers([]);
    }
  }

  async function handleCreateTeam() {
    if (!teamName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a team name',
        variant: 'destructive',
      });
      return;
    }

    try {
      setCreating(true);
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teams`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: teamName }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create team');
      }

      toast({
        title: 'Success',
        description: 'Team created successfully',
      });

      setShowCreateDialog(false);
      setTeamName('');
      await fetchTeam();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setCreating(false);
    }
  }

  async function handleAddMember() {
    if (!memberEmail.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an email address',
        variant: 'destructive',
      });
      return;
    }

    try {
      setAddingMember(true);
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teams/members`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: memberEmail }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to add member');
      }

      toast({
        title: 'Success',
        description: 'Team member added successfully',
      });

      setShowAddMemberDialog(false);
      setMemberEmail('');
      await fetchTeam();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setAddingMember(false);
    }
  }

  async function handleRemoveMember(member: TeamMember) {
    try {
      setDeletingMember(true);
      const token = await getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/teams/members/${member.user_id}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to remove member');
      }

      toast({
        title: 'Success',
        description: 'Team member removed successfully',
      });

      setMemberToDelete(null);
      await fetchTeam();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setDeletingMember(false);
    }
  }

  async function handleDeleteTeam() {
    try {
      setDeletingTeam(true);
      const token = await getToken();
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/teams`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete team');
      }

      toast({
        title: 'Success',
        description: 'Team deleted successfully',
      });

      setShowDeleteTeamDialog(false);
      // Reload the page to show the "create team" view
      window.location.reload();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setDeletingTeam(false);
    }
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  // Premium access check
  if (!hasAccess) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card>
              <CardContent className="p-12 text-center">
                <div className="w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-10 h-10 text-orange-600 dark:text-orange-400" />
                </div>
                <h2 className="text-3xl font-bold mb-4">
                  Team Collaboration is Premium Only
                </h2>
                <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Unlock team collaboration features to work together with up to 5 team members.
                  Share and manage links collaboratively with your team.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    asChild
                    className="bg-orange-500 hover:bg-orange-600"
                    size="lg"
                  >
                    <Link href="/pricing">
                      <Crown className="w-5 h-5 mr-2" />
                      Upgrade to Premium
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    asChild
                  >
                    <Link href="/dashboard">
                      Back to Dashboard
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  // No team yet - show create team UI
  if (!team) {
    return (
      <div className="min-h-screen bg-background p-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-4xl font-bold flex items-center gap-3">
              <Users className="w-10 h-10 text-orange-500" />
              Team Collaboration
            </h1>
            <p className="text-muted-foreground mt-2">
              Create a team and collaborate with up to 5 members
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <CardContent className="p-12 text-center">
                <Users className="w-20 h-20 text-muted-foreground/30 mx-auto mb-6" />
                <h3 className="text-2xl font-semibold mb-3">Create Your Team</h3>
                <p className="text-muted-foreground mb-8 max-w-md mx-auto">
                  Start collaborating with your team. Add up to 5 members who can view and
                  edit shared links together.
                </p>
                <Button
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-orange-500 hover:bg-orange-600"
                  size="lg"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Team
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Create Team Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Team</DialogTitle>
              <DialogDescription>
                Give your team a name. You can add up to 5 members after creating the team.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Team Name</label>
                <Input
                  placeholder="My Awesome Team"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  maxLength={100}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateTeam()}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
                disabled={creating}
              >
                Cancel
              </Button>
              <Button
                onClick={handleCreateTeam}
                disabled={creating || !teamName.trim()}
                className="bg-orange-500 hover:bg-orange-600"
              >
                {creating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Team
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Has team - show team management UI
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3">
                <Users className="w-10 h-10 text-orange-500" />
                {team.name}
              </h1>
              <p className="text-muted-foreground mt-2">
                {team.is_owner ? 'You are the team owner' : 'Team member'} • {members.length}/5 members
              </p>
            </div>
            <div className="flex items-center gap-2">
              {team.is_owner && members.length < 5 && (
                <Button
                  onClick={() => setShowAddMemberDialog(true)}
                  className="bg-orange-500 hover:bg-orange-600"
                >
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Member
                </Button>
              )}
              {team.is_owner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => setShowDeleteTeamDialog(true)}
                      className="text-red-600 dark:text-red-400 focus:text-red-600 dark:focus:text-red-400 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Team
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </motion.div>

        {/* Team Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="w-6 h-6 text-blue-500 flex-shrink-0 mt-1" />
                <div className="flex-1">
                  <h3 className="font-semibold mb-2">Team Collaboration</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    All team members can view and edit team links. You can add up to 5 members total.
                    Members must have registered OrangeURL accounts.
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Created on {formatDate(team.created_at)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Members List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-bold mb-4">Team Members</h2>
          <div className="space-y-3">
            {members.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center">
                          <Mail className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold">{member.email}</p>
                            {member.user_id === team.owner_id && (
                              <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-400 text-xs font-medium rounded-full flex items-center gap-1">
                                <Crown className="w-3 h-3" />
                                Owner
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Joined {formatDate(member.joined_at)}
                          </p>
                        </div>
                      </div>
                      {team.is_owner && member.user_id !== team.owner_id && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setMemberToDelete(member)}
                          className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/30 border-red-200 dark:border-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Add Member Dialog */}
      <Dialog open={showAddMemberDialog} onOpenChange={setShowAddMemberDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Team Member</DialogTitle>
            <DialogDescription>
              Enter the email address of a registered OrangeURL user to add them to your team.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Email Address</label>
              <Input
                type="email"
                placeholder="team@example.com"
                value={memberEmail}
                onChange={(e) => setMemberEmail(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddMember()}
              />
              <p className="text-xs text-muted-foreground mt-2">
                The user must already have an OrangeURL account.
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowAddMemberDialog(false)}
              disabled={addingMember}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddMember}
              disabled={addingMember || !memberEmail.trim()}
              className="bg-orange-500 hover:bg-orange-600"
            >
              {addingMember ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Member
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Remove Member Confirmation */}
      <AlertDialog
        open={memberToDelete !== null}
        onOpenChange={(open) => !open && setMemberToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove Team Member?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove <strong>{memberToDelete?.email}</strong> from the
              team? They will no longer be able to access team links.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingMember}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => memberToDelete && handleRemoveMember(memberToDelete)}
              disabled={deletingMember}
              className="bg-red-600 hover:bg-red-700"
            >
              {deletingMember ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Removing...
                </>
              ) : (
                'Remove Member'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Team Confirmation */}
      <AlertDialog open={showDeleteTeamDialog} onOpenChange={setShowDeleteTeamDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Team?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>{team.name}</strong>? This action cannot be undone.
              All team members will lose access to shared links, and the team will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingTeam}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTeam}
              disabled={deletingTeam}
              className="bg-red-600 hover:bg-red-700"
            >
              {deletingTeam ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Team'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
