const Posts = ({ reflections, classes }) => {
  const gridItem = (reflection, index) => (
    <div key={index} className={classes["grid-item"]}>
      {reflection.image && <img src={reflection.image} alt="Reflection" />}
      <h1>{reflection.isanonymous ? "Anonymous" : "Name"}</h1>
      <p>{`${reflection.content.split(" ").slice(0, 60).join(" ")}...`}</p>
    </div>
  );
  return (
    <div>
      <div className={classes["four-column-container"]}>
        {[0, 1, 2, 3].map((columnIndex) => (
          <div key={columnIndex} className={classes["column-four"]}>
            {reflections
              .slice()
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
    </div>
  );
};

export default Posts;
