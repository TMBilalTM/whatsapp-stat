import React from "react";

interface BarChartProps {
  data: Record<string, number>;
  color?: string;
}

const COLORS: Record<string, string> = {
  indigo: "bg-indigo-500",
  pink: "bg-pink-400",
  red: "bg-red-400",
  yellow: "bg-yellow-400",
  green: "bg-green-500",
  purple: "bg-purple-500",
  blue: "bg-blue-500",
  cyan: "bg-cyan-500",
  orange: "bg-orange-500",
};

export const BarChart: React.FC<BarChartProps> = ({ data, color = "indigo" }) => {
  const max = Math.max(...Object.values(data), 1);
  return (
    <div className="w-full flex flex-col gap-2">
      {Object.entries(data).map(([user, value]) => (
        <div key={user} className="flex items-center gap-2">
          <span className="w-24 truncate text-xs text-gray-200">{user}</span>
          <div className="flex-1 h-4 rounded bg-gray-700">
            <div
              className={`h-4 rounded-l ${COLORS[color] || COLORS.indigo}`}
              style={{ width: `${(value / max) * 100}%` }}
            ></div>
          </div>
          <span className="ml-2 text-xs text-white font-bold">{value}</span>
        </div>
      ))}
    </div>
  );
};
