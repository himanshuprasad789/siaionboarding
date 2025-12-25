import { useState } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Users, Trash2, UserPlus } from 'lucide-react';
import { mockTeams, mockTeamMembers, allRoles } from '@/data/mockAdminData';
import { Team, TeamMember, AppRole } from '@/types/admin';
import { toast } from 'sonner';

export default function TeamManagement() {
  const [teams, setTeams] = useState<Team[]>(mockTeams);
  const [availableMembers] = useState<TeamMember[]>(mockTeamMembers);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDesc, setNewTeamDesc] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<Team | null>(null);
  const [selectedMember, setSelectedMember] = useState('');

  const handleCreateTeam = () => {
    if (!newTeamName.trim()) {
      toast.error('Please enter a team name');
      return;
    }
    
    const newTeam: Team = {
      id: `team-${Date.now()}`,
      name: newTeamName,
      description: newTeamDesc,
      members: [],
      workflowAccess: [],
    };
    
    setTeams([...teams, newTeam]);
    setNewTeamName('');
    setNewTeamDesc('');
    setIsCreateOpen(false);
    toast.success(`Team "${newTeamName}" created successfully`);
  };

  const handleDeleteTeam = (teamId: string) => {
    setTeams(teams.filter(t => t.id !== teamId));
    toast.success('Team deleted');
  };

  const handleAddMember = (teamId: string) => {
    if (!selectedMember) return;
    
    const member = availableMembers.find(m => m.id === selectedMember);
    if (!member) return;

    setTeams(teams.map(team => {
      if (team.id === teamId) {
        if (team.members.some(m => m.id === member.id)) {
          toast.error('Member already in team');
          return team;
        }
        return { ...team, members: [...team.members, member] };
      }
      return team;
    }));
    
    setSelectedMember('');
    toast.success(`${member.name} added to team`);
  };

  const handleRemoveMember = (teamId: string, memberId: string) => {
    setTeams(teams.map(team => {
      if (team.id === teamId) {
        return { ...team, members: team.members.filter(m => m.id !== memberId) };
      }
      return team;
    }));
    toast.success('Member removed from team');
  };

  const getRoleBadgeVariant = (role: AppRole) => {
    switch (role) {
      case 'admin': return 'destructive';
      case 'press': return 'default';
      case 'research': return 'secondary';
      case 'paper': return 'outline';
      default: return 'outline';
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-display font-bold tracking-tight">Team Management</h1>
            <p className="text-muted-foreground mt-1">
              Create teams and manage team memberships.
            </p>
          </div>
          
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Create Team
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Team</DialogTitle>
                <DialogDescription>
                  Add a new team to organize your internal members.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="team-name">Team Name</Label>
                  <Input
                    id="team-name"
                    placeholder="e.g., Press Team"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="team-desc">Description</Label>
                  <Input
                    id="team-desc"
                    placeholder="What does this team do?"
                    value={newTeamDesc}
                    onChange={(e) => setNewTeamDesc(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTeam}>Create Team</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {teams.map((team) => (
            <Card key={team.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{team.name}</CardTitle>
                      <CardDescription className="text-xs">
                        {team.members.length} members
                      </CardDescription>
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDeleteTeam(team.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {team.description}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Workflow Access */}
                <div className="flex flex-wrap gap-1">
                  {team.workflowAccess.map((workflow) => (
                    <Badge key={workflow} variant="outline" className="text-xs">
                      {workflow}
                    </Badge>
                  ))}
                </div>

                {/* Members List */}
                <div className="space-y-2">
                  {team.members.map((member) => (
                    <div 
                      key={member.id}
                      className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                    >
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarFallback className="text-xs">
                            {member.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium">{member.name}</p>
                          <p className="text-xs text-muted-foreground">{member.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={getRoleBadgeVariant(member.role)} className="text-xs">
                          {member.role}
                        </Badge>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => handleRemoveMember(team.id, member.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Member */}
                <div className="flex gap-2">
                  <Select value={selectedMember} onValueChange={setSelectedMember}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="Add member..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableMembers
                        .filter(m => !team.members.some(tm => tm.id === m.id))
                        .map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            {member.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    size="icon" 
                    variant="outline"
                    onClick={() => handleAddMember(team.id)}
                    disabled={!selectedMember}
                  >
                    <UserPlus className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}
