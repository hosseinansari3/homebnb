//import countries from "world-countries";
import { cities } from "../utils/cities";

const dmsToDd = (value: string) => {
  // Use the regular expression to extract values
  const dmsRegex = /(\d+)\s*°\s*(\d+)'\s*([\d.]+)/;

  const match = value.match(dmsRegex);

  if (match) {
    // Extract degrees, minutes, and seconds
    const degrees = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const seconds = parseFloat(match[3]);

    const ddValue = degrees + minutes / 60 + seconds / 3600;

    return `${ddValue}`;
  } else {
    console.log("Invalid DMS format.");
  }
};

const formattedCountries = cities.map((city: any) => ({
  label: city.city,
  latlng: [dmsToDd(city.latitude), dmsToDd(city.longitude)],
  region: city.province,
}));

const useCountries = () => {
  const getAll = () => formattedCountries;

  const getByLabel = (value: string) => {
    return formattedCountries.find((item: any) => item.label === value);
  };

  return {
    getAll,
    getByLabel,
  };
};

export default useCountries;
