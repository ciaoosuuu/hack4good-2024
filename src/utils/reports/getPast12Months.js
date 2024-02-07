const getPast12Months = () => {
  const monthsArray = [];
  const currentDate = new Date();

  for (let i = 11; i >= 0; i--) {
    const date = new Date(currentDate);
    date.setMonth(currentDate.getMonth() - i);

    const monthName = new Intl.DateTimeFormat("en-US", {
      month: "short",
    }).format(date);
    const year = date.getFullYear();

    const formattedMonth = `${monthName} ${year}`;
    monthsArray.push(formattedMonth);
  }

  console.log(monthsArray);
  return monthsArray;
};

export default getPast12Months;
