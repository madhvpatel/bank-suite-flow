import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { userApi } from '@/lib/api';

const Users = () => {
  const [users, setUsers] = useState([
    { id: 1, username: 'john_doe', email: 'john@example.com', createdAt: '2024-01-15T10:30:00Z' },
    { id: 2, username: 'jane_smith', email: 'jane@example.com', createdAt: '2024-01-16T14:20:00Z' },
    { id: 3, username: 'mike_johnson', email: 'mike@example.com', createdAt: '2024-01-17T09:15:00Z' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '' });
  const { toast } = useToast();

  const handleRegister = async () => {
    try {
      const user = await userApi.register(newUser);
      setUsers([...users, user]);
      setNewUser({ username: '', email: '', password: '' });
      setIsDialogOpen(false);
      toast({
        title: "User registered successfully",
        description: `${newUser.username} has been added to the system.`,
      });
    } catch (error) {
      toast({
        title: "Registration failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredUsers = users.filter(user =>
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">User Management</h1>
          <p className="text-muted-foreground">Manage system users and their accounts</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-primary-hover">
              <Plus className="mr-2 h-4 w-4" />
              Register User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Register New User
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  value={newUser.username}
                  onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                  placeholder="Enter username"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  placeholder="Enter password"
                />
              </div>
              <Button 
                onClick={handleRegister} 
                className="w-full bg-gradient-to-r from-primary to-primary-hover"
              >
                Register User
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-semibold text-foreground bg-table-header">ID</th>
                  <th className="text-left p-4 font-semibold text-foreground bg-table-header">Username</th>
                  <th className="text-left p-4 font-semibold text-foreground bg-table-header">Email</th>
                  <th className="text-left p-4 font-semibold text-foreground bg-table-header">Created</th>
                  <th className="text-left p-4 font-semibold text-foreground bg-table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.id} className={`border-b border-border ${index % 2 === 0 ? 'bg-table-row' : 'bg-card'}`}>
                    <td className="p-4 text-foreground">{user.id}</td>
                    <td className="p-4 font-medium text-foreground">{user.username}</td>
                    <td className="p-4 text-muted-foreground">{user.email}</td>
                    <td className="p-4 text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View</Button>
                        <Button variant="outline" size="sm">Transactions</Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;