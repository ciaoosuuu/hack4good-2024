const getUserLevel = (userExp) => {
  const levels = [
    0, 20, 50, 90, 140, 200, 270, 350, 440, 540, 650, 770, 900, 1040, 1190,
    1340, 500, 1670, 1850, 2040, 2240,
  ];

  if (userExp <= levels[0]) {
    return 0;
  }

  for (let i = 1; i < levels.length; i++) {
    if (userExp > levels[i - 1] && userExp <= levels[i]) {
      return i - 1;
    }
  }

  return levels.length - 1;
};

export default getUserLevel;
