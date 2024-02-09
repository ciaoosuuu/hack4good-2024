import districtMap from "./districtMap";
import regionMap from "./regionMap";

const getRegionFromPostal = (postalCode) => {
  console.log(postalCode);
  let firstTwoChar = "";
  if (
    postalCode.trim().charAt(0) === "S" ||
    postalCode.trim().charAt(0) === "s"
  ) {
    firstTwoChar = parseInt(postalCode.trim().substring(1, 3), 10);
  } else {
    firstTwoChar = parseInt(postalCode.trim().substring(0, 2), 10);
  }
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
