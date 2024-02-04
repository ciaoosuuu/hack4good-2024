const Attendance = ({
  userRole,
  classes,
  attendees,
  attended,
  handleMark,
  handleSubmit,
}) => {
  if (userRole !== "admin") {
    return null;
  }

  return (
    <div className={classes["container"]}>
      <h1>Attendance</h1>
      <ul className={classes["grid_list"]}>
        {attendees
          .slice()
          .sort((a, b) => a.name.localeCompare(b.name))
          .map((attendee, index) => (
            <li key={attendee.id} className={classes["item"]}>
              <div className={classes["index"]}>
                <p>{index}</p>
              </div>
              <div className={classes["profilepic"]}>
                <img src={attendee.image} alt="Profile" />
              </div>
              <div className={classes["details"]}>
                <h1>{attendee.name}</h1>
                <p>{attendee.email}</p>
                <p>{attendee.contact}</p>
              </div>
              <div className={classes["markattendance"]}>
                {attended.includes(attendee.id) ? (
                  <div className={classes["marked"]}>Marked</div>
                ) : (
                  <button onClick={() => handleMark(attendee.id)}>
                    Mark As Attended
                  </button>
                )}
              </div>
            </li>
          ))}
      </ul>
      <div className={classes["submitattendance"]}>
        <button onClick={handleSubmit}>Submit Attendance</button>
      </div>
    </div>
  );
};

export default Attendance;
