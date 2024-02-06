"use client";

import { Bar } from "react-chartjs-2";
import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import getActivityCountByRegion from "../../utils/reports/getActivityCountByRegion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const RegionActivities = () => {
  const [chartData, setChartData] = useState({
    datasets: [],
  });

  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const activityCountByRegion = await getActivityCountByRegion();

        console.log("Activity Count by Region:", activityCountByRegion);

        setChartData({
          labels: ["North-East", "North", "Central", "West", "East"],
          datasets: [
            {
              label: "Number",
              data: activityCountByRegion,
              borderColor: "rgb(53, 162, 235)",
              backgroundColor: "rgb(53, 162, 235, 0.4",
            },
          ],
        });
        setChartOptions({
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Number of activities by region",
            },
          },
          maintainAspectRatio: false,
          responsive: true,
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div style={{ backgroundColor: "white" }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </>
  );
};

export default RegionActivities;
