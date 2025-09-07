import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, CreditCard, ArrowUpDown, FileCheck, TrendingUp, DollarSign } from 'lucide-react';
import bankingHero from '@/assets/banking-hero.jpg';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 p-8">
        <div className="relative z-10">
          <h1 className="text-3xl font-bold text-foreground">Welcome to BankDash</h1>
          <p className="mt-2 text-muted-foreground">Your comprehensive banking management platform</p>
        </div>
        <div className="absolute inset-0 opacity-20">
          <img 
            src={bankingHero} 
            alt="Banking Dashboard" 
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/90">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Users</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">1,247</div>
            <p className="text-xs text-success">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/90">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Accounts</CardTitle>
            <CreditCard className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">987</div>
            <p className="text-xs text-success">+8.2% from last month</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/90">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Daily Transactions</CardTitle>
            <ArrowUpDown className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">3,456</div>
            <p className="text-xs text-success">+23.1% from yesterday</p>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/90">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending KYC</CardTitle>
            <FileCheck className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">42</div>
            <p className="text-xs text-muted-foreground">Requires review</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Recent Transactions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { type: 'Deposit', amount: '$2,500.00', account: '****1234', time: '2 minutes ago' },
                { type: 'Transfer', amount: '-$850.00', account: '****5678', time: '15 minutes ago' },
                { type: 'Withdrawal', amount: '-$200.00', account: '****1234', time: '1 hour ago' },
                { type: 'Deposit', amount: '$1,200.00', account: '****9012', time: '3 hours ago' },
              ].map((transaction, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-table-row">
                  <div>
                    <p className="font-medium text-foreground">{transaction.type}</p>
                    <p className="text-sm text-muted-foreground">{transaction.account} • {transaction.time}</p>
                  </div>
                  <div className={`font-bold ${
                    transaction.amount.startsWith('-') ? 'text-destructive' : 'text-success'
                  }`}>
                    {transaction.amount}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-accent" />
              Account Balances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { account: '****1234', balance: '$12,456.78', type: 'Checking' },
                { account: '****5678', balance: '$8,923.45', type: 'Savings' },
                { account: '****9012', balance: '$25,678.90', type: 'Business' },
                { account: '****3456', balance: '$4,567.23', type: 'Investment' },
              ].map((account, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-table-row">
                  <div>
                    <p className="font-medium text-foreground">{account.account}</p>
                    <p className="text-sm text-muted-foreground">{account.type}</p>
                  </div>
                  <div className="font-bold text-primary">
                    {account.balance}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;