import React from "react";

/**
 * Use:
 * import Locale from "@/lib/Locale"
 *
 * var printable = Locale(kind, value, metric, inlcudeUnits);
 *
 * - kind = temperature, speed (mph)
 * - value = the value to be localized
 * - metric = true for metric
 * - includeUnits = if true, include the units on the returned string (e.g. &deg;C)
 *
 * Value is converted to metric if Config.metric is not false.
 */

const val = n => {
  return parseInt(n * 10) / 10;
};

export default (kind, value, metric, includeUnits) => {
  switch (kind) {
    case "temperature":
    case "temp":
      if (metric) {
        return (
          <>
            {val((value - 32) / 1.8)}
            {includeUnits ? <span>&deg;C</span> : null}
          </>
        );
      } else {
        return (
          <>
            {val(value)}
            {includeUnits ? <span>&deg;F</span> : null}
          </>
        );
      }

    case "speed":
    case "distance":
      if (metric) {
        return (
          <>
            {parseInt(value * 1.609344 * 10, 10) / 10}
            {includeUnits ? <span> KM/H</span> : null}
          </>
        );
      } else {
        return (
          <>
            {value}
            {includeUnits ? <span> MPH</span> : null}
          </>
        );
      }

    default:
      return value;
  }
};

const FtoC = (n, metric) => {
  return metric ? parseInt((10 * (Number(n) - 32)) / 1.8, 10) / 10 : parseInt(n, 10);
};

const CtoF = (n, metric) => {
  return metric ? parseInt((Number(n) * 9) / 5 + 32, 10) : parseInt(n, 10);
};

const MPHtoKPH = (n, metric) => {
  return metric ? parseInt(Number(n) * 1.609344 * 10, 10) / 10 : parseInt(n, 10);
};
const KPHtoMPH = (n, metric) => {
  return metric ? parseInt(Number(n) * 0.6213711922 * 10, 10) / 10 : parseInt(n, 10);
};

//
export { FtoC, CtoF, MPHtoKPH, KPHtoMPH };
