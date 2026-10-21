import React, { useState } from "react";
import './overview.css';
import Header from "components/Header";
import OverviewChart from "components/OverviewChart";

const Overview = () => {
  const [view, setView] = useState("units");

  return (
    <div className="overview-container">
      <Header
        title="OVERVIEW"
        subtitle="Overview of general revenue and profit"
      />
      <div className="chart-container">
        <div className="form-control">
          <label htmlFor="viewSelect">View</label>
          <select
            id="viewSelect"
            value={view}
            onChange={(e) => setView(e.target.value)}
          >
            <option value="sales">Sales</option>
            <option value="units">Units</option>
          </select>
        </div>
        <OverviewChart view={view} />
      </div>
    </div>
  );
};

export default Overview;
