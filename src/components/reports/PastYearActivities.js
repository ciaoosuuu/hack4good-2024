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
import getActivityCountByMonth from "../../utils/reports/getActivityCountByMonth";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PastYearActivities = () => {
  const [chartData, setChartData] = useState({
    datasets: [],
  });

  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          volunteeringCountByMonth,
          workshopCountByMonth,
          trainingCountByMonth,
          activityCountByMonth,
        ] = await getActivityCountByMonth();
        const months = getPast12Months();

        setChartData({
          labels: months,
          datasets: [
            {
              label: "# Volunteering",
              data: volunteeringCountByMonth,
              backgroundColor: "rgb(255, 99, 132)",
            },
            {
              label: "# Workshops",
              data: workshopCountByMonth,
              backgroundColor: "rgb(75, 192, 192)",
            },
            {
              label: "# Trainings",
              data: trainingCountByMonth,
              backgroundColor: "rgb(53, 162, 235)",
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
              text: "Number of activities held in the past 12 months",
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
      <div style={{ backgroundColor: "white", height: "420px" }}>
        <Bar data={chartData} options={chartOptions} />
      </div>
    </>
  );
};

export default PastYearActivities;
