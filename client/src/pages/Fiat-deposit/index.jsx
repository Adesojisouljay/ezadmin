import React, { useEffect, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "components/Header";
import { getAllFiatDeposits, confirmFiatDeposit, cancelFiatDeposit } from "../../api/index";
import "./index.css";

const FiatDepositManagement = () => {
  const [deposits, setDeposits] = useState([]);
  const [filteredDeposits, setFilteredDeposits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDeposits();
  }, []);

  useEffect(() => {
    filterDeposits();
  }, [searchTerm, deposits]);

  const fetchDeposits = async () => {
    setIsLoading(true);
    try {
      const response = await getAllFiatDeposits();
      setDeposits(response.data);
    } catch (error) {
      console.error("Failed to fetch fiat deposits", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmDeposit = async (depositId) => {
    try {
      await confirmFiatDeposit(depositId);
      fetchDeposits(); // Refresh the deposits after confirming
    } catch (error) {
      console.error("Failed to confirm deposit", error);
    }
  };

  const handleCancelDeposit = async (depositId) => {
    try {
      await cancelFiatDeposit(depositId);
      fetchDeposits(); // Refresh the deposits after cancelling
    } catch (error) {
      console.error("Failed to cancel deposit", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filterDeposits = () => {
    const filtered = deposits.filter((deposit) =>
      deposit.user?.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      deposit.user?.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredDeposits(filtered);
  };

  const columns = [
    { field: "_id", headerName: "ID", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 1 },
    { field: "narration", headerName: "Narration", flex: 1 },
    { 
      field: "status", 
      headerName: "Status", 
      flex: 1,
      renderCell: (params) => (
        <span className={`status-${params.value.toLowerCase()}`}>
          {params.value.charAt(0).toUpperCase() + params.value.slice(1)}
        </span>
      ),
    },
    {
      field: "username",
      headerName: "UserName",
      flex: 1,
      valueGetter: (params) => params.row.user?.username, // Use valueGetter
    },
    {
      field: "email",
      headerName: "User email",
      flex: 1,
      valueGetter: (params) => params.row.user?.email, // Use valueGetter
    },
    {
      field: "merchant",
      headerName: "Merchant Username",
      flex: 1,
      valueGetter: (params) => params.row.merchantUsername?.username, // Use valueGetter
    },
    // { field: "user.username", headerName: "User Username", flex: 1 },
    // { field: "user.email", headerName: "User Email", flex: 1 },
    // { field: "merchantUsername.username", headerName: "Merchant Username", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <div>
          {params.row.status === "pending" ? (
            <>
              <Button 
                variant="contained" 
                color="primary" 
                size="small"
                onClick={() => handleConfirmDeposit(params.row._id)}
                style={{ marginRight: 8 }}
              >
                Confirm
              </Button>
              <Button 
                variant="contained" 
                color="secondary" 
                size="small"
                onClick={() => handleCancelDeposit(params.row._id)}
              >
                Cancel
              </Button>
            </>
          ) : (
            <span className="status-emoji">
              {params.row.status === "completed" ? "✅" : "❌"}
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <Box className="fiat-deposit-management">
      <Header title="FIAT DEPOSIT MANAGEMENT" subtitle="Manage Fiat Deposits" />
      <Box className="search-container">
        <TextField
          variant="outlined"
          placeholder="Search by username or email"
          value={searchTerm}
          onChange={handleSearchChange}
          style={{ marginBottom: 16 }}
        />
      </Box>
      <Box className="fiat-data-grid">
        <DataGrid
          loading={isLoading}
          getRowId={(row) => row._id}
          rows={filteredDeposits}
          columns={columns}
          autoHeight
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </Box>
    </Box>
  );
};

export default FiatDepositManagement;
