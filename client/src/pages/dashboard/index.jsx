import React, { useState, useEffect } from "react";
import FlexBetween from "components/FlexBetween";
import Header from "components/Header";
import { getAllUsers, getAllProfits } from "../../api/index";
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
} from "@mui/material";
import StatBox from "components/StatBox";
import "./dashboard.css";

const Dashboard = () => {
  const theme = useTheme();
  const isNonMediumScreens = useMediaQuery("(min-width: 1200px)");
  const [users, setUsers] = useState([]);
  const [profits, setProfits] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      setIsLoading(true);
      try {
        const response = await getAllUsers();
        if (response.success) {
          setUsers(response.users);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    getUsers();
  }, []);

  useEffect(() => {
    const getProfits = async () => {
      setIsLoading(true);
      try {
        const response = await getAllProfits();
        console.log(response)
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
      .reduce((total, profit) => total + profit.nairaFee, 0).toFixed(3);
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

      <Box className="dashboard-grid">
        <StatBox
          title="Total Customers"
          value={users && users?.length}
          increase="+14%"
          description="Since last month"
          icon={<PersonAdd className="statbox-icon" />}
        />
      </Box>

      <Box className="dashboard-grid">
        <StatBox
          title="Sales Today"
          value={users && users?.length}
          increase="+21%"
          description="Since last day"
          icon={<PointOfSale className="statbox-icon" />}
        />
        <StatBox
          title="Sales in last one week"
          value={users && users?.length}
          increase="+21%"
          description="Since one week"
          icon={<PointOfSale className="statbox-icon" />}
        />
        <StatBox
          title="Sales in last one month"
          value={users && users?.length}
          increase="+5%"
          description="Since last month"
          icon={<PointOfSale className="statbox-icon" />}
        />
        <StatBox
          title="Sales in last one year"
          value={users && users?.length}
          increase="+43%"
          description="Since last year"
          icon={<PointOfSale className="statbox-icon" />}
        />
      </Box>

      <Box className="dashboard-grid">
        {["day", "week", "month", "year"].map((timeRange) => {
          const { currentProfit, percentageChange } = calculateProfitsWithPercentage(timeRange);

          return (
            <StatBox
              key={timeRange}
              title={`Profits in last ${timeRange}`}
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
