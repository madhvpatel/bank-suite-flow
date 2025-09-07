import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { FileCheck, Plus, CheckCircle, XCircle, Clock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { kycApi } from '@/lib/api';

const KYC = () => {
  const [kycRecords] = useState([
    { 
      id: 1, 
      user: { id: 1, username: 'john_doe' }, 
      documentType: 'PASSPORT', 
      documentNumber: 'P123456789', 
      address: '123 Main St, City, State',
      status: 'PENDING' 
    },
    { 
      id: 2, 
      user: { id: 2, username: 'jane_smith' }, 
      documentType: 'DRIVERS_LICENSE', 
      documentNumber: 'DL987654321', 
      address: '456 Oak Ave, City, State',
      status: 'VERIFIED' 
    },
    { 
      id: 3, 
      user: { id: 3, username: 'mike_johnson' }, 
      documentType: 'NATIONAL_ID', 
      documentNumber: 'ID456789123', 
      address: '789 Pine Rd, City, State',
      status: 'REJECTED' 
    },
  ]);

  const [kycForm, setKycForm] = useState({
    userId: '',
    documentType: '',
    documentNumber: '',
    address: ''
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();

  const handleSubmitKyc = async () => {
    try {
      await kycApi.submit(parseInt(kycForm.userId), {
        documentType: kycForm.documentType,
        documentNumber: kycForm.documentNumber,
        address: kycForm.address,
      });
      setKycForm({ userId: '', documentType: '', documentNumber: '', address: '' });
      setIsDialogOpen(false);
      toast({
        title: "KYC submitted successfully",
        description: "KYC document has been submitted for review.",
      });
    } catch (error) {
      toast({
        title: "KYC submission failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleVerifyKyc = async (kycId: number, approved: boolean) => {
    try {
      await kycApi.verify(kycId, approved);
      toast({
        title: `KYC ${approved ? 'approved' : 'rejected'}`,
        description: `The KYC document has been ${approved ? 'approved' : 'rejected'}.`,
      });
    } catch (error) {
      toast({
        title: "KYC verification failed",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Clock className="h-4 w-4 text-warning" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'bg-success text-success-foreground';
      case 'REJECTED':
        return 'bg-destructive text-destructive-foreground';
      default:
        return 'bg-warning text-warning-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">KYC Management</h1>
          <p className="text-muted-foreground">Manage Know Your Customer verification</p>
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-primary to-primary-hover">
              <Plus className="mr-2 h-4 w-4" />
              Submit KYC
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FileCheck className="h-5 w-5" />
                Submit KYC Document
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="userId">User ID</Label>
                <Input
                  id="userId"
                  type="number"
                  value={kycForm.userId}
                  onChange={(e) => setKycForm({ ...kycForm, userId: e.target.value })}
                  placeholder="Enter user ID"
                />
              </div>
              <div>
                <Label htmlFor="documentType">Document Type</Label>
                <Select value={kycForm.documentType} onValueChange={(value) => setKycForm({ ...kycForm, documentType: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select document type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PASSPORT">Passport</SelectItem>
                    <SelectItem value="DRIVERS_LICENSE">Driver's License</SelectItem>
                    <SelectItem value="NATIONAL_ID">National ID</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="documentNumber">Document Number</Label>
                <Input
                  id="documentNumber"
                  value={kycForm.documentNumber}
                  onChange={(e) => setKycForm({ ...kycForm, documentNumber: e.target.value })}
                  placeholder="Enter document number"
                />
              </div>
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={kycForm.address}
                  onChange={(e) => setKycForm({ ...kycForm, address: e.target.value })}
                  placeholder="Enter full address"
                  rows={3}
                />
              </div>
              <Button 
                onClick={handleSubmitKyc} 
                className="w-full bg-gradient-to-r from-primary to-primary-hover"
              >
                Submit KYC
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/90">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{kycRecords.length}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/90">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">
              {kycRecords.filter(kyc => kyc.status === 'PENDING').length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/90">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Verified</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">
              {kycRecords.filter(kyc => kyc.status === 'VERIFIED').length}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg bg-gradient-to-br from-card to-card/90">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {kycRecords.filter(kyc => kyc.status === 'REJECTED').length}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* KYC Records */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle>KYC Records ({kycRecords.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-semibold text-foreground bg-table-header">User</th>
                  <th className="text-left p-4 font-semibold text-foreground bg-table-header">Document Type</th>
                  <th className="text-left p-4 font-semibold text-foreground bg-table-header">Document Number</th>
                  <th className="text-left p-4 font-semibold text-foreground bg-table-header">Status</th>
                  <th className="text-left p-4 font-semibold text-foreground bg-table-header">Actions</th>
                </tr>
              </thead>
              <tbody>
                {kycRecords.map((kyc, index) => (
                  <tr key={kyc.id} className={`border-b border-border ${index % 2 === 0 ? 'bg-table-row' : 'bg-card'}`}>
                    <td className="p-4 font-medium text-foreground">{kyc.user.username}</td>
                    <td className="p-4 text-muted-foreground">{kyc.documentType.replace('_', ' ')}</td>
                    <td className="p-4 text-muted-foreground">{kyc.documentNumber}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs rounded-full ${getStatusColor(kyc.status)}`}>
                        {getStatusIcon(kyc.status)}
                        {kyc.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {kyc.status === 'PENDING' && (
                        <div className="flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleVerifyKyc(kyc.id, true)}
                            className="border-success text-success hover:bg-success hover:text-success-foreground"
                          >
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleVerifyKyc(kyc.id, false)}
                            className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                          >
                            Reject
                          </Button>
                        </div>
                      )}
                      {kyc.status !== 'PENDING' && (
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      )}
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

export default KYC;