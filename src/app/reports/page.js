"use client";

import PastYearActivities from "../../components/reports/PastYearActivities";
import PastYearAttendees from "../../components/reports/PastYearAttendees";
import RegionActivities from "../../components/reports/RegionActivities";
import RegionAttendance from "../../components/reports/RegionAttendance";

const Reports = () => {
  return (
    <div
      style={{
        marginLeft: "10%",
        marginRight: "10%",
        marginTop: "2%",
        marginBottom: "2%",
      }}
    >
      <b>Reports</b>
      <div style={{ marginTop: "10px", marginBottom: "10px" }}>
        <PastYearActivities />
      </div>
      <div style={{ marginTop: "10px", marginBottom: "10px" }}>
        <PastYearAttendees />
      </div>
      <div style={{ marginTop: "10px", marginBottom: "10px" }}>
        <RegionActivities />
      </div>
      <div style={{ marginTop: "10px", marginBottom: "10px" }}>
        <RegionAttendance />
      </div>
    </div>
  );
};

export default Reports;
