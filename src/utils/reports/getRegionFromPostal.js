import districtMap from "./districtMap";
import regionMap from "./regionMap";

const isNumeric = (str) => {
  const num = Number(str);
  return !isNaN(num) && isFinite(num);
};

const getRegionFromPostal = (postalCode) => {
  console.log(postalCode);
  let district = 0;
  let region = "NA";

  if (postalCode.length !== 6 || !isNumeric(postalCode)) {
    return region;
  }

  const firstTwoChar = parseInt(postalCode.trim().substring(0, 2), 10);

  if (districtMap.hasOwnProperty(firstTwoChar)) {
    district = districtMap[firstTwoChar];
  }

  if (regionMap.hasOwnProperty(district)) {
    region = regionMap[district];
  }

  return region;
};

export default getRegionFromPostal;
