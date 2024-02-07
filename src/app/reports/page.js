"use client";

import { useState, useEffect } from "react";

import PastYearActivities from "../../components/reports/PastYearActivities";
import PastYearAttendees from "../../components/reports/PastYearAttendees";
import RegionActivities from "../../components/reports/RegionActivities";
import RegionAttendance from "../../components/reports/RegionAttendance";
import CauseActivities from "../../components/reports/CauseActivities";
import CauseAttendance from "../../components/reports/CauseAttendance";
import PastYearUsers from "../../components/reports/PastYearUsers";

import classes from "./page.module.css";

const Reports = () => {
  const [selectedView, setSelectedView] = useState("Volunteers");
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
      <div className={classes["selection-bar"]}>
        <div
          className={
            selectedView === "Volunteers"
              ? `${classes["option-selected"]}`
              : `${classes["option-unselected"]}`
          }
          onClick={() => setSelectedView("Volunteers")}
        >
          Volunteers
        </div>
        <div
          className={
            selectedView === "Activities"
              ? `${classes["option-selected"]}`
              : `${classes["option-unselected"]}`
          }
          onClick={() => setSelectedView("Activities")}
        >
          Activities
        </div>
      </div>
      {selectedView === "Volunteers" && (
        <div>
          <div style={{ marginTop: "10px", marginBottom: "10px" }}>
            <PastYearUsers />
          </div>
          <div style={{ marginTop: "10px", marginBottom: "10px" }}>
            <PastYearAttendees />
          </div>
          <div style={{ marginTop: "10px", marginBottom: "10px" }}>
            <RegionAttendance />
          </div>
          <div style={{ marginTop: "10px", marginBottom: "10px" }}>
            <CauseAttendance />
          </div>
        </div>
      )}
      {selectedView === "Activities" && (
        <div>
          <div style={{ marginTop: "10px", marginBottom: "10px" }}>
            <PastYearActivities />
          </div>
          <div style={{ marginTop: "10px", marginBottom: "10px" }}>
            <RegionActivities />
          </div>
          <div style={{ marginTop: "10px", marginBottom: "10px" }}>
            <CauseActivities />
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
