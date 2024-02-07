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
import getAttendanceCountByRegion from "../../utils/reports/getAttendanceCountByRegion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const RegionAttendance = () => {
  const [chartData, setChartData] = useState({
    datasets: [],
  });

  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const attendanceCountByRegion = await getAttendanceCountByRegion();

        setChartData({
          labels: ["North-East", "North", "Central", "West", "East"],
          datasets: [
            {
              label: "Number",
              data: attendanceCountByRegion,
              backgroundColor: [
                "rgb(255, 99, 132)",
                "rgb(255, 159, 64)",
                "rgb(255, 205, 86)",
                "rgb(76, 193, 192)",
                "rgb(55, 162, 235)",
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
              text: "Number of volunteers attended by region",
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
      <div style={{ backgroundColor: "white", height: "380px" }}>
        <Doughnut data={chartData} options={chartOptions} />
      </div>
    </>
  );
};

export default RegionAttendance;
