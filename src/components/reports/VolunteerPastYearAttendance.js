"use client";

import { Line } from "react-chartjs-2";
import { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import getPast12Months from "../../utils/reports/getPast12Months";
import getVolunteerAttendanceByMonth from "../../utils/reports/getVolunteerAttendanceByMonth";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const VolunteerPastYearAttendance = ({ volunteerId }) => {
  console.log(volunteerId);
  //   const volunteerId = volunteerId;
  const [chartData, setChartData] = useState({
    datasets: [],
  });

  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [
          volunteerAttendanceCountByMonthVolunteer,
          volunteerAttendanceCountByMonthWorkshop,
          volunteerAttendanceCountByMonthTraining,
          volunteerAttendanceCountByMonth,
        ] = await getVolunteerAttendanceByMonth(volunteerId);
        const months = getPast12Months();

        setChartData({
          labels: months,
          datasets: [
            {
              label: "# Volunteering",
              data: volunteerAttendanceCountByMonthVolunteer,
              borderColor: "rgb(255, 99, 132, 0.5)",
              backgroundColor: "rgb(255, 99, 132, 0.5)",
            },
            {
              label: "# Workshops",
              data: volunteerAttendanceCountByMonthWorkshop,
              borderColor: "rgb(75, 192, 192, 0.5)",
              backgroundColor: "rgb(75, 192, 192, 0.5)",
            },
            {
              label: "# Training",
              data: volunteerAttendanceCountByMonthTraining,
              borderColor: "rgb(53, 162, 235, 0.5)",
              backgroundColor: "rgb(53, 162, 235, 0.5)",
            },
            {
              label: "# Total",
              data: volunteerAttendanceCountByMonth,
              borderColor: "rgb(168, 168, 168, 0.5)",
              backgroundColor: "rgb(168, 168, 168, 0.5)",
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
              text: "Number of activities attended in the past 12 months",
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
        <Line data={chartData} options={chartOptions} />
      </div>
    </>
  );
};

export default VolunteerPastYearAttendance;
