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
import getAttendanceCountByRegion from "../../utils/reports/getAttendanceCountByRegion";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
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
              text: "Number of volunteers attended by region",
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

export default RegionAttendance;
