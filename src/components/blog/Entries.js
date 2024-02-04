const Entries = ({ entries, classes }) => {
  const gridItem = (entry, index) => (
    <div key={index} className={classes["grid-item"]}>
      {entry.image && <img src={entry.image} alt="Reflection" />}
      <h1>{entry.isanonymous ? "Anonymous" : "Name"}</h1>
      <p>{`${entry.content.split(" ").slice(0, 100).join(" ")}...`}</p>
    </div>
  );
  return (
    <div>
      <div className={classes["four-column-container"]}>
        {[0, 1, 2, 3].map((columnIndex) => (
          <div key={columnIndex} className={classes["column-four"]}>
            {entries
              .slice()
              .sort((entryA, entryB) => {
                const postTimeA = entryA.datetime_posted.toDate();
                const postTimeB = entryB.datetime_posted.toDate();
                return postTimeA - postTimeB;
              })
              .map(
                (entry, index) =>
                  index % 4 === columnIndex && gridItem(entry, index)
              )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Entries;
