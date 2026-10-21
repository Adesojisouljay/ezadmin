import React from "react";
import { Box } from "@mui/material";
import Header from "components/Header";
import BreakdownChart from "components/BreakdownChart";
import "./breakdown.css"; // Import the CSS file

const Breakdown = () => {
  return (
    <Box className="breakdown-container">
      <Header title="BREAKDOWN" subtitle="Breakdown of Sales By Category" />
      <Box className="chart-container">
        <BreakdownChart />
      </Box>
    </Box>
  );
};

export default Breakdown;
