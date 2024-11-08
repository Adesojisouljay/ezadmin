import { api } from "./axiosInstance";

const authToken = localStorage.getItem("authToken")

export const loginUser = async (userData) => {
  try {
    const response = await api.post('/auth/login', userData);
    console.log(response)
    if (response?.data.success) {
      console.log('User logged in successfully');

      localStorage.setItem('token', response?.data.token);
      return response; 
    } else {
      console.error('Failed to login:', response?.message);
      console.log(response)

      return null;
    }
  } catch (error) {
    console.error('Error logging in:', error);
    throw error.message;
  }
};

export const getAllUsers = async () => {
    try {
  
      const response = await api.get('/auth/users');
      console.log(response)
      if (response.data.success) {
        // dispatch(updateUser({ user: response.data.user }));
        return response.data; 
      } else {
        console.error('Failed to fetch profile:', response.data.message);
  
        return null;
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
  
      return null;
    }
  };

  export const getAllTransactions = async () => {
    try {
        // const config = {
        //     headers: {
        //       Authorization: `${authToken}`,
        //     },
        //   };
      const response = await api.get(`/transactions/all`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction history:', error);
      throw error;
    }
  };

  export const getCryptoData = async () => {
    try {
      const response = await api.get('/crypto-data');
      if (response?.data?.success) {
      } else {
        console.error('Failed to fetch data:', response?.data?.message);
      }
      return response;
    } catch (error) {
      console.error('Error fetching data from /crypto-data endpoint:', error);
      return { data: { success: false, message: 'An error occurred while fetching the data.' } };
    }
  };

  export const getAllKYC = async () => {
    try {
      const response = await api.get('/kyc/all', {
        headers: {
          Authorization: authToken,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.data.success) {
        // console.log('Fetched all KYC records:', response.data.data);
        return response.data.data;
      } else {
        console.error('Failed to fetch KYC records:', response.data.message);
        return [];
      }
    } catch (error) {
      console.error('Error fetching KYC records:', error.message);
      return [];
    }
  };

  export const approveKYC = async (kycId) => {
    try {
      const response = await api.post(
        `/kyc/approve/${kycId}`,
        {},
        {
          headers: {
            Authorization: authToken,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.data.success) {
        console.log('KYC approved successfully:', response.data.message);
      } else {
        console.error('KYC approval failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error approving KYC:', error.message);
    }
  };
  
  export const rejectKYC = async (kycId) => {
    try {
      const response = await api.post(
        `/kyc/reject/${kycId}`,
        {},
        {
          headers: {
            Authorization: authToken,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.data.success) {
        console.log('KYC rejected successfully:', response.data.message);
      } else {
        console.error('KYC rejection failed:', response.data.message);
      }
    } catch (error) {
      console.error('Error rejecting KYC:', error.message);
    }
  };

  export const getUserProfile = async (receiver) => {
    try {
      const response = await api.get(`/auth/receiver-profile/${receiver}`);
      
      if (response.data.success) {
        return response.data.user;
      } else {
        return null;
      }
    } catch (error) {
      throw error.response?.data || { message: 'Error fetching receiver' };
    }
  };

  export const confirmFiatWithdrawal = async (withdrawalId, amount) => {
    try {
      const response = await api.post('/withdrawals/fiat/confirm', {
        withdrawalId,
        amount
      }, {
        headers: {
          Authorization: authToken,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error confirming fiat withdrawal:', error);
      throw error.response.data;
    }
  };
  
  export const cancelFiatWithdrawal = async (withdrawalId, amount) => {
    try {
      const response = await api.post('/withdrawals/fiat/cancel', {
        withdrawalId,
        amount,
      }, {
        headers: {
          Authorization: authToken,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error canceling fiat withdrawal:', error);
      throw error.response.data;
    }
  };
  
  export const getAllFiatWithdrawals = async () => {
    try {
      const response = await api.get('/withdrawals/fiat', {
        headers: {
          Authorization: authToken,
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching fiat withdrawals:', error);
      throw error.response.data;
    }
  };

  export const getAllFiatDeposits = async () => {
    try {
      const response = await api.get('/deposits/fiat', {
        headers: { Authorization: authToken },
      });
      console.log(response)
      return response.data;
    } catch (error) {
      console.error('Failed to fetch fiat deposits:', error);
      throw error;
    }
  };
  
  export const confirmFiatDeposit = async (depositRequestId, sender, receiver, accountNumber, accountHolderName, bankName) => {
    try {
      const response = await api.post(
        '/deposits/fiat/confirm',
        { depositRequestId, sender, receiver, accountNumber, accountHolderName, bankName },
        { headers: { Authorization: authToken } }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to confirm fiat deposit:', error);
      throw error;
    }
  };
  
  export const cancelFiatDeposit = async (depositRequestId) => {
    try {
      const response = await api.post(
        '/deposits/fiat/cancel',
        { depositRequestId },
        { headers: { Authorization: authToken } }
      );
      return response.data;
    } catch (error) {
      console.error('Failed to cancel fiat deposit:', error);
      throw error;
    }
  };

  export const editUser = async (userId, updatedData) => {
    try {
      const response = await api.put(
        `auth/user/${userId}/edit`,
        updatedData,
        {
          headers: {
            Authorization: authToken,
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.data.success) {
        console.log('User updated successfully:', response.data.message);
        return response.data;
      } else {
        console.error('Failed to update user:', response.data.message);
        return null;
      }
    } catch (error) {
      console.error('Error updating user:', error.message);
      return null;
    }
  };
  