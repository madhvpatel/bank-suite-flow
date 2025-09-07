import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Search, CreditCard, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { accountApi } from '@/lib/api';

const Accounts = () => {
  const [accounts, setAccounts] = useState([
    { id: 1, accountNumber: 'ACC001234', balance: 12456.78, user: { username: 'john_doe' } },
    { id: 2, accountNumber: 'ACC005678', balance: 8923.45, user: { username: 'jane_smith' } },
    { id: 3, accountNumber: 'ACC009012', balance: 25678.90, user: { username: 'mike_johnson' } },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAccount, setNewAccount] = useState({ userId: '', accountNumber: '' });
  const { toast } = useToast();

  const handleCreateAccount = async () => {
    try {
      const account = await accountApi.create(parseInt(newAccount.userId), newAccount.accountNumber);
      setAccounts([...accounts, account]);
      setNewAccount({ userId: '', accountNumber: '' });
      setIsDialogOpen(false);
      toast({
        title: "Account created successfully",
        description: `Account ${newAccount.accountNumber} has been created.`,
      });
    } catch (error) {
      toast({
        title: "Account creation failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  const filteredAccounts = accounts.filter(account =>
    account.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    account.user.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Account Management</h1>
          <p className="text-muted-foreground">View and manage bank accounts</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-primary-hover">
              <Plus className="mr-2 h-4 w-4" />
              Create Account
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Create New Account
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="userId">User ID</Label>
                <Input
                  id="userId"
                  type="number"
                  value={newAccount.userId}
                  onChange={(e) => setNewAccount({ ...newAccount, userId: e.target.value })}
                  placeholder="Enter user ID"
                />
              </div>
              <div>
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input
                  id="accountNumber"
                  value={newAccount.accountNumber}
                  onChange={(e) => setNewAccount({ ...newAccount, accountNumber: e.target.value })}
                  placeholder="Enter account number"
                />
              </div>
              <Button 
                onClick={handleCreateAccount} 
                className="w-full bg-gradient-to-r from-primary to-primary-hover"
              >
                Create Account
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/90">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Accounts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{accounts.length}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/90">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${accounts.reduce((sum, acc) => sum + acc.balance, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/90">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Balance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">
              ${(accounts.reduce((sum, acc) => sum + acc.balance, 0) / accounts.length).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card className="border-0 shadow-lg">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search accounts by number or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Accounts Table */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>Accounts ({filteredAccounts.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-semibold text-foreground bg-table-header">Account Number</th>
                  <th className="text-left p-4 font-semibold text-foreground bg-table-header">Owner</th>
                  <th className="text-left p-4 font-semibold text-foreground bg-table-header">Balance</th>
                  <th className="text-left p-4 font-semibold text-foreground bg-table-header">Status</th>
                  <th className="text-left p-4 font-semibold text-foreground bg-table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((account, index) => (
                  <tr key={account.id} className={`border-b border-border ${index % 2 === 0 ? 'bg-table-row' : 'bg-card'}`}>
                    <td className="p-4 font-medium text-foreground">{account.accountNumber}</td>
                    <td className="p-4 text-muted-foreground">{account.user.username}</td>
                    <td className="p-4">
                      <div className="flex items-center gap-1 font-bold text-primary">
                        <DollarSign className="h-4 w-4" />
                        {account.balance.toLocaleString()}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-success text-success-foreground">
                        Active
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">View Details</Button>
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

export default Accounts;