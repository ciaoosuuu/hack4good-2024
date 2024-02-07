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
import getAttendanceCountByMonth from "../../utils/reports/getAttendanceCountByMonth";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const PastYearAttendees = () => {
  const [chartData, setChartData] = useState({
    datasets: [],
  });

  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          attendanceCountByMonthVolunteer,
          attendanceCountByMonthWorkshop,
          attendanceCountByMonthTraining,
          attendanceCountByMonth,
        ] = await getAttendanceCountByMonth();
        const months = getPast12Months();

        setChartData({
          labels: months,
          datasets: [
            {
              label: "# Volunteers (Volunteering)",
              data: attendanceCountByMonthVolunteer,
              backgroundColor: "rgb(255, 99, 132, 0.4)",
            },
            {
              label: "# Volunteers (Workshop)",
              data: attendanceCountByMonthWorkshop,
              backgroundColor: "rgb(75, 192, 192, 0.4)",
            },
            {
              label: "# Volunteers (Training)",
              data: attendanceCountByMonthTraining,
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
              text: "Number of volunteers who attended activities in the past 12 months",
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

export default PastYearAttendees;
