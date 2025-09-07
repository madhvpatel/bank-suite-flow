const API_BASE_URL = 'http://localhost:8080/api';

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

const handleResponse = async (response: Response) => {
  if (response.status === 401) {
    // Handle unauthorized - could show login modal here
    throw new ApiError(401, 'Unauthorized - Please login');
  }
  
  if (!response.ok) {
    const errorText = await response.text();
    throw new ApiError(response.status, errorText || 'An error occurred');
  }
  
  // Check if response is JSON
  const contentType = response.headers.get('content-type');
  if (contentType?.includes('application/json')) {
    return response.json();
  }
  
  return response;
};

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });
  
  return handleResponse(response);
};

// User API
export const userApi = {
  register: (userData: { username: string; password: string; email: string }) =>
    apiRequest('/users/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),
  
  getAll: () => apiRequest('/users'),
  
  getById: (id: number) => apiRequest(`/users/${id}`),
  
  getTransactions: (userId: number, params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: string;
    fromDate?: string;
    toDate?: string;
  }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, value.toString());
      });
    }
    return apiRequest(`/users/${userId}/transactions?${query.toString()}`);
  },
};

// Account API
export const accountApi = {
  create: (userId: number, accountNumber: string) =>
    apiRequest(`/accounts/create/${userId}?accountNumber=${accountNumber}`, {
      method: 'POST',
    }),
  
  getByNumber: (accountNumber: string) =>
    apiRequest(`/accounts/${accountNumber}`),
  
  getBalance: (accountNumber: string) =>
    apiRequest(`/accounts/${accountNumber}/balance`),
  
  getTransactions: (accountNumber: string, params?: {
    page?: number;
    size?: number;
    sortBy?: string;
    direction?: string;
    fromDate?: string;
    toDate?: string;
  }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, value.toString());
      });
    }
    return apiRequest(`/accounts/${accountNumber}/transactions?${query.toString()}`);
  },
};

// Transaction API
export const transactionApi = {
  deposit: (accountNumber: string, amount: number) =>
    apiRequest(`/transactions/deposit/${accountNumber}?amount=${amount}`, {
      method: 'POST',
    }),
  
  withdraw: (accountNumber: string, amount: number) =>
    apiRequest(`/transactions/withdraw/${accountNumber}?amount=${amount}`, {
      method: 'POST',
    }),
  
  transfer: (transferData: { fromAccount: string; toAccount: string; amount: number }) =>
    apiRequest('/transactions/transfer', {
      method: 'POST',
      body: JSON.stringify(transferData),
    }),
};

// KYC API
export const kycApi = {
  submit: (userId: number, kycData: { documentType: string; documentNumber: string; address: string }) =>
    apiRequest(`/kyc/submit/${userId}`, {
      method: 'POST',
      body: JSON.stringify(kycData),
    }),
  
  verify: (kycId: number, approved: boolean) =>
    apiRequest(`/kyc/verify/${kycId}?approved=${approved}`, {
      method: 'POST',
    }),
  
  getByUserId: (userId: number) =>
    apiRequest(`/kyc/user/${userId}`),
};

// Statement API
export const statementApi = {
  downloadPdf: (accountNumber: string, params?: { fromDate?: string; toDate?: string }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) query.append(key, value);
      });
    }
    return fetch(`${API_BASE_URL}/accounts/${accountNumber}/statement/pdf?${query.toString()}`)
      .then(handleResponse);
  },
};

export { ApiError };