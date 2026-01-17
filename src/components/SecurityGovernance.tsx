import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { 
  Shield, 
  Users, 
  Key, 
  Lock, 
  Eye, 
  UserCheck,
  UserX,
  Settings,
  Plus,
  Edit,
  Trash2,
  Download,
  Upload,
  FileText,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Search,
  Filter,
  Bell,
  Globe,
  Database,
  Code,
  Zap
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface SecurityEvent {
  id: string;
  event_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  created_at: string;
  metadata?: any;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'developer' | 'viewer' | 'agent';
  status: 'active' | 'inactive' | 'pending';
  lastActive: string;
  permissions: string[];
  createdAt: string;
}

interface Permission {
  id: string;
  name: string;
  category: 'system' | 'agents' | 'data' | 'monitoring';
  description: string;
  enabled: boolean;
}

interface AuditLog {
  id: string;
  user_id: string | null;
  user: string;
  action: string;
  resource: string;
  timestamp: string;
  status: 'success' | 'failed' | 'warning';
  details: string;
  ipAddress: string;
}

interface SecurityPolicy {
  id: string;
  name: string;
  type: 'authentication' | 'authorization' | 'data' | 'network';
  enabled: boolean;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Smith',
    email: 'john.smith@company.com',
    role: 'admin',
    status: 'active',
    lastActive: '2 minutes ago',
    permissions: ['system:admin', 'agents:manage', 'data:full', 'monitoring:view'],
    createdAt: '2024-01-15'
  },
  {
    id: '2',
    name: 'Sarah Johnson',
    email: 'sarah.j@company.com',
    role: 'developer',
    status: 'active',
    lastActive: '15 minutes ago',
    permissions: ['agents:manage', 'data:read', 'monitoring:view'],
    createdAt: '2024-01-20'
  },
  {
    id: '3',
    name: 'Mike Chen',
    email: 'mike.chen@company.com',
    role: 'viewer',
    status: 'inactive',
    lastActive: '2 hours ago',
    permissions: ['monitoring:view'],
    createdAt: '2024-02-01'
  }
];

const mockPermissions: Permission[] = [
  { id: '1', name: 'System Administration', category: 'system', description: 'Full system access and configuration', enabled: true },
  { id: '2', name: 'Agent Management', category: 'agents', description: 'Create, modify, and delete agents', enabled: true },
  { id: '3', name: 'Data Access', category: 'data', description: 'Access to all data and knowledge bases', enabled: true },
  { id: '4', name: 'Monitoring Dashboard', category: 'monitoring', description: 'View system metrics and performance', enabled: true },
  { id: '5', name: 'API Keys Management', category: 'system', description: 'Generate and manage API keys', enabled: false },
  { id: '6', name: 'Model Training', category: 'agents', description: 'Train and fine-tune AI models', enabled: true }
];

const mockAuditLogs: AuditLog[] = [
  {
    id: '1',
    user_id: null,
    user: 'John Smith',
    action: 'Agent Created',
    resource: 'Research Agent #4',
    timestamp: '2024-01-22 14:30:45',
    status: 'success',
    details: 'New research agent created with full capabilities',
    ipAddress: '192.168.1.105'
  },
  {
    id: '2',
    user_id: null,
    user: 'Sarah Johnson',
    action: 'Data Export',
    resource: 'Knowledge Base',
    timestamp: '2024-01-22 13:15:22',
    status: 'success',
    details: 'Exported 1,247 knowledge items to CSV',
    ipAddress: '192.168.1.142'
  },
  {
    id: '3',
    user_id: null,
    user: 'System',
    action: 'Failed Login',
    resource: 'Authentication',
    timestamp: '2024-01-22 12:45:18',
    status: 'failed',
    details: 'Multiple failed login attempts detected',
    ipAddress: '203.0.113.42'
  }
];

const mockSecurityPolicies: SecurityPolicy[] = [
  { id: '1', name: 'Multi-Factor Authentication', type: 'authentication', enabled: true, description: 'Require MFA for all users', severity: 'high' },
  { id: '2', name: 'API Rate Limiting', type: 'network', enabled: true, description: 'Limit API requests per minute', severity: 'medium' },
  { id: '3', name: 'Data Encryption at Rest', type: 'data', enabled: true, description: 'Encrypt all stored data', severity: 'critical' },
  { id: '4', name: 'Session Timeout', type: 'authentication', enabled: false, description: 'Auto-logout after inactivity', severity: 'low' }
];

const SecurityGovernance = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>(mockPermissions);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [securityPolicies, setSecurityPolicies] = useState<SecurityPolicy[]>(mockSecurityPolicies);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>('all');
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Check admin status
  useEffect(() => {
    const checkAdminStatus = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/auth');
          return;
        }

        const { data, error } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'admin'
        });

        if (error) throw error;

        if (!data) {
          toast({
            title: "Access Denied",
            description: "You need admin privileges to access this page",
            variant: "destructive"
          });
          navigate('/');
          return;
        }

        setIsAdmin(true);
      } catch (error) {
        console.error('Error checking admin status:', error);
        navigate('/');
      }
    };

    checkAdminStatus();
  }, [navigate, toast]);

  // Fetch real users with roles
  useEffect(() => {
    if (!isAdmin) return;

    const fetchUsers = async () => {
      try {
        const { data: profilesData, error: profilesError } = await supabase
          .from('profiles')
          .select('id, user_id, display_name, created_at');

        if (profilesError) throw profilesError;

        const { data: rolesData, error: rolesError } = await supabase
          .from('user_roles')
          .select('user_id, role');

        if (rolesError) throw rolesError;

        const mappedUsers: User[] = (profilesData || []).map(profile => {
          const userRole = rolesData?.find(r => r.user_id === profile.user_id);
          
          return {
            id: profile.user_id,
            name: profile.display_name || 'Unknown User',
            email: 'user@example.com',
            role: (userRole?.role as User['role']) || 'viewer',
            status: 'active' as const,
            lastActive: 'Unknown',
            permissions: [],
            createdAt: new Date(profile.created_at).toLocaleDateString()
          };
        });

        setUsers(mappedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive"
        });
      }
    };

    fetchUsers();
  }, [isAdmin, toast]);

  // Fetch real audit logs
  useEffect(() => {
    if (!isAdmin) return;

    const fetchAuditLogs = async () => {
      try {
        const { data, error } = await supabase
          .from('audit_logs')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(50);

        if (error) throw error;

        const mappedLogs: AuditLog[] = (data || []).map(log => ({
          id: log.id,
          user_id: log.user_id,
          user: 'User',
          action: log.action,
          resource: log.resource,
          timestamp: new Date(log.created_at).toLocaleString(),
          status: log.status as AuditLog['status'],
          details: log.details || '',
          ipAddress: log.ip_address?.toString() || 'N/A'
        }));

        setAuditLogs(mappedLogs);
      } catch (error) {
        console.error('Error fetching audit logs:', error);
        toast({
          title: "Error",
          description: "Failed to fetch audit logs",
          variant: "destructive"
        });
      }
    };

    fetchAuditLogs();

    // Subscribe to real-time audit logs
    const auditChannel = supabase
      .channel('audit_logs_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'audit_logs'
        },
        () => {
          fetchAuditLogs();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(auditChannel);
    };
  }, [isAdmin, toast]);

  // Fetch security events
  useEffect(() => {
    if (!isAdmin) return;

    fetchSecurityEvents();

    // Subscribe to real-time security events
    const channel = supabase
      .channel('security_events_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'security_events'
        },
        () => {
          fetchSecurityEvents();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin]);

  const fetchSecurityEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('security_events')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      
      // Map and validate severity values
      const mappedData = (data || []).map(event => ({
        id: event.id,
        event_type: event.event_type,
        severity: (event.severity === 'low' || event.severity === 'medium' || 
                  event.severity === 'high' || event.severity === 'critical') 
                  ? event.severity as 'low' | 'medium' | 'high' | 'critical'
                  : 'medium' as 'low' | 'medium' | 'high' | 'critical',
        description: event.description,
        created_at: event.created_at,
        metadata: event.metadata
      }));
      
      setSecurityEvents(mappedData);
    } catch (error) {
      console.error('Error fetching security events:', error);
      toast({
        title: "Error",
        description: "Failed to fetch security events",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const getRoleColor = (role: User['role']) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'developer': return 'bg-blue-100 text-blue-800';
      case 'viewer': return 'bg-green-100 text-green-800';
      case 'agent': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: User['status']) => {
    switch (status) {
      case 'active': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'inactive': return <UserX className="h-4 w-4 text-gray-500" />;
      case 'pending': return <Clock className="h-4 w-4 text-yellow-500" />;
      default: return <UserX className="h-4 w-4 text-gray-500" />;
    }
  };

  const getAuditStatusIcon = (status: AuditLog['status']) => {
    switch (status) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed': return <UserX className="h-4 w-4 text-red-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      default: return <CheckCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: SecurityPolicy['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(users.map(user => 
      user.id === userId 
        ? { ...user, status: user.status === 'active' ? 'inactive' : 'active' as const }
        : user
    ));
  };

  const togglePolicy = (policyId: string) => {
    setSecurityPolicies(policies => 
      policies.map(policy => 
        policy.id === policyId 
          ? { ...policy, enabled: !policy.enabled }
          : policy
      )
    );
  };

  const filteredUsers = users.filter(user => {
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRole && matchesSearch;
  });

  const userStats = {
    total: users.length,
    active: users.filter(u => u.status === 'active').length,
    pending: users.filter(u => u.status === 'pending').length,
    admins: users.filter(u => u.role === 'admin').length
  };

  const enabledPolicies = securityPolicies.filter(p => p.enabled).length;
  const criticalPolicies = securityPolicies.filter(p => p.severity === 'critical').length;

  return (
    <div className="space-y-6">
      {/* Demo Mode Banner */}
      <Alert variant="default" className="border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
        <AlertTriangle className="h-4 w-4 text-yellow-600" />
        <AlertTitle className="text-yellow-800 dark:text-yellow-200">Demo Mode</AlertTitle>
        <AlertDescription className="text-yellow-700 dark:text-yellow-300">
          Permissions and Security Policies sections show example data only. 
          Real access control is enforced via backend RLS policies.
        </AlertDescription>
      </Alert>

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Security & Governance</h1>
          <p className="text-muted-foreground">
            Manage user access, permissions, audit trails, and security policies
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Create a new user account with appropriate permissions
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="user-name">Full Name</Label>
                    <Input id="user-name" placeholder="John Smith" />
                  </div>
                  <div>
                    <Label htmlFor="user-email">Email</Label>
                    <Input id="user-email" type="email" placeholder="john@company.com" />
                  </div>
                </div>
                <div>
                  <Label htmlFor="user-role">Role</Label>
                  <select id="user-role" className="w-full border rounded-md px-3 py-2">
                    <option value="viewer">Viewer</option>
                    <option value="developer">Developer</option>
                    <option value="admin">Administrator</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="user-permissions">Permissions</Label>
                  <Textarea id="user-permissions" placeholder="Select permissions..." rows={3} />
                </div>
                <Button className="w-full">Create User</Button>
              </div>
            </DialogContent>
          </Dialog>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Audit Log
          </Button>
        </div>
      </div>

      {/* Security Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{userStats.total}</p>
                <p className="text-sm text-muted-foreground">Total Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{userStats.active}</p>
                <p className="text-sm text-muted-foreground">Active Users</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{enabledPolicies}</p>
                <p className="text-sm text-muted-foreground">Security Policies</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{criticalPolicies}</p>
                <p className="text-sm text-muted-foreground">Critical Policies</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="permissions">Permissions</TabsTrigger>
          <TabsTrigger value="audit">Audit Trail</TabsTrigger>
          <TabsTrigger value="events">Security Events</TabsTrigger>
          <TabsTrigger value="policies">Security Policies</TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="space-y-6">
          {/* User Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="border rounded-md px-3 py-2 bg-background"
            >
              <option value="all">All Roles</option>
              <option value="admin">Administrators</option>
              <option value="developer">Developers</option>
              <option value="viewer">Viewers</option>
              <option value="agent">Agents</option>
            </select>
          </div>

          {/* Users List */}
          <div className="space-y-4">
            {filteredUsers.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                        <Users className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{user.name}</h3>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={getRoleColor(user.role)}>
                            {user.role}
                          </Badge>
                          <div className="flex items-center gap-1">
                            {getStatusIcon(user.status)}
                            <span className="text-xs text-muted-foreground capitalize">
                              {user.status}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Last active</p>
                      <p className="text-sm font-medium">{user.lastActive}</p>
                      <div className="flex gap-2 mt-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleUserStatus(user.id)}
                        >
                          {user.status === 'active' ? (
                            <>
                              <UserX className="h-3 w-3 mr-1" />
                              Disable
                            </>
                          ) : (
                            <>
                              <UserCheck className="h-3 w-3 mr-1" />
                              Enable
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <p className="text-sm text-muted-foreground mb-2">Permissions:</p>
                    <div className="flex flex-wrap gap-1">
                      {user.permissions.map((permission, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Permission Management</CardTitle>
              <CardDescription>
                Configure system-wide permissions and access controls
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {permissions.map((permission) => (
                  <div key={permission.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{permission.name}</h4>
                        <Badge variant="outline" className="capitalize">
                          {permission.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {permission.description}
                      </p>
                    </div>
                    <Switch
                      checked={permission.enabled}
                      onCheckedChange={(checked) => {
                        setPermissions(permissions.map(p => 
                          p.id === permission.id ? { ...p, enabled: checked } : p
                        ));
                      }}
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="audit" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Audit Trail</CardTitle>
                  <CardDescription>
                    Complete log of all system activities and user actions
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    Filter
                  </Button>
                  <Button variant="outline" size="sm">
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {auditLogs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      {getAuditStatusIcon(log.status)}
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium">{log.action}</h4>
                          <Badge variant="outline">{log.resource}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {log.user} • {log.timestamp} • IP: {log.ipAddress}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {log.details}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="events" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Real-Time Security Events
              </CardTitle>
              <CardDescription>
                Live security monitoring from database with real-time updates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-sm text-muted-foreground">Loading events...</div>
              ) : securityEvents.length === 0 ? (
                <div className="text-center py-8">
                  <Shield className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-sm text-muted-foreground">No security events recorded yet</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    Security events will appear here when system activities are logged
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {securityEvents.map((event) => (
                    <div key={event.id} className="flex items-start justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-primary" />
                          <span className="font-medium">{event.event_type}</span>
                          <Badge 
                            variant={
                              event.severity === 'critical' ? 'destructive' : 
                              event.severity === 'high' ? 'destructive' : 
                              event.severity === 'medium' ? 'default' : 
                              'outline'
                            }
                            className="text-xs"
                          >
                            {event.severity.toUpperCase()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{event.description}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {new Date(event.created_at).toLocaleString()}
                          </span>
                          {event.metadata && Object.keys(event.metadata).length > 0 && (
                            <span className="flex items-center gap-1">
                              <Database className="h-3 w-3" />
                              Metadata available
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Security Policies</CardTitle>
              <CardDescription>
                Configure and enforce security policies across the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {securityPolicies.map((policy) => (
                  <div key={policy.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h4 className="font-medium">{policy.name}</h4>
                        <Badge className={getSeverityColor(policy.severity)}>
                          {policy.severity}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {policy.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {policy.description}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={policy.enabled}
                        onCheckedChange={() => togglePolicy(policy.id)}
                      />
                      <Button variant="ghost" size="sm">
                        <Settings className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SecurityGovernance;