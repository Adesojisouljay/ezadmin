import React, { useEffect, useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "components/Header";
import {
  getAllFiatWithdrawals,
  confirmFiatWithdrawal,
  cancelFiatWithdrawal,
} from "../../api/index";
import "./index.css";

const FiatWithdrawalAction = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  useEffect(() => {
    filterWithdrawals();
  }, [searchTerm, withdrawals]);

  const fetchWithdrawals = async () => {
    setIsLoading(true);
    try {
      const response = await getAllFiatWithdrawals();
      console.log(".....",response)
      setWithdrawals(response.withdrawals?.reverse());
    } catch (error) {
      console.error("Failed to fetch fiat withdrawals", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirmWithdrawal = async (withdrawalId) => {
    try {
      await confirmFiatWithdrawal(withdrawalId);
      fetchWithdrawals(); // Refresh the withdrawals after confirming
    } catch (error) {
      console.error("Failed to confirm withdrawal", error);
    }
  };

  const handleCancelWithdrawal = async (withdrawalId) => {
    try {
      await cancelFiatWithdrawal(withdrawalId);
      fetchWithdrawals(); // Refresh the withdrawals after canceling
    } catch (error) {
      console.error("Failed to cancel withdrawal", error);
    }
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const filterWithdrawals = () => {
    const filtered = withdrawals?.filter((withdrawal) =>
      withdrawal.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredWithdrawals(filtered);
  };

  const columns = [
    { field: "_id", headerName: "ID", flex: 1 },
    { field: "amount", headerName: "Amount", flex: 1 },
    {
      field: "accountName",
      headerName: "Account Name",
      flex: 1,
      valueGetter: (params) => params.row.account?.accountName, // Use valueGetter
    },
    {
      field: "accountNumber",
      headerName: "Account Number",
      flex: 1,
      valueGetter: (params) => params.row.account?.accountNumber, // Use valueGetter
    },
    {
      field: "bankName",
      headerName: "Bank Name",
      flex: 1,
      valueGetter: (params) => params.row.account?.bankName, // Use valueGetter
    },
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
      headerName: "Username",
      flex: 1,
      valueGetter: (params) => params.row.user?.username, // Use valueGetter
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
      valueGetter: (params) => params.row.user?.email, // Use valueGetter
    },
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
                onClick={() => handleConfirmWithdrawal(params.row._id)}
                style={{ marginRight: 8 }}
              >
                Confirm
              </Button>
              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => handleCancelWithdrawal(params.row._id)}
              >
                Cancel
              </Button>
            </>
          ) : (
            <span className="status-emoji">
              {params.row.status === "confirmed" ? "✅" : "❌"}
            </span>
          )}
        </div>
      ),
    },
  ];
  

  return (
    <Box className="fiat-withdrawal-management">
      <Header title="FIAT WITHDRAWAL MANAGEMENT" subtitle="Manage Fiat Withdrawals" />
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
          rows={filteredWithdrawals}
          columns={columns}
          autoHeight
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </Box>
    </Box>
  );
};

export default FiatWithdrawalAction;
