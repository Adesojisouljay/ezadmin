import React, { useEffect, useState } from "react";
import { Box, Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "components/Header";
import {
  getAllMerchants,
  approveMerchant,
  disapproveMerchant,
  updateMerchant,
  deleteMerchant,
  updateMerchantBalance,
  updateMerchantWithdrawalBalance
} from "../../api/index";

const MerchantManagement = () => {
  const [merchants, setMerchants] = useState([]);
  const [filteredMerchants, setFilteredMerchants] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMerchant, setSelectedMerchant] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMerchantBalance, setNewMerchantBalance] = useState(0)
  const [newWithdrawalMerchantBalance, setNewMerchantWithdrawalBalance] = useState(0)

  useEffect(() => {
    fetchMerchants();
  }, []);

  useEffect(() => {
    filterMerchants();
  }, [searchTerm, merchants]);

  const fetchMerchants = async () => {
    setLoading(true);
    try {
      const result = await getAllMerchants();
      console.log(result)
      if (result.success) {
        setMerchants(result.data);
      } else {
        setError(result.message || "Error fetching merchants");
      }
    } catch (err) {
      setError("Error fetching merchants");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      const result = await approveMerchant(id);
      if (result.success) {
        setMerchants((prev) =>
          prev.map((merchant) =>
            merchant._id === id ? { ...merchant, status: "approved", isActive: true } : merchant
          )
        );
      }
    } catch (err) {
      console.error("Error approving merchant", err);
    }
  };

  const handleDisapprove = async (id) => {
    try {
      const result = await disapproveMerchant(id);
      if (result.success) {
        setMerchants((prev) =>
          prev.map((merchant) =>
            merchant._id === id ? { ...merchant, status: "disapproved", isActive: false } : merchant
          )
        );
      }
    } catch (err) {
      console.error("Error disapproving merchant", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      const result = await deleteMerchant(id);
      if (result.success) {
        setMerchants((prev) => prev.filter((merchant) => merchant._id !== id));
      }
    } catch (err) {
      console.error("Error deleting merchant", err);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filterMerchants = () => {
    const filtered = merchants.filter(
      (merchant) =>
        merchant.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (merchant.userId?.email || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMerchants(filtered);
  };

  const handleViewDetails = (merchant) => {
    setSelectedMerchant(merchant);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedMerchant(null);
    setIsModalOpen(false);
  };

  const handleUpdateBalance = async (merchantId) => {
    try {
      const result = await updateMerchantBalance({
        merchantId,
        amount: Number(newMerchantBalance),
        operation: "set",
      });
      console.log(result);
      if (result?.success) {
        const updatedBalance = result.data.updatedBalance;
        
        // Update the selectedMerchant state with the new balance
        setSelectedMerchant((prev) => ({
          ...prev,
          merchantBalance: updatedBalance,
        }));
  
        // Update the merchants array to reflect the updated balance
        setMerchants((prevMerchants) =>
          prevMerchants.map((merchant) =>
            merchant._id === merchantId
              ? { ...merchant, merchantBalance: updatedBalance }
              : merchant
          )
        );
        setNewMerchantBalance(0);
  
        console.log("Updated Balance:", updatedBalance);
      }
    } catch (error) {
      console.error("Failed to update merchant balance:", error);
    }
  };

  const handleUpdateWithdrawalBalance = async (merchantId) => {
    try {
      const result = await updateMerchantWithdrawalBalance({
        merchantId,
        amount: Number(newWithdrawalMerchantBalance),
        operation: "set",
      });
      console.log(result);
      if (result?.success) {
        const updatedBalance = result.data.updatedBalance;
        
        // Update the selectedMerchant state with the new balance
        setSelectedMerchant((prev) => ({
          ...prev,
          merchantWithdrawalBalance: updatedBalance,
        }));
  
        // Update the merchants array to reflect the updated balance
        setMerchants((prevMerchants) =>
          prevMerchants.map((merchant) =>
            merchant._id === merchantId
              ? { ...merchant, merchantWithdrawalBalance: updatedBalance }
              : merchant
          )
        );
        setNewMerchantWithdrawalBalance(0);
  
        console.log("Updated Balance:", updatedBalance);
      }
    } catch (error) {
      console.error("Failed to update merchant balance:", error);
    }
  };  

  const columns = [
    { field: "username", headerName: "Username", flex: 1 },
    { field: "email", headerName: "Email", flex: 1, valueGetter: (params) => params.row.userId?.email },
    { field: "accountNumber", headerName: "Account Number", flex: 1 },
    { field: "bankName", headerName: "Bank Name", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <span style={{ color: params.value === "approved" ? "green" : "red" }}>
          {params.value.charAt(0).toUpperCase() + params.value.slice(1)}
        </span>
      ),
    },
    {
      field: "isActive",
      headerName: "Active",
      flex: 1,
      renderCell: (params) => (params.value ? "Yes" : "No"),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 3,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => handleApprove(params.row._id)}
            style={{ marginRight: 8 }}
          >
            Approve
          </Button>
          <Button
            variant="contained"
            color="warning"
            size="small"
            onClick={() => handleDisapprove(params.row._id)}
            style={{ marginRight: 8 }}
          >
            Disapprove
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row._id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
    {
      field: "info",
      headerName: "Info",
      flex: 1,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            color="success"
            size="small"
            onClick={() => handleViewDetails(params.row)}
            style={{ marginRight: 8 }}
          >
            View
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Header title="MERCHANT MANAGEMENT" subtitle="Manage Merchants" />
      <Box className="search-container" style={{ marginBottom: 16 }}>
        <TextField
          variant="outlined"
          placeholder="Search by username or email"
          value={searchTerm}
          onChange={handleSearchChange}
          fullWidth
        />
      </Box>
      <DataGrid
        loading={loading}
        rows={filteredMerchants}
        columns={columns}
        getRowId={(row) => row._id}
        autoHeight
        pageSize={10}
        rowsPerPageOptions={[10, 20, 50]}
      />
      {/* Merchant Details Modal */}
      {selectedMerchant && (
        <Dialog open={isModalOpen} onClose={handleCloseModal} maxWidth="md" fullWidth>
          <DialogTitle>Merchant Details</DialogTitle>

            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
                <h2>Deposit Funds</h2>
                <DialogActions style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <DialogTitle style={{display: "flex", alignItems: "center", gap: "2px"}}>
                        Last Topped:{" "}
                        <span style={{ fontWeight: "bold", fontSize: "18px" }}>{selectedMerchant.lastToppedAmount}</span>
                    </DialogTitle>
                    <DialogTitle style={{display: "flex", alignItems: "center", gap: "2px"}}>
                        Total Spent:{" "}
                        <span style={{ fontWeight: "bold", fontSize: "18px" }}>{selectedMerchant.totalSpent}</span>
                    </DialogTitle>
                    <DialogTitle style={{display: "flex", alignItems: "center", gap: "2px"}}>
                        Merchant Balance:{" "}
                        <span style={{ fontWeight: "bold", fontSize: "18px" }}>{selectedMerchant.merchantBalance}</span>
                    </DialogTitle>
                    <TextField
                        label="Update merchant balance"
                        value={newMerchantBalance}
                        onChange={(e) => setNewMerchantBalance(e.target.value)}
                        margin="dense"
                        size="small"
                        type="number"
                    />
                    <Button
                        variant="contained"
                        color="success"
                        onClick={()=> handleUpdateBalance(selectedMerchant._id)}
                        style={{ padding: "6px 16px", width: "150px" }}
                    >
                        Top Up
                    </Button>
                </DialogActions>
            </div>

            <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
              <h2>
                  Withdrawal Funds
              </h2>
              <DialogActions style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <DialogTitle style={{display: "flex", alignItems: "center", gap: "2px"}}>
                      Last Topped:{" "}
                      <span style={{ fontWeight: "bold", fontSize: "18px" }}>{selectedMerchant.lastToppedWithdrawalAmount}</span>
                  </DialogTitle>
                  <DialogTitle style={{display: "flex", alignItems: "center", gap: "2px"}}>
                      Total Spent:{" "}
                      <span style={{ fontWeight: "bold", fontSize: "18px" }}>{selectedMerchant.totalWithdrawalSpent}</span>
                  </DialogTitle>
                  <DialogTitle style={{display: "flex", alignItems: "center", gap: "2px"}}>
                      Merchant Balance:{" "}
                      <span style={{ fontWeight: "bold", fontSize: "18px" }}>{selectedMerchant.merchantWithdrawalBalance}</span>
                  </DialogTitle>
                  <TextField
                      label="Update merchant balance"
                      value={newWithdrawalMerchantBalance}
                      onChange={(e) => setNewMerchantWithdrawalBalance(e.target.value)}
                      margin="dense"
                      size="small"
                      type="number"
                  />
                  <Button
                      variant="contained"
                      color="success"
                      onClick={()=> handleUpdateWithdrawalBalance(selectedMerchant._id)}
                      style={{ padding: "6px 16px", width: "150px" }}
                  >
                      Top Up
                  </Button>
              </DialogActions>
            </div>

          <DialogContent>
            <Typography><strong>Username:</strong> {selectedMerchant.username}</Typography>
            <Typography><strong>Email:</strong> {selectedMerchant?.userId?.email || "No email"}</Typography>
            <Typography><strong>Account Number:</strong> {selectedMerchant.accountNumber}</Typography>
            <Typography><strong>Account Name:</strong> {selectedMerchant.accountName}</Typography>
            <Typography><strong>Bank Name:</strong> {selectedMerchant.bankName}</Typography>
            <Typography><strong>Country:</strong> {selectedMerchant.country}</Typography>
            <Typography><strong>Residential Address:</strong> {selectedMerchant.residentialAddress}</Typography>
            <Typography><strong>NIN:</strong> {selectedMerchant.NIN}</Typography>
            <Typography><strong>BVN:</strong> {selectedMerchant.BVN}</Typography>
            <Typography><strong>Social Media Handle:</strong> {selectedMerchant.socialMediaHandle}</Typography>
            <Typography><strong>Status:</strong> {selectedMerchant.status}</Typography>
            <Typography><strong>Active:</strong> {selectedMerchant.isActive ? "Yes" : "No"}</Typography>
            <Box className="merchant-images">
              <img 
                src={selectedMerchant.residencePicture} 
                alt="Residence Picture" 
                style={{ width: 200, marginRight: 16 }} 
              />
              <img 
                src={selectedMerchant.selfiePhotograph} 
                alt="Selfie Photograph" 
                style={{ width: 200 }} 
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal} color="primary">Close</Button>
          </DialogActions>
        </Dialog>
      )}
      {error && <p style={{ color: "red" }}>{error}</p>}
    </Box>
  );
};

export default MerchantManagement;
