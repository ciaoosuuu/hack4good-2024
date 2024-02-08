"use client";

import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import withAuth from "../../hoc/withAuth";
import getUserLevel from "../../utils/gamify/getUserLevel";
import badges from "../../utils/gamify/badges";

const Heroes = () => {
  const [topUsers, setTopUsers] = useState([]);

  useEffect(() => {
    const fetchTopUsers = async () => {
      try {
        const usersSnapshot = await db.collection("Users").get();

        const topUsersData = usersSnapshot.docs.map((doc) => doc.data());

        setTopUsers(topUsersData);

        console.log(topUsersData);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    fetchTopUsers();
  }, []);

  return (
    <div
      style={{
        marginLeft: "10%",
        marginRight: "10%",
        marginTop: "2%",
        marginBottom: "2%",
      }}
    >
      <h1 style={{ fontSize: "30px" }}>Heroes</h1>
      <div style={{ display: "flex" }}>
        <div style={{ flex: "7%", display: "flex", justifyContent: "center" }}>
          Index
        </div>
        <div style={{ flex: "23%" }}>Name</div>
        <div style={{ flex: "5%", display: "flex", justifyContent: "center" }}>
          Exp
        </div>
        <div style={{ flex: "10%", display: "flex", justifyContent: "center" }}>
          Level
        </div>
        <div style={{ flex: "55%" }}>Badges</div>
      </div>
      <div>
        {topUsers
          .filter((user) => user.role === "volunteer")
          .sort((userA, userB) => {
            const expA = userA.exp_points;
            const expB = userB.exp_points;
            return expB - expA;
          })
          .slice(0, 10)
          .map((user, index) => (
            <div
              key={user.uid}
              style={{
                display: "flex",
                height: "80px",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "white",
                marginBottom: "10px",
                borderRadius: "10px",
              }}
            >
              <div
                style={{
                  flex: "7%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                {index + 1}
              </div>
              <div style={{ flex: "23%" }}>
                <p>{user.name}</p>
              </div>
              <div
                style={{
                  flex: "5%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <p>{user.exp_points}</p>
              </div>
              <div
                style={{
                  flex: "10%",
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <p>{getUserLevel(user.exp_points)}</p>
              </div>
              <div style={{ flex: "55%", display: "flex" }}>
                {badges
                  .slice(
                    0,
                    getUserLevel(user.exp_points) > 10
                      ? 10
                      : getUserLevel(user.exp_points)
                  )
                  .reverse()
                  .map((badge) => (
                    <img
                      src={badge}
                      style={{
                        height: "50px",
                        width: "50px",
                        marginRight: "10px",
                        borderRadius: "50%",
                      }}
                    />
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default withAuth(Heroes);
