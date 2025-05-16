// src/hooks/useAge.js
import { useState, useEffect } from "react";
import { calculateAge } from "../utils/ageCalculator";

export const useAge = (birthDate) => {
  const [age, setAge] = useState(() => calculateAge(birthDate));

  useEffect(() => {
    // Update age immediately when birthDate changes
    setAge(calculateAge(birthDate));

    // No need for interval if no birthDate
    if (!birthDate) return;

    // Calculate milliseconds until midnight
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    const msUntilMidnight = tomorrow - now;

    // Set timeout to recalculate age at midnight
    const timeoutId = setTimeout(() => {
      setAge(calculateAge(birthDate));

      // Then set interval for daily updates
      const intervalId = setInterval(() => {
        setAge(calculateAge(birthDate));
      }, 24 * 60 * 60 * 1000); // 24 hours

      return () => clearInterval(intervalId);
    }, msUntilMidnight);

    return () => clearTimeout(timeoutId);
  }, [birthDate]);

  return age;
};
