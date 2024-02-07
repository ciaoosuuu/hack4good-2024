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
import getActivityCountByType from "../../utils/reports/getActivityCountByType";

ChartJS.register(
  CategoryScale,
  LinearScale,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const TypesActivities = () => {
  const [chartData, setChartData] = useState({
    datasets: [],
  });

  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const activityCountByType = await getActivityCountByType();

        setChartData({
          labels: ["Volunteering", "Workshop", "Training"],
          datasets: [
            {
              label: "# Activities",
              data: activityCountByType,
              backgroundColor: [
                "rgb(255, 99, 132, 0.4)",
                "rgb(255, 159, 64, 0.4)",
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
              text: "Number of activities by type",
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

export default TypesActivities;
