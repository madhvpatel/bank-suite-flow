import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, ArrowUpCircle, ArrowDownCircle, ArrowRightLeft, Calendar } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { transactionApi } from '@/lib/api';

const Transactions = () => {
  const [transactions] = useState([
    { 
      id: 1, 
      accountNumber: 'ACC001234', 
      type: 'DEPOSIT', 
      amount: 2500.00, 
      createdAt: '2024-01-20T10:30:00Z',
      counterpartyAccount: null 
    },
    { 
      id: 2, 
      accountNumber: 'ACC005678', 
      type: 'TRANSFER', 
      amount: -850.00, 
      createdAt: '2024-01-20T09:15:00Z',
      counterpartyAccount: 'ACC009012' 
    },
    { 
      id: 3, 
      accountNumber: 'ACC001234', 
      type: 'WITHDRAWAL', 
      amount: -200.00, 
      createdAt: '2024-01-19T16:45:00Z',
      counterpartyAccount: null 
    },
  ]);

  const [depositForm, setDepositForm] = useState({ accountNumber: '', amount: '' });
  const [withdrawForm, setWithdrawForm] = useState({ accountNumber: '', amount: '' });
  const [transferForm, setTransferForm] = useState({ fromAccount: '', toAccount: '', amount: '' });
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [isWithdrawOpen, setIsWithdrawOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const { toast } = useToast();

  const handleDeposit = async () => {
    try {
      await transactionApi.deposit(depositForm.accountNumber, parseFloat(depositForm.amount));
      setDepositForm({ accountNumber: '', amount: '' });
      setIsDepositOpen(false);
      toast({
        title: "Deposit successful",
        description: `$${depositForm.amount} has been deposited to ${depositForm.accountNumber}.`,
      });
    } catch (error) {
      toast({
        title: "Deposit failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleWithdraw = async () => {
    try {
      await transactionApi.withdraw(withdrawForm.accountNumber, parseFloat(withdrawForm.amount));
      setWithdrawForm({ accountNumber: '', amount: '' });
      setIsWithdrawOpen(false);
      toast({
        title: "Withdrawal successful",
        description: `$${withdrawForm.amount} has been withdrawn from ${withdrawForm.accountNumber}.`,
      });
    } catch (error) {
      toast({
        title: "Withdrawal failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleTransfer = async () => {
    try {
      await transactionApi.transfer({
        fromAccount: transferForm.fromAccount,
        toAccount: transferForm.toAccount,
        amount: parseFloat(transferForm.amount),
      });
      setTransferForm({ fromAccount: '', toAccount: '', amount: '' });
      setIsTransferOpen(false);
      toast({
        title: "Transfer successful",
        description: `$${transferForm.amount} has been transferred from ${transferForm.fromAccount} to ${transferForm.toAccount}.`,
      });
    } catch (error) {
      toast({
        title: "Transfer failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'DEPOSIT':
        return <ArrowUpCircle className="h-4 w-4 text-success" />;
      case 'WITHDRAWAL':
        return <ArrowDownCircle className="h-4 w-4 text-destructive" />;
      case 'TRANSFER':
        return <ArrowRightLeft className="h-4 w-4 text-accent" />;
      default:
        return <ArrowRightLeft className="h-4 w-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Transaction Management</h1>
          <p className="text-muted-foreground">Process deposits, withdrawals, and transfers</p>
        </div>
      </div>

      {/* Transaction Actions */}
      <div className="grid gap-4 md:grid-cols-3">
        <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-success/20 hover:border-success/40">
              <CardContent className="flex items-center justify-center p-6">
                <div className="text-center">
                  <ArrowUpCircle className="h-8 w-8 text-success mx-auto mb-2" />
                  <h3 className="font-semibold text-foreground">Deposit</h3>
                  <p className="text-sm text-muted-foreground">Add funds to account</p>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ArrowUpCircle className="h-5 w-5 text-success" />
                Make Deposit
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="deposit-account">Account Number</Label>
                <Input
                  id="deposit-account"
                  value={depositForm.accountNumber}
                  onChange={(e) => setDepositForm({ ...depositForm, accountNumber: e.target.value })}
                  placeholder="Enter account number"
                />
              </div>
              <div>
                <Label htmlFor="deposit-amount">Amount</Label>
                <Input
                  id="deposit-amount"
                  type="number"
                  step="0.01"
                  value={depositForm.amount}
                  onChange={(e) => setDepositForm({ ...depositForm, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <Button 
                onClick={handleDeposit} 
                className="w-full bg-success hover:bg-success/90"
              >
                Process Deposit
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isWithdrawOpen} onOpenChange={setIsWithdrawOpen}>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-destructive/20 hover:border-destructive/40">
              <CardContent className="flex items-center justify-center p-6">
                <div className="text-center">
                  <ArrowDownCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                  <h3 className="font-semibold text-foreground">Withdraw</h3>
                  <p className="text-sm text-muted-foreground">Remove funds from account</p>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ArrowDownCircle className="h-5 w-5 text-destructive" />
                Make Withdrawal
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="withdraw-account">Account Number</Label>
                <Input
                  id="withdraw-account"
                  value={withdrawForm.accountNumber}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, accountNumber: e.target.value })}
                  placeholder="Enter account number"
                />
              </div>
              <div>
                <Label htmlFor="withdraw-amount">Amount</Label>
                <Input
                  id="withdraw-amount"
                  type="number"
                  step="0.01"
                  value={withdrawForm.amount}
                  onChange={(e) => setWithdrawForm({ ...withdrawForm, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <Button 
                onClick={handleWithdraw} 
                className="w-full bg-destructive hover:bg-destructive/90"
              >
                Process Withdrawal
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
          <DialogTrigger asChild>
            <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 border-accent/20 hover:border-accent/40">
              <CardContent className="flex items-center justify-center p-6">
                <div className="text-center">
                  <ArrowRightLeft className="h-8 w-8 text-accent mx-auto mb-2" />
                  <h3 className="font-semibold text-foreground">Transfer</h3>
                  <p className="text-sm text-muted-foreground">Move funds between accounts</p>
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ArrowRightLeft className="h-5 w-5 text-accent" />
                Transfer Funds
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="from-account">From Account</Label>
                <Input
                  id="from-account"
                  value={transferForm.fromAccount}
                  onChange={(e) => setTransferForm({ ...transferForm, fromAccount: e.target.value })}
                  placeholder="Enter source account number"
                />
              </div>
              <div>
                <Label htmlFor="to-account">To Account</Label>
                <Input
                  id="to-account"
                  value={transferForm.toAccount}
                  onChange={(e) => setTransferForm({ ...transferForm, toAccount: e.target.value })}
                  placeholder="Enter destination account number"
                />
              </div>
              <div>
                <Label htmlFor="transfer-amount">Amount</Label>
                <Input
                  id="transfer-amount"
                  type="number"
                  step="0.01"
                  value={transferForm.amount}
                  onChange={(e) => setTransferForm({ ...transferForm, amount: e.target.value })}
                  placeholder="0.00"
                />
              </div>
              <Button 
                onClick={handleTransfer} 
                className="w-full bg-gradient-to-r from-accent to-accent-hover"
              >
                Process Transfer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Transaction History */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-semibold text-foreground bg-table-header">Date</th>
                  <th className="text-left p-4 font-semibold text-foreground bg-table-header">Type</th>
                  <th className="text-left p-4 font-semibold text-foreground bg-table-header">Account</th>
                  <th className="text-left p-4 font-semibold text-foreground bg-table-header">Amount</th>
                  <th className="text-left p-4 font-semibold text-foreground bg-table-header">Counterparty</th>
                  <th className="text-left p-4 font-semibold text-foreground bg-table-header">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((transaction, index) => (
                  <tr key={transaction.id} className={`border-b border-border ${index % 2 === 0 ? 'bg-table-row' : 'bg-card'}`}>
                    <td className="p-4 text-muted-foreground">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        {getTransactionIcon(transaction.type)}
                        <span className="font-medium text-foreground">{transaction.type}</span>
                      </div>
                    </td>
                    <td className="p-4 font-medium text-foreground">{transaction.accountNumber}</td>
                    <td className="p-4">
                      <span className={`font-bold ${
                        transaction.amount >= 0 ? 'text-success' : 'text-destructive'
                      }`}>
                        ${Math.abs(transaction.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="p-4 text-muted-foreground">
                      {transaction.counterpartyAccount || 'N/A'}
                    </td>
                    <td className="p-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-success text-success-foreground">
                        Completed
                      </span>
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

export default Transactions;