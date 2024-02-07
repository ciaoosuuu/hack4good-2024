import districtMap from "./districtMap";
import regionMap from "./regionMap";

const getRegionFromPostal = (postalCode) => {
  console.log(postalCode);
  const firstTwoChar = parseInt(postalCode.substring(0, 2), 10);
  let district = 0;
  let region = "NA";

  if (districtMap.hasOwnProperty(firstTwoChar)) {
    district = districtMap[firstTwoChar];
  }

  if (regionMap.hasOwnProperty(district)) {
    region = regionMap[district];
  }

  return region;
};

export default getRegionFromPostal;
