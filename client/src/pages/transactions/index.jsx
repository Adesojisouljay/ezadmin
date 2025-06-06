import React, { useState, useEffect } from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "components/Header";
import DataGridCustomToolbar from "components/DataGridCustomToolbar";
import { getAllTransactions } from "../../api/index";
import './transactions.css';

const Transactions = () => {
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(20);
  const [sort, setSort] = useState({});
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [total, setTotal] = useState(0);

  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    const getTransactions = async () => {
      setIsLoading(true);
      try {
        const response = await getAllTransactions();
        console.log(response)
        if (response.success) {
          setData(response.transactionH || []);
          setFilteredData(response.transactionH?.reverse() || []);
          setTotal(response.total || 0);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getTransactions();
  }, []);

  useEffect(() => {
    if (!search) {
      setFilteredData(data);
    } else {
      const lowerCaseSearch = search.toLowerCase();
      const filtered = data.filter(
        (transaction) =>
          transaction._id.toLowerCase().includes(lowerCaseSearch) ||
          transaction.trxId.includes(lowerCaseSearch) ||
          transaction.type.toLowerCase().includes(lowerCaseSearch)
      );
      setFilteredData(filtered);
    }
  }, [search, data]);

  const handleClearSearch = () => {
    setSearch("");
    setSearchInput("");
  };

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    }, 
    {
      field: "userId",
      headerName: "User ID",
      flex: 1,
    },
    {
      field: "timestamp",
      headerName: "CreatedAt",
      flex: 1,
    },
    {
      field: "currency",
      headerName: "Coin",
      flex: 0.5,
    },
    {
      field: "type",
      headerName: "Transaction Type",
      flex: 1,
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      renderCell: (params) => `NGN${Number(params.value).toFixed(2)}`,
    },
  ];

  return (
    <Box className="transactions-container">
      <Header title="TRANSACTIONS" subtitle="Entire list of transactions" />
      <Box className="transactions-actions">
        <Button
          variant="contained"
          color="primary"
          onClick={handleClearSearch}
          disabled={!search}
        >
          See All Transactions
        </Button>
      </Box>
      <Box className="transactions-data-grid">
        <DataGrid
          loading={isLoading}
          getRowId={(row) => row._id}
          rows={filteredData || []}
          columns={columns}
          // rowCount={total}
          // rowsPerPageOptions={[20, 50, 100]}
          // pagination
          // page={page}
          // pageSize={pageSize}
          autoHeight
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
          // paginationMode="server"
          // sortingMode="server"
          // onPageChange={(newPage) => setPage(newPage)}
          // onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
          onSortModelChange={(newSortModel) => setSort(...newSortModel)}
          components={{ Toolbar: DataGridCustomToolbar }}
          componentsProps={{
            toolbar: {
              searchInput,
              setSearchInput,
              setSearch,
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Transactions;
