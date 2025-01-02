import React, { useEffect, useState } from "react";
import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Paper, Grid } from "@mui/material";
import Header from "components/Header";
import { DataGrid } from "@mui/x-data-grid";
import { getAllProfits } from "../../api/index";

const Profits = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [profits, setProfits] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [selectedTransactionType, setSelectedTransactionType] = useState("");

  useEffect(() => {
    const getProfits = async () => {
      setIsLoading(true);
      try {
        const response = await getAllProfits();
        if (response.success) {
          setProfits(response.data);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getProfits();
  }, []);

  // Function to calculate totals for selected transaction type
  const calculateTypeTotal = (field) => {
    const filteredProfits = selectedTransactionType
      ? profits.filter((profit) => profit.transactionType === selectedTransactionType)
      : profits;
    return filteredProfits.reduce((total, profit) => total + Number(profit[field] || 0), 0).toFixed(2);
  };

  // Function to calculate totals for selected currency
  const calculateCurrencyTotal = (field) => {
    const filteredProfits = selectedCurrency
      ? profits.filter((profit) => profit.currency === selectedCurrency)
      : profits;
    return filteredProfits.reduce((total, profit) => total + Number(profit[field] || 0), 0).toFixed(2);
  };

  const handleCurrencyChange = (event) => {
    setSelectedCurrency(event.target.value);
  };

  const handleTransactionTypeChange = (event) => {
    setSelectedTransactionType(event.target.value);
  };

  const columns = [
    { field: "_id", headerName: "ID", flex: 1 },
    { field: "userId", headerName: "User ID", flex: 1 },
    { field: "timestamp", headerName: "Created At", flex: 1 },
    { field: "currency", headerName: "Currency", flex: 0.5 },
    {
      field: "cryptoAmount",
      headerName: "Crypto Qty",
      flex: 1,
      renderCell: (params) => `${Number(params.value).toFixed(2)}`,
    },
    {
      field: "cryptoFee",
      headerName: "Crypto Fee",
      flex: 1,
      renderCell: (params) => `${Number(params.value).toFixed(2)}`,
    },
    {
      field: "nairaAmount",
      headerName: "Naira Amount",
      flex: 1,
      renderCell: (params) => `${Number(params.value).toFixed(2)}`,
    },
    {
      field: "nairaFee",
      headerName: "Naira Fee",
      flex: 1,
      renderCell: (params) => `${Number(params.value).toFixed(2)}`,
    },
    { field: "transactionType", headerName: "Trx type", flex: 1 },
  ];

  return (
    <Box className="customers-container">
      <Header title="Profits" subtitle="List of transaction Profits" />

      {/* Grid layout for boxes */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {/* Box for Transaction Type Filter */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Transaction Type Summary
            </Typography>
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel>Transaction Type</InputLabel>
              <Select
                value={selectedTransactionType}
                onChange={handleTransactionTypeChange}
                label="Transaction Type"
              >
                <MenuItem value="">All</MenuItem>
                {[...new Set(profits.map((profit) => profit.transactionType))].map((type, index) => (
                  <MenuItem key={index} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="body1">Total Naira Amount: ₦{calculateTypeTotal("nairaAmount")}</Typography>
            <Typography variant="body1">Total Naira Fee: ₦{calculateTypeTotal("nairaFee")}</Typography>
            <Typography variant="body1">Total Crypto Amount: {calculateTypeTotal("cryptoAmount")}</Typography>
            <Typography variant="body1">Total Crypto Fee: {calculateTypeTotal("cryptoFee")}</Typography>
          </Paper>
        </Grid>

        {/* Box for Currency Filter */}
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Currency Summary
            </Typography>
            <FormControl fullWidth variant="outlined" sx={{ mb: 2 }}>
              <InputLabel>Currency</InputLabel>
              <Select
                value={selectedCurrency}
                onChange={handleCurrencyChange}
                label="Currency"
              >
                <MenuItem value="">All</MenuItem>
                {[...new Set(profits.map((profit) => profit.currency))].map((currency, index) => (
                  <MenuItem key={index} value={currency}>
                    {currency}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Typography variant="body1">Total Naira Amount: ₦{calculateCurrencyTotal("nairaAmount")}</Typography>
            <Typography variant="body1">Total Naira Fee: ₦{calculateCurrencyTotal("nairaFee")}</Typography>
            <Typography variant="body1">Total Crypto Amount: {calculateCurrencyTotal("cryptoAmount")}</Typography>
            <Typography variant="body1">Total Crypto Fee: {calculateCurrencyTotal("cryptoFee")}</Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Data Grid */}
      <Box className="customers-data-grid">
        <DataGrid
          loading={isLoading}
          getRowId={(row) => row?._id}
          rows={profits}
          columns={columns}
          autoHeight
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </Box>
    </Box>
  );
};

export default Profits;
