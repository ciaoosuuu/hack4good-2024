"use client";

import { useState, useEffect } from "react";

import PastYearActivities from "../../components/reports/PastYearActivities";
import PastYearAttendees from "../../components/reports/PastYearAttendees";
import RegionActivities from "../../components/reports/RegionActivities";
import RegionAttendance from "../../components/reports/RegionAttendance";
import CauseActivities from "../../components/reports/CauseActivities";
import CauseAttendance from "../../components/reports/CauseAttendance";
import TypeActivities from "../../components/reports/TypeActivities";
import TypeAttendance from "../../components/reports/TypeAttendance";
import PastYearUsers from "../../components/reports/PastYearUsers";

import classes from "./page.module.css";

const Reports = () => {
  const [selectedView, setSelectedView] = useState("Volunteers");
  const chartStyleLeft = {
    marginTop: "10px",
    marginBottom: "10px",
    marginRight: "10px",
    padding: "10px",
    backgroundColor: "white",
    borderRadius: "10px",
  };

  const chartStyleRight = {
    marginTop: "10px",
    marginBottom: "10px",
    padding: "10px",
    backgroundColor: "white",
    borderRadius: "10px",
  };

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
        <div style={{ display: "flex" }}>
          <div style={{ flex: "70%" }}>
            <div style={chartStyleLeft}>
              <PastYearUsers />
            </div>
            <div style={chartStyleLeft}>
              <PastYearAttendees />
            </div>
            <div style={chartStyleLeft}>
              <CauseAttendance />
            </div>
          </div>
          <div style={{ flex: "30%" }}>
            <div
              style={{
                marginTop: "10px",
                marginBottom: "10px",
                padding: "10px",
                backgroundColor: "white",
                borderRadius: "10px",
                height: "140px",
              }}
            ></div>
            <div style={chartStyleRight}>
              <RegionAttendance />
              {/* change this to languages spoke demographic */}
            </div>
            <div style={chartStyleRight}>
              <RegionAttendance />
            </div>
            <div style={chartStyleRight}>
              <TypeAttendance />
            </div>
          </div>
        </div>
      )}
      {selectedView === "Activities" && (
        <div style={{ display: "flex" }}>
          <div style={{ flex: "70%" }}>
            <div style={chartStyleLeft}>
              <PastYearActivities />
            </div>
            <div style={chartStyleLeft}>
              <CauseActivities />
            </div>
          </div>
          <div style={{ flex: "30%" }}>
            <div
              style={{
                marginTop: "10px",
                marginBottom: "10px",
                padding: "10px",
                backgroundColor: "white",
                borderRadius: "10px",
                height: "110px",
              }}
            ></div>
            <div style={chartStyleRight}>
              <RegionActivities />
            </div>
            <div style={chartStyleRight}>
              <TypeActivities />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;
