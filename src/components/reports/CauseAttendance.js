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
import getAttendanceCountByCause from "../../utils/reports/getAttendanceCountByCause";
import causes from "../../utils/reports/causes";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CauseActivities = () => {
  const [chartData, setChartData] = useState({
    datasets: [],
  });

  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          causeCountArrayVolunteering,
          causeCountArrayWorkshop,
          causeCountArrayTraining,
          causeCountArray,
        ] = await getAttendanceCountByCause();

        setChartData({
          labels: causes,
          datasets: [
            {
              label: "# Volunteers (Volunteering)",
              data: causeCountArrayVolunteering,
              backgroundColor: "rgb(255, 99, 132, 0.4)",
            },
            {
              label: "# Volunteers (Workshop)",
              data: causeCountArrayWorkshop,
              backgroundColor: "rgb(75, 192, 192, 0.4)",
            },
            {
              label: "# Volunteers (Training)",
              data: causeCountArrayTraining,
              backgroundColor: "rgb(53, 162, 235, 0.4)",
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
              text: "Number of volunteers signed up for each cause",
            },
          },
          maintainAspectRatio: false,
          responsive: true,
          scale: {
            ticks: {
              precision: 0,
            },
            x: {
              stacked: true,
            },
            y: {
              stacked: true,
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
      <div style={{ backgroundColor: "white", height: "400px" }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </>
  );
};

export default CauseActivities;
