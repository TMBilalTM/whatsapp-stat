import React, { useMemo, useState } from "react";

interface EnhancedBarChartProps {
  data: Record<string, number>;
  color?: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

const COLORS: Record<string, string> = {
  indigo: "bg-indigo-500 hover:bg-indigo-600",
  pink: "bg-pink-400 hover:bg-pink-500",
  red: "bg-red-400 hover:bg-red-500",
  yellow: "bg-yellow-400 hover:bg-yellow-500",
  green: "bg-green-500 hover:bg-green-600",
  purple: "bg-purple-500 hover:bg-purple-600",
  blue: "bg-blue-500 hover:bg-blue-600",
  cyan: "bg-cyan-500 hover:bg-cyan-600",
  orange: "bg-orange-500 hover:bg-orange-600",
};

const TEXT_COLORS: Record<string, string> = {
  indigo: "text-indigo-200",
  pink: "text-pink-200",
  red: "text-red-200",
  yellow: "text-yellow-200",
  green: "text-green-200",
  purple: "text-purple-200",
  blue: "text-blue-200",
  cyan: "text-cyan-200",
  orange: "text-orange-200",
};

const BORDER_COLORS: Record<string, string> = {
  indigo: "border-indigo-500/50",
  pink: "border-pink-400/50",
  red: "border-red-400/50",
  yellow: "border-yellow-400/50",
  green: "border-green-500/50",
  purple: "border-purple-500/50",
  blue: "border-blue-500/50",
  cyan: "border-cyan-500/50",
  orange: "border-orange-500/50",
};

const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

const getAvatarColor = (name: string): string => {
  const colors = [
    "bg-blue-500", "bg-green-500", "bg-yellow-500", 
    "bg-red-500", "bg-purple-500", "bg-pink-500", 
    "bg-indigo-500", "bg-orange-500", "bg-cyan-500",
    "bg-teal-500", "bg-lime-500", "bg-emerald-500"
  ];
  
  // Use the first characters of the name to determine a consistent color
  const charSum = name
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);
  
  return colors[charSum % colors.length];
};

export const EnhancedBarChart: React.FC<EnhancedBarChartProps> = ({ 
  data, 
  color = "indigo", 
  title,
  description,
  icon
}) => {
  const [hoveredUser, setHoveredUser] = useState<string | null>(null);
  
  // Calculate total, max values and percentages
  const total = useMemo(() => Object.values(data).reduce((sum, val) => sum + val, 0), [data]);
  const max = useMemo(() => Math.max(...Object.values(data), 1), [data]);
  
  // Sort the data by values in descending order
  const sortedEntries = useMemo(() => {
    return Object.entries(data)
      .sort((a, b) => b[1] - a[1]);
  }, [data]);
  
  return (
    <div className={`bg-gray-900 rounded-lg p-8 border ${BORDER_COLORS[color]} border-opacity-30 shadow-lg`}>
      <div className="flex items-center gap-4 mb-6">
        {icon && <span className={`text-2xl ${TEXT_COLORS[color]}`}>{icon}</span>}
        <div>
          <h3 className={`text-xl font-bold ${TEXT_COLORS[color]}`}>
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-400 mt-1">{description}</p>
          )}
        </div>
      </div>
      
      <div className="w-full flex flex-col gap-5 mt-6">
        {sortedEntries.map(([user, value]) => {
          const percentage = total > 0 ? Math.round((value / total) * 100) : 0;
          const isHovered = hoveredUser === user;
          
          return (
            <div 
              key={user} 
              className={`flex items-center gap-4 p-3 rounded-lg transition-all duration-300 ${isHovered ? 'bg-gray-800' : ''}`}
              onMouseEnter={() => setHoveredUser(user)}
              onMouseLeave={() => setHoveredUser(null)}
            >
              <div className={`flex-shrink-0 w-12 h-12 rounded-full ${getAvatarColor(user)} flex items-center justify-center text-white font-medium text-sm shadow-md`}>
                {getInitials(user)}
              </div>
              
              <div className="flex-grow">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-base font-medium text-gray-200 truncate max-w-[180px] md:max-w-[300px]">{user}</span>
                  <div className="flex items-center gap-3">
                    <span className={`text-base ${TEXT_COLORS[color]} font-semibold`}>{value}</span>
                    <span className="text-sm text-gray-400">({percentage}%)</span>
                  </div>
                </div>
                
                <div className="flex-1 h-5 rounded-full bg-gray-700 overflow-hidden">
                  <div
                    className={`h-5 rounded-full transition-all duration-300 ${COLORS[color]}`}
                    style={{ width: `${(value / max) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {total === 0 && (
        <div className="text-center py-8 text-gray-400 text-base">
          Bu kategoride veri bulunmuyor
        </div>
      )}
      
      {total > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-700 flex justify-between items-center">
          <span className="text-sm text-gray-400">Toplam</span>
          <span className="text-sm font-medium text-gray-300">{total}</span>
        </div>
      )}
    </div>
  );
};
