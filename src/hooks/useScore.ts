
import { useState } from "react";

export default function useScore() {

  const [errors, setErrors] = useState(0);

  const [firstErrorTime, setFirstErrorTime] = useState<number | null>(null);

  const [endTime, setEndTime] = useState<number | null>(null);
  function recordError() {
    setErrors((prev) => prev + 1);
    if (!firstErrorTime) {
      setFirstErrorTime(Date.now());
    }
  }

  function finalizeScore() {
    if (!endTime) {
      setEndTime(Date.now());
    }
  }

  function getFinalScore() {
    const baseScore = 1000;
    const penaltyErrors = errors * 20;
    let penaltyTime = 0;

    if (firstErrorTime) {
      const referenceTime = endTime ?? Date.now();
      penaltyTime = Math.floor((referenceTime - firstErrorTime) / 1000);
    }

    const finalScore = baseScore - penaltyErrors - penaltyTime;
    return finalScore < 0 ? 0 : finalScore;
  }

  function getTimePenalty() {
    if (firstErrorTime) {
      const referenceTime = endTime ?? Date.now();
      return Math.floor((referenceTime - firstErrorTime) / 1000);
    }
    return 0;
  }

  return {
    errors,
    recordError,
    finalizeScore,
    getFinalScore,
    getTimePenalty,
  };
}
