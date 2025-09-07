import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { FileText, Download, CalendarIcon, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { statementApi } from '@/lib/api';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const Statements = () => {
  const [accountNumber, setAccountNumber] = useState('');
  const [fromDate, setFromDate] = useState<Date>();
  const [toDate, setToDate] = useState<Date>();
  const { toast } = useToast();

  const handleDownloadStatement = async () => {
    if (!accountNumber) {
      toast({
        title: "Account number required",
        description: "Please enter an account number to generate a statement.",
        variant: "destructive",
      });
      return;
    }

    try {
      const params = {
        fromDate: fromDate ? format(fromDate, 'yyyy-MM-dd') : undefined,
        toDate: toDate ? format(toDate, 'yyyy-MM-dd') : undefined,
      };

      const response = await statementApi.downloadPdf(accountNumber, params);
      
      // Create a blob from the response and download it
      const blob = new Blob([response], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `statement-${accountNumber}-${format(new Date(), 'yyyy-MM-dd')}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast({
        title: "Statement downloaded",
        description: `Statement for account ${accountNumber} has been downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Download failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Account Statements</h1>
        <p className="text-muted-foreground">Download PDF statements for any account</p>
      </div>

      {/* Download Form */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Generate Statement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <Label htmlFor="account">Account Number</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="account"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  placeholder="Enter account number"
                  className="pl-10"
                />
              </div>
            </div>

            <div>
              <Label>From Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !fromDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {fromDate ? format(fromDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={fromDate}
                    onSelect={setFromDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>To Date (Optional)</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !toDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {toDate ? format(toDate, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={toDate}
                    onSelect={setToDate}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="flex justify-center">
            <Button 
              onClick={handleDownloadStatement}
              className="bg-gradient-to-r from-primary to-primary-hover px-8 py-3 text-lg"
              size="lg"
            >
              <Download className="mr-2 h-5 w-5" />
              Download PDF Statement
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Statement Information */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Statement Features</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Comprehensive Transaction History</p>
                  <p className="text-sm text-muted-foreground">All deposits, withdrawals, and transfers</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Balance Summary</p>
                  <p className="text-sm text-muted-foreground">Opening and closing balances for the period</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Professional Format</p>
                  <p className="text-sm text-muted-foreground">Bank-standard PDF formatting</p>
                </div>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Custom Date Ranges</p>
                  <p className="text-sm text-muted-foreground">Filter by specific time periods</p>
                </div>
              </li>
            </ul>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Recent Downloads</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { account: 'ACC001234', date: '2024-01-20', period: 'Jan 1-20, 2024' },
                { account: 'ACC005678', date: '2024-01-19', period: 'Dec 2023' },
                { account: 'ACC009012', date: '2024-01-18', period: 'Q4 2023' },
                { account: 'ACC001234', date: '2024-01-15', period: 'Dec 2023' },
              ].map((download, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-table-row">
                  <div>
                    <p className="font-medium text-foreground">{download.account}</p>
                    <p className="text-sm text-muted-foreground">{download.period}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">{download.date}</p>
                    <Button variant="outline" size="sm" className="mt-1">
                      <Download className="h-3 w-3 mr-1" />
                      Re-download
                    </Button>
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

export default Statements;