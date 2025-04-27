
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Shield, CreditCard, UserCheck, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const AdminPage = () => {
  const { user, profile } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState('user');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Admin credentials
  const ADMIN_EMAIL = 'admin@waitify.com';
  const ADMIN_PASSWORD = 'admin123!';
  
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        // Check if the user is an admin
        if (profile?.role === 'admin') {
          setIsAdmin(true);
          await fetchUsers();
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Error checking admin status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAdminStatus();
  }, [user, profile]);
  
  const fetchUsers = async () => {
    try {
      const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*');
        
      if (error) throw error;
      
      if (profiles) {
        setUsers(profiles);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch users',
        variant: 'destructive',
      });
    }
  };
  
  const updateUserRole = async () => {
    if (!selectedUserId) return;
    
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: selectedRole })
        .eq('id', selectedUserId);
        
      if (error) throw error;
      
      toast({
        title: 'Success',
        description: `User role updated to ${selectedRole}`,
      });
      
      await fetchUsers();
    } catch (error) {
      console.error('Error updating user role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update user role',
        variant: 'destructive',
      });
    }
  };
  
  const createAdminUser = async () => {
    try {
      setIsLoading(true);
      
      // Check if admin user already exists
      const { data: existingUsers, error: checkError } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'admin');
        
      if (checkError) throw checkError;
      
      if (existingUsers && existingUsers.length > 0) {
        toast({
          title: 'Admin Exists',
          description: 'An admin user already exists in the system.',
        });
        return;
      }
      
      // Create admin user
      const { data, error } = await supabase.auth.signUp({
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
        options: {
          data: {
            first_name: 'Admin',
            last_name: 'User',
            role: 'admin',
          }
        }
      });
      
      if (error) throw error;
      
      if (data) {
        toast({
          title: 'Admin Account Created',
          description: `Admin account created with email: ${ADMIN_EMAIL}`,
        });
      }
    } catch (error) {
      console.error('Error creating admin user:', error);
      toast({
        title: 'Error',
        description: 'Failed to create admin user',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const filteredUsers = users.filter(user => {
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.toLowerCase();
    return fullName.includes(searchQuery.toLowerCase()) || 
           user.email?.toLowerCase().includes(searchQuery.toLowerCase());
  });
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <span className="ml-2">Loading admin panel...</span>
      </div>
    );
  }
  
  if (!isAdmin) {
    return (
      <div className="container mx-auto py-8 px-4">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-destructive" />
              <CardTitle>Access Restricted</CardTitle>
            </div>
            <CardDescription>
              You don't have permission to access this area.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-3 rounded-md">
              <div className="flex items-start">
                <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 mr-2" />
                <p className="text-sm text-amber-800 dark:text-amber-200">
                  This page is restricted to administrators only. If you need access, please contact an admin.
                </p>
              </div>
            </div>
            
            <div className="pt-2">
              <Button variant="outline" onClick={() => navigate('/dashboard')} className="w-full">
                Return to Dashboard
              </Button>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <p className="text-xs text-muted-foreground text-center">
                Admin access is required to view this page
              </p>
            </div>
          </CardContent>
        </Card>
        
        <div className="max-w-md mx-auto mt-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Create Admin Account</CardTitle>
              <CardDescription>
                Create a default admin account for the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={createAdminUser} 
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Creating Admin...
                  </>
                ) : (
                  <>
                    <Shield className="h-4 w-4 mr-2" />
                    Create Admin Account
                  </>
                )}
              </Button>
              
              <div className="mt-4 text-xs text-muted-foreground">
                <p>Admin credentials will be:</p>
                <p><strong>Email:</strong> {ADMIN_EMAIL}</p>
                <p><strong>Password:</strong> {ADMIN_PASSWORD}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage system users and subscriptions
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="users" className="space-y-6">
        <TabsList>
          <TabsTrigger value="users">User Management</TabsTrigger>
          <TabsTrigger value="subscriptions">Subscriptions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">User Management</CardTitle>
              <CardDescription>
                Update user roles and permissions
              </CardDescription>
              <div className="mt-2">
                <Input 
                  placeholder="Search users..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border rounded-md overflow-hidden">
                  <table className="min-w-full divide-y">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs text-muted-foreground">Name</th>
                        <th className="px-4 py-2 text-left text-xs text-muted-foreground">Email</th>
                        <th className="px-4 py-2 text-left text-xs text-muted-foreground">Role</th>
                        <th className="px-4 py-2 text-left text-xs text-muted-foreground">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-muted/50">
                            <td className="px-4 py-2">
                              {user.first_name} {user.last_name}
                            </td>
                            <td className="px-4 py-2">{user.email || user.username}</td>
                            <td className="px-4 py-2">
                              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                user.role === 'admin' ? 'bg-blue-100 text-blue-800' : 
                                user.role === 'business' ? 'bg-green-100 text-green-800' : 
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-4 py-2">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedUserId(user.id)}
                              >
                                Edit Role
                              </Button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                            No users found matching your search
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                {selectedUserId && (
                  <Card className="p-4 border border-primary/20 bg-primary/5">
                    <div className="space-y-4">
                      <div className="flex gap-2 items-center text-sm">
                        <UserCheck className="h-4 w-4" />
                        <span>Update role for user: {selectedUserId}</span>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="role">User Role</Label>
                          <select 
                            id="role"
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                          >
                            <option value="user">User</option>
                            <option value="business">Business</option>
                            <option value="admin">Admin</option>
                          </select>
                        </div>
                        
                        <div className="flex items-end">
                          <Button 
                            onClick={updateUserRole} 
                            className="w-full"
                          >
                            Update Role
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="subscriptions" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                <CardTitle>Subscription Plans</CardTitle>
              </div>
              <CardDescription>
                Manage subscription plans and users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-4 rounded-md">
                <div className="flex items-start">
                  <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-500 mt-0.5 mr-3" />
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-amber-800 dark:text-amber-200">
                      Subscription Management
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-300">
                      This feature allows administrators to manage subscription plans and user access. You can create, update, or delete subscription plans from here.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminPage;
