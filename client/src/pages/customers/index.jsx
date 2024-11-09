import React, { useEffect, useState } from "react";
import { Box, Button, Modal, TextField, Typography, Divider, MenuItem, Select, FormControl, InputLabel } from "@mui/material";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";
import './customers.css';
import { getAllUsers, editUser } from "../../api/index";

const Customers = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addAmount, setAddAmount] = useState("");

  useEffect(() => {
    const getUsers = async () => {
      setIsLoading(true);
      try {
        const response = await getAllUsers();
        if (response.success) {
          setData(response.users);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getUsers();
  }, []);

  const handleOpenModal = (user) => {
    const firstAssetIndex = user.assets?.length ? 0 : undefined;
    const firstAccountIndex = user.accounts?.length ? 0 : undefined;
    setSelectedUser({
      ...user,
      selectedAsset: firstAssetIndex,
      selectedAccount: firstAccountIndex,
      role: user.role || "user",
      kyc: { ...user.kyc, kycStatus: user.kyc?.kycStatus || "Pending" },
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setAddAmount("");
  };

  const handleSaveChanges = async () => {
    try {
      // Add the amount to the selected asset balance
      if (selectedUser.selectedAsset !== undefined && addAmount) {
        const updatedAssets = [...selectedUser.assets];
        updatedAssets[selectedUser.selectedAsset].balance =
          parseFloat(updatedAssets[selectedUser.selectedAsset].balance) + parseFloat(addAmount);
        setSelectedUser({ ...selectedUser, assets: updatedAssets });
      }

      const updatedUser = await editUser(selectedUser?._id, selectedUser);
      console.log(updatedUser)
      setData((prevData) => prevData.map(user => user?._id === updatedUser?._id ? updatedUser : user));
      handleCloseModal();
      window.location.reload();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleAssetChange = (index, field, value) => {
    const updatedAssets = [...selectedUser.assets];
    updatedAssets[index][field] = value;
    setSelectedUser({ ...selectedUser, assets: updatedAssets });
  };

  const handleAccountChange = (index, field, value) => {
    const updatedAccounts = [...selectedUser.accounts];
    updatedAccounts[index][field] = value;
    setSelectedUser({ ...selectedUser, accounts: updatedAccounts });
  };

  const columns = [
    { field: "_id", headerName: "User Id", flex: 1 },
    { field: "firstName", headerName: "First Name", flex: 0.5 },
    { field: "lastName", headerName: "Last Name", flex: 0.5 },
    { field: "username", headerName: "Username", flex: 0.5 },
    { field: "email", headerName: "Email", flex: 1 },
    { field: "role", headerName: "Role", flex: 0.5 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      renderCell: (params) => (
        <Button variant="outlined" onClick={() => handleOpenModal(params.row)}>
          Edit
        </Button>
      ),
    },
  ];

  return (
    <Box className="customers-container">
      <Header title="CUSTOMERS" subtitle="List of Customers" />
      <Box className="customers-data-grid">
        <DataGrid
          loading={isLoading}
          getRowId={(row) => row?._id}
          rows={data}
          columns={columns}
        />
      </Box>

      {/* Centered Modal for editing user */}
      <Modal open={isModalOpen} onClose={handleCloseModal}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 800,
            maxHeight: 600,
            overflowY: "scroll",
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <h2>Edit User</h2>
          {selectedUser && (
            <>
              {/* Basic User Information */}
              <TextField
                label="First Name"
                value={selectedUser.firstName}
                onChange={(e) => setSelectedUser({ ...selectedUser, firstName: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Last Name"
                value={selectedUser.lastName}
                onChange={(e) => setSelectedUser({ ...selectedUser, lastName: e.target.value })}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Email"
                value={selectedUser.email}
                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                fullWidth
                margin="normal"
              />
              <FormControl fullWidth margin="normal">
                <InputLabel>Role</InputLabel>
                <Select
                  value={selectedUser.role}
                  onChange={(e) => setSelectedUser({ ...selectedUser, role: e.target.value })}
                >
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="modadmin">Mod admin</MenuItem>
                  <MenuItem value="merchant">Merchant</MenuItem>
                </Select>
              </FormControl>

              {/* Naira Balance */}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h4">Financial Information</Typography>
              <TextField
                label="Naira Balance"
                value={selectedUser.nairaBalance}
                onChange={(e) => setSelectedUser({ ...selectedUser, nairaBalance: e.target.value })}
                fullWidth
                margin="normal"
              />

              {/* KYC Status */}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h4">KYC Information</Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel>KYC Status</InputLabel>
                <Select
                  value={selectedUser.kyc.kycStatus}
                  onChange={(e) => setSelectedUser({ ...selectedUser, kyc: { ...selectedUser.kyc, kycStatus: e.target.value } })}
                >
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Verified">Verified</MenuItem>
                  <MenuItem value="Rejected">Rejected</MenuItem>
                </Select>
              </FormControl>

              {/* Assets Section */}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h4">Assets</Typography>

              <FormControl fullWidth margin="normal">
                <InputLabel>Select Asset</InputLabel>
                <Select
                  value={selectedUser.selectedAsset ?? ""}
                  onChange={(e) => setSelectedUser({
                    ...selectedUser,
                    selectedAsset: e.target.value,
                  })}
                >
                  {selectedUser.assets.map((asset, index) => (
                    <MenuItem key={index} value={index}>
                      {asset.currency}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>


              {/* Amount to Add */}
              <Typography variant="h4">Add missing deposit</Typography>
              <TextField
                label="Amount to Add"
                value={addAmount}
                onChange={(e) => setAddAmount(e.target.value)}
                fullWidth
                margin="normal"
                type="number"
              />

              {selectedUser.selectedAsset !== undefined && (
                <Box sx={{ mt: 2 }}>
                  <TextField
                    label="Currency"
                    value={selectedUser.assets[selectedUser.selectedAsset].currency}
                    fullWidth
                    disabled
                    margin="normal"
                  />
                  <Typography variant="h4">Update balance</Typography>
                  <TextField
                    label="Balance"
                    value={selectedUser.assets[selectedUser.selectedAsset].balance}
                    onChange={(e) => handleAssetChange(selectedUser.selectedAsset, 'balance', e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                </Box>
              )}

              {/* Bank Accounts Section */}
              <Divider sx={{ my: 2 }} />
              <Typography variant="h4">Bank Accounts</Typography>

              {selectedUser.accounts?.length ? (
                <FormControl fullWidth margin="normal">
                  <InputLabel>Select Account</InputLabel>
                  <Select
                    value={selectedUser.selectedAccount ?? ""}
                    onChange={(e) => setSelectedUser({
                      ...selectedUser,
                      selectedAccount: e.target.value,
                    })}
                  >
                    {selectedUser.accounts.map((account, index) => (
                      <MenuItem key={index} value={index}>
                        {account.bankName} - {account.accountNumber}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <Typography>No bank account added</Typography>
              )}

              {selectedUser.selectedAccount !== undefined && selectedUser.accounts?.length && (
                <Box sx={{ mt: 2 }}>
                  <TextField
                    label="Account Number"
                    value={selectedUser.accounts[selectedUser.selectedAccount].accountNumber}
                    onChange={(e) => handleAccountChange(selectedUser.selectedAccount, 'accountNumber', e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                  <TextField
                    label="Bank Name"
                    value={selectedUser.accounts[selectedUser.selectedAccount].bankName}
                    onChange={(e) => handleAccountChange(selectedUser.selectedAccount, 'bankName', e.target.value)}
                    fullWidth
                    margin="normal"
                  />
                </Box>
              )}
              
              <Button variant="contained" color="primary" onClick={handleSaveChanges}>
                Save Changes
              </Button>
              <Button variant="outlined" color="secondary" onClick={handleCloseModal} sx={{ ml: 2 }}>
                Cancel
              </Button>
            </>
          )}
        </Box>
      </Modal>
    </Box>
  );
};

export default Customers;
