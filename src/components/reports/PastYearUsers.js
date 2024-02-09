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
import getPast12Months from "../../utils/reports/getPast12Months";
import getUserCountByMonth from "../../utils/reports/getUserCountByMonth";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PastYearUsers = () => {
  const [chartData, setChartData] = useState({
    datasets: [],
  });

  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userCountByMonths = await getUserCountByMonth();
        const months = getPast12Months();

        setChartData({
          labels: months,
          datasets: [
            {
              label: "# Volunteers",
              data: userCountByMonths,
              backgroundColor: "rgb(255, 99, 132, 0.4)",
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
              text: "Number of new volunteers in the past 12 months",
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
      <div style={{ backgroundColor: "white", height: "400px" }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </>
  );
};

export default PastYearUsers;
