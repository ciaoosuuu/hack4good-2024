"use client";

import { useState } from "react";

const Posts = ({ reflections, classes }) => {
  const [selectedView, setSelectedView] = useState("reflection");

  const gridItem = (reflection, index) => (
    <div key={index} className={classes["grid-item"]}>
      {reflection.image && <img src={reflection.image} alt="Reflection" />}
      <h1>{reflection.isanonymous ? "Anonymous" : "Name"}</h1>
      <p>{`${reflection.content.split(" ").slice(0, 60).join(" ")}...`}</p>
    </div>
  );

  return (
    <div>
      <div className={classes["selection-bar"]}>
        <div
          className={
            selectedView === "reflection"
              ? `${classes["option-selected"]}`
              : `${classes["option-unselected"]}`
          }
          onClick={() => setSelectedView("reflection")}
        >
          Reflections
        </div>
        <div
          className={
            selectedView === "feedback"
              ? `${classes["option-selected"]}`
              : `${classes["option-unselected"]}`
          }
          onClick={() => setSelectedView("feedback")}
        >
          Feedback
        </div>
      </div>
      {selectedView === "reflection" && (
        <div className={classes["four-column-container"]}>
          {[0, 1, 2, 3].map((columnIndex) => (
            <div key={columnIndex} className={classes["column-four"]}>
              {reflections
                .slice()
                .filter((post) => post.type === "Reflection")
                .sort((reflectionA, reflectionB) => {
                  const postTimeA = reflectionA.datetime_posted.toDate();
                  const postTimeB = reflectionB.datetime_posted.toDate();
                  return postTimeA - postTimeB;
                })
                .map(
                  (reflection, index) =>
                    index % 4 === columnIndex && gridItem(reflection, index)
                )}
            </div>
          ))}
        </div>
      )}
      {selectedView === "feedback" && (
        <div className={classes["four-column-container"]}>
          {[0, 1, 2, 3].map((columnIndex) => (
            <div key={columnIndex} className={classes["column-four"]}>
              {reflections
                .slice()
                .filter((post) => post.type === "feedback")
                .sort((reflectionA, reflectionB) => {
                  const postTimeA = reflectionA.datetime_posted.toDate();
                  const postTimeB = reflectionB.datetime_posted.toDate();
                  return postTimeA - postTimeB;
                })
                .map(
                  (reflection, index) =>
                    index % 4 === columnIndex && gridItem(reflection, index)
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Posts;
