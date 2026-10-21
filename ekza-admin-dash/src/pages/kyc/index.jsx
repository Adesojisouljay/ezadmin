import React, { useEffect, useState } from "react";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Header from "components/Header";
import { getAllKYC, approveKYC, rejectKYC, getUserProfile } from "../../api";
import { KycImageModal } from "components/kyc-modal";
import './kyc.css';

const Kyc = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [modalImages, setModalImages] = useState({ idDocumentUrl: null, selfieUrl: null });
  const [selectedUserProfile, setSelectedUserProfile] = useState(null);

  useEffect(() => {
    const fetchKYCRecords = async () => {
      setIsLoading(true);
      try {
        const records = await getAllKYC();
        setData(records);
      } catch (error) {
        console.error("Failed to fetch KYC records", error);
      }
      setIsLoading(false);
    };

    fetchKYCRecords();
  }, []);

  const handleApprove = async (kycId) => {
    try {
      await approveKYC(kycId);
      const updatedRecords = await getAllKYC();
      setData(updatedRecords);
    } catch (error) {
      console.error("Failed to approve KYC", error);
    }
  };

  const handleReject = async (kycId) => {
    try {
      await rejectKYC(kycId);
      const updatedRecords = await getAllKYC();
      setData(updatedRecords);
    } catch (error) {
      console.error("Failed to reject KYC", error);
    }
  };

//   const handleCompareClick = (idDocumentUrl, selfieUrl) => {
//     setModalImages({ idDocumentUrl, selfieUrl });
//   };

  const handleCloseModal = () => {
    setModalImages({ idDocumentUrl: null, selfieUrl: null });
    setSelectedUserProfile(null);
  };

  const fetchUserProfile = async (userId) => {
    try {
      const userProfile = await getUserProfile(userId);
      return userProfile;
    } catch (error) {
      console.error("Error fetching user KYC data:", error);
    }
  };

  const handleCompareClick = async (idDocumentUrl, selfieUrl, userId) => {
    const userData = await fetchUserProfile(userId);
    if (userData) {
        setModalImages({ idDocumentUrl, selfieUrl });
      setSelectedUserProfile(userData);
    }
  };


  const columns = [
    { field: "_id", headerName: "ID", flex: 1 },
    { field: "userId", headerName: "User ID", flex: 1 },
    { field: "firstName", headerName: "Kyc First Name", flex: 0.5 },
    { field: "lastName", headerName: "Kyc Last Name", flex: 0.5 },
    // { field: "username", headerName: "User First Name", flex: 0.5 },
    // { field: "email", headerName: "User Last Name", flex: 1 },
    { 
      field: "kycStatus", 
      headerName: "KYC Status", 
      flex: 0.5,
      renderCell: (params) => (
        <span className={`status-${params.value.toLowerCase()}`}>
          {params.value}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      renderCell: (params) => (
        <div>
          <Button 
            variant="contained" 
            color="primary" 
            size="small"
            onClick={() => handleCompareClick(params.row.idDocument, params.row.selfie, params.row.userId)}
            style={{ marginRight: 8 }}
          >
            Compare
          </Button>
          {params.row.kycStatus === "Pending" && (
            <>
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
                color="error" 
                size="small"
                onClick={() => handleReject(params.row._id)}
              >
                Reject
              </Button>
            </>
          )}
        </div>
      ),
    },
  ];

  return (
    <Box className="kyc-management">
      <Header title="KYC MANAGEMENT" subtitle="Manage KYC Applications" />
      <Box className="kyc-data-grid">
        <DataGrid
          loading={isLoading}
          getRowId={(row) => row._id}
          rows={data}
          columns={columns}
          autoHeight
          pageSize={10}
          rowsPerPageOptions={[10, 20, 50]}
        />
      </Box>

      {modalImages.idDocumentUrl && (
        <KycImageModal 
          idDocumentUrl={modalImages.idDocumentUrl} 
          selfieUrl={modalImages.selfieUrl} 
          onClose={handleCloseModal}
          userProfile={selectedUserProfile}
        />
      )}
    </Box>
  );
};

export default Kyc;
