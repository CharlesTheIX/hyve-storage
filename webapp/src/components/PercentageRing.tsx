"use client";
import { colors } from "@/globals";
import { useEffect, useState } from "react";

type Props = {
  size_rem: number;
  percentage?: number;
};

const PercentageRing: React.FC<Props> = (props: Props) => {
  const { percentage = 0, size_rem } = props;
  const [targetPercentage, setTargetPercentage] = useState<number>(0);

  useEffect(() => {
    var current: number = 0;
    const interval = setInterval(() => {
      if (current > percentage) return clearInterval(interval);
      setTargetPercentage(current);
      current++;
    }, 5);

    return () => clearInterval(interval);
  }, []);
  return (
    <div
      className="percentage-ring-container"
      style={{
        height: `${size_rem}rem`,
        width: `${size_rem}rem`,
      }}
    >
      <div
        className="percentage-ring"
        style={{
          background: `conic-gradient(${colors.blue} 0% ${targetPercentage}%, ${colors.grey} ${targetPercentage}% 100%)`,
        }}
      />
    </div>
  );
};

export default PercentageRing;
