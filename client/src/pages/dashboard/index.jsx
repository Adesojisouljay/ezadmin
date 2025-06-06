import React, { useState, useEffect } from "react";
import FlexBetween from "components/FlexBetween";
import Header from "components/Header";
import { getAllUsers, getAllProfits, updatePricePercentage, getCurrenctPricePercentage, toggleAppMode, getAppMode } from "../../api/index";
import {
  DownloadOutlined,
  PointOfSale,
  PersonAdd,
} from "@mui/icons-material";
import {
  Box,
  Button,
  Typography,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Switch
} from "@mui/material";
import StatBox from "components/StatBox";
import "./dashboard.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const navigate = useNavigate()
  
  const [users, setUsers] = useState([]);
  const [profits, setProfits] = useState([]);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isLoadingProfits, setIsLoadingProfits] = useState(false);
  const [error, setError] = useState(null);
  const [newPercent, setNewPercent] = useState(0);
  const [currentPercentage, setCurrentPercentage] = useState(0)
  const [isLoadingPercentage, setIsLoadingPercentage] = useState(false);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [newHbdPercentage, setNewHbdPercentage] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if(!token) {
      navigate("/login")
    }
  })

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoadingUsers(true);
      setError(null);
      try {
        const response = await getAllUsers();
        if (response.success) {
          setUsers(response.users);
        } else {
          setError('Failed to fetch users');
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError('An error occurred while fetching users');
      } finally {
        setIsLoadingUsers(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchProfits = async () => {
      setIsLoadingProfits(true);
      setError(null);
      try {
        const response = await getAllProfits();
        if (response.success) {
          setProfits(response.data);
        } else {
          setError('Failed to fetch profits');
        }
      } catch (error) {
        console.error("Error fetching profits:", error);
        setError('An error occurred while fetching profits');
      } finally {
        setIsLoadingProfits(false);
      }
    };
    fetchProfits();
    countSales();
  }, []);
  
  useEffect(() => {
    const getPercentage = async () => {
      setIsLoadingPercentage(true);
      setError(null);
      try {
        const response = await getCurrenctPricePercentage();
        if (response?.success) {
          setCurrentPercentage(response?.currentPercentage);
        } else {
          setError('Failed to fetch current percentage');
        }
      } catch (error) {
        console.error("Error fetching profits:", error);
        setError('An error occurred while fetching profits');
      } finally {
        setIsLoadingPercentage(false);
      }
    };
    getPercentage();
  }, []);

  useEffect(() => {
    const getMode = async () => {
      try {
        const response = await getAppMode();
        // if (response?.data?.message) {
          setMaintenanceMode(response?.maintenanceRecord?.isMaintenance);
        // } else {
          // console.error("Failed to toggle maintenance mode:", response?.data?.message);
        // }
      } catch (error) {
        console.error("Error getting maintenance mode:", error);
      }
    };
    getMode()
  }, [])

  const calculateProfits = (timeRange) => {
    const currentDate = new Date();
    let startDate, endDate;

    switch (timeRange) {
      case "today":
        startDate = new Date(currentDate.setHours(0, 0, 0, 0));
        endDate = new Date();
        break;
      case "week":
        startDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
        endDate = new Date();
        break;
      case "month":
        startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
        endDate = new Date();
        break;
      case "sixMonths":
        startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 6));
        endDate = new Date();
        break;
      case "year":
        startDate = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
        endDate = new Date();
        break;
      default:
        startDate = new Date(currentDate.setHours(0, 0, 0, 0));
        endDate = new Date();
        break;
    }

    return profits
      .filter((profit) => new Date(profit.timestamp) >= startDate)
      .reduce((total, profit) => total + profit.nairaFee, 0)
      .toFixed(3);
  };

  const calculateSales = (timeRange) => {
    const currentDate = new Date();
    let startDate;

    switch (timeRange) {
      case "day":
        startDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
        break;
      case "week":
        startDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
        break;
      case "month":
        startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
        break;
      case "sixMonths":
        startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 6));
        break;
      case "year":
        startDate = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
        break;
      default:
        startDate = new Date(currentDate.setDate(currentDate.getDate() - 1)); // Default: 1 day
        break;
    }

    return profits
      .filter((profit) => new Date(profit.timestamp) >= startDate)
      .reduce((total, profit) => total + profit.nairaAmount, 0)
      .toFixed(2);
  };

  const calculatePercentageChange = (currentProfit, previousProfit) => {
    if (previousProfit === 0) return 0;
    return ((currentProfit - previousProfit) / previousProfit) * 100;
  };

  const calculateProfitsWithPercentage = (timeRange) => {
    const currentProfit = parseFloat(calculateProfits(timeRange));
    let previousProfit = 0;

    switch (timeRange) {
      case "today":
        previousProfit = parseFloat(calculateProfits("yesterday"));
        break;
      case "week":
        previousProfit = parseFloat(calculateProfits("previousWeek"));
        break;
      case "month":
        previousProfit = parseFloat(calculateProfits("previousMonth"));
        break;
      case "sixMonths":
        previousProfit = parseFloat(calculateProfits("previousSixMonths"));
        break;
      case "year":
        previousProfit = parseFloat(calculateProfits("previousYear"));
        break;
      default:
        previousProfit = 0;
        break;
    }

    const percentageChange = calculatePercentageChange(currentProfit, previousProfit);
    return { currentProfit, percentageChange };
  };

  const countSales = (timeRange) => {
    const currentDate = new Date();
    let startDate;
  
    switch (timeRange) {
      case "day":
        startDate = new Date(currentDate.setDate(currentDate.getDate() - 1));
        break;
      case "week":
        startDate = new Date(currentDate.setDate(currentDate.getDate() - 7));
        break;
      case "month":
        startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 1));
        break;
      case "sixMonths":
        startDate = new Date(currentDate.setMonth(currentDate.getMonth() - 6));
        break;
      case "year":
        startDate = new Date(currentDate.setFullYear(currentDate.getFullYear() - 1));
        break;
      default:
        startDate = new Date(currentDate.setDate(currentDate.getDate() - 1)); // Default: 1 day
        break;
    }
  
    return profits.filter((profit) => new Date(profit.timestamp) >= startDate).length;
  };

  const updatePrices = async () => {
    try {
      const response = await updatePricePercentage({ 
        newCryptoPercentage: newPercent || undefined,
        newHbdPercentage: newHbdPercentage || undefined
      });
      
      if (response.success) {
        console.log("Price percentage updated successfully!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  
  const toggleMaintenanceMode = async () => {
    try {
      const response = await toggleAppMode(!maintenanceMode);
      setMaintenanceMode(response.maintenanceRecord.isMaintenance)
      
    } catch (error) {
      console.error("Error updating maintenance mode:", error);
    }
  };

  if (isLoadingUsers || isLoadingProfits) {
    return (
      <Box className="loading-container">
        <CircularProgress />
        <Typography>Loading data...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="error-container">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box className="dashboard-container">
      <FlexBetween>
        <Header title="DASHBOARD" subtitle="Welcome to your dashboard" />
        <Box>
          <Button className="download-button">
            <DownloadOutlined className="download-icon" />
            Download Reports
          </Button>
        </Box>
      </FlexBetween>

      <Box className="dashboard-grid dashboard-top">
        <Box
          className="dashboard-customers"
        >
          <StatBox
            title="Total Customers"
            value={users.length}
            increase="+14%"
            description="Since last month"
            icon={<PersonAdd className="statbox-icon" />}
          />
        </Box>
        
        <Box >
          <>
            <h2>Update Price Percent</h2>
            <h3>Currenct Percentage: {currentPercentage?.cryptoAdjustmentPercentage}%</h3>
            <Box display="flex" flexDirection="flex" alignItems="center">
              <input
                type="number"
                value={newPercent || null}
                onChange={(e) => setNewPercent(Number(e.target.value))}
                placeholder="Enter new percentage"
                style={{ marginBottom: '10px', padding: '5px', width: '300px' }}
              />
              <Button variant="contained" color="primary" width="150px" onClick={updatePrices}>
                {isLoadingPercentage ? "Update..." :  "Update"}
              </Button>
            </Box>
          </>
        </Box>

      {/* HBD PRICE % */}
        <Box >
          <>
            <h2>Update HBD Price Percent</h2>
            <h3>Current HBD Percentage: {currentPercentage?.hbdAdjustmentPercentage}%</h3>
            <Box display="flex" flexDirection="flex" alignItems="center">
            <input
              type="number"
              value={newHbdPercentage ||null}
              onChange={(e) => setNewHbdPercentage(Number(e.target.value))}
              placeholder="Enter new HBD percentage"
              style={{ marginBottom: '10px', padding: '5px', width: '300px' }}
            />
              <Button variant="contained" color="primary" width="150px" onClick={updatePrices}>
                {isLoadingPercentage ? "Update..." :  "Update"}
              </Button>
            </Box>
          </>
        </Box>

        {/* Maintenance Mode Switch */}
        <Box>
          <Typography variant="h6">Maintenance Mode</Typography>
          <Switch
            checked={!maintenanceMode}
            onChange={toggleMaintenanceMode}
            color="primary"
          />
          <Typography variant="body1">{maintenanceMode ? "App is in maintenance mode" : "App is active"}</Typography>
        </Box>

      </Box>


      <Box className="dashboard-grid">
        <StatBox
          title="Sales Today"
          value={`₦${calculateSales("day")}`}
          increase="+21%" // Can be updated dynamically
          description={`${countSales("day")} sale in the last day`}
          icon={<PointOfSale className="statbox-icon" />}
        />
        <StatBox
          title="Sales in Last One Week"
          value={`₦${calculateSales("week")}`}
          increase="+21%"
          description={`${countSales("week")} sales in the last week`}
          icon={<PointOfSale className="statbox-icon" />}
        />
        <StatBox
          title="Sales in Last One Month"
          value={`₦${calculateSales("month")}`}
          increase="+5%"
          description={`${countSales("month")} sales in the last month`}
          icon={<PointOfSale className="statbox-icon" />}
        />
        <StatBox
          title="Sales in Last 6 Months"
          value={`₦${calculateSales("sixMonths")}`}
          increase="+15%"
          description={`${countSales("sixMonths")} sales in the last 6 months`}
          icon={<PointOfSale className="statbox-icon" />}
        />
        <StatBox
          title="Sales in Last Year"
          value={`₦${calculateSales("year")}`}
          increase="+43%"
          description={`${countSales("year")} sales in the last year`}
          icon={<PointOfSale className="statbox-icon" />}
        />
      </Box>

      <Box className="dashboard-grid">
        {["day", "week", "month", "sixMonths", "year"].map((timeRange) => {
          const { currentProfit, percentageChange } = calculateProfitsWithPercentage(timeRange);

          return (
            <StatBox
              key={timeRange}
              title={`Profits in Last ${timeRange}`}
              value={`₦${currentProfit}`}
              increase={`${percentageChange > 0 ? "+" : ""}${percentageChange.toFixed(2)}%`}
              description={`Since last ${timeRange}`}
              icon={<PointOfSale className="statbox-icon" />}
            />
          );
        })}
      </Box>
    </Box>
  );
};

export default Dashboard;
