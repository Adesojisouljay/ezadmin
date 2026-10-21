import React from "react";
import { useGetGeographyQuery } from "state/api";
import Header from "components/Header";
import { ResponsiveChoropleth } from "@nivo/geo";
import { geoData } from "state/geoData";
import './geography.css';

const Geography = () => {
  const { data } = useGetGeographyQuery();

  return (
    <div className="geography-container">
      <Header title="GEOGRAPHY" subtitle="Find where your users are located." />
      <div className="map-container">
        {data ? (
          <ResponsiveChoropleth
            data={data}
            theme={{
              axis: {
                domain: {
                  line: {
                    stroke: "#cccccc", // Replace with your preferred color
                  },
                },
                legend: {
                  text: {
                    fill: "#cccccc", // Replace with your preferred color
                  },
                },
                ticks: {
                  line: {
                    stroke: "#cccccc", // Replace with your preferred color
                    strokeWidth: 1,
                  },
                  text: {
                    fill: "#cccccc", // Replace with your preferred color
                  },
                },
              },
              legends: {
                text: {
                  fill: "#cccccc", // Replace with your preferred color
                },
              },
              tooltip: {
                container: {
                  color: "#333333", // Replace with your preferred color
                },
              },
            }}
            features={geoData.features}
            margin={{ top: 0, right: 0, bottom: 0, left: -50 }}
            domain={[0, 60]}
            unknownColor="#666666"
            label="properties.name"
            valueFormat=".2s"
            projectionScale={150}
            projectionTranslation={[0.45, 0.6]}
            projectionRotation={[0, 0, 0]}
            borderWidth={1.3}
            borderColor="#ffffff"
            legends={[
              {
                anchor: "bottom-right",
                direction: "column",
                justify: true,
                translateX: 0,
                translateY: -125,
                itemsSpacing: 0,
                itemWidth: 94,
                itemHeight: 18,
                itemDirection: "left-to-right",
                itemTextColor: "#cccccc", // Replace with your preferred color
                itemOpacity: 0.85,
                symbolSize: 18,
                effects: [
                  {
                    on: "hover",
                    style: {
                      itemTextColor: "#000000", // Replace with your preferred color
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        ) : (
          <>Loading...</>
        )}
      </div>
    </div>
  );
};

export default Geography;
