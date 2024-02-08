"use client";

import { Doughnut } from "react-chartjs-2";
import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import getActivityCountByRegion from "../../utils/reports/getActivityCountByRegion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
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
              label: "# Activities",
              data: activityCountByRegion,
              backgroundColor: [
                "rgb(255, 99, 132, 0.4)",
                "rgb(255, 159, 64, 0.4)",
                "rgb(255, 205, 86, 0.4)",
                "rgb(76, 193, 192, 0.4)",
                "rgb(55, 162, 235, 0.4)",
              ],
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
          scale: {
            ticks: {
              precision: 0,
            },
          },
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <div style={{ backgroundColor: "white", height: "340px" }}>
        <Doughnut data={chartData} options={chartOptions} />
      </div>
    </>
  );
};

export default RegionActivities;
