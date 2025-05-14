import React from "react";
import { BarChart } from "./BarChart";

interface TimeChartsProps {
  hourlyActivity: Record<string, number>;
  weekdayActivity: Record<string, number>;
  monthActivity: Record<string, number>;
  activedays: Record<string, number>;
}

const timeIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <polyline points="12 6 12 12 16 14"></polyline>
  </svg>
);

const calendarIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const monthIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="3" y1="10" x2="21" y2="10"></line>
    <line x1="10" y1="3" x2="10" y2="21"></line>
  </svg>
);

const fireIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3s.5-1.5 1-2.5c.5-1 1.21-1.45 1-2.5c2.5 1 3.5 2.5 3.5 4.5c0 2-1.5 3-1.5 5c0 1 .5 1.5 1 2c.5.5 1 1.5 1 2.5c0 1.5-1.5 3-3.5 3c-1.5 0-2.5-.5-3-1c-.5-.5-1.5-2-1.5-2.5c-.5 0-1-.5-1-1.5c0-.5.5-1 1-1.5a2.5 2.5 0 0 0 0-4"></path>
  </svg>
);

export const TimeCharts: React.FC<TimeChartsProps> = ({
  hourlyActivity,
  weekdayActivity,
  monthActivity,
  activedays,
}) => {
  // Saatlik aktivite verilerini sırala
  const sortedHourlyActivity = Object.fromEntries(
    Object.entries(hourlyActivity).sort((a, b) => {
      const hourA = parseInt(a[0].split(':')[0]);
      const hourB = parseInt(b[0].split(':')[0]);
      return hourA - hourB;
    })
  );
  
  // Günlük aktivite verileri
  const orderedWeekdays = {
    "Pazartesi": weekdayActivity["Pazartesi"] || 0,
    "Salı": weekdayActivity["Salı"] || 0,
    "Çarşamba": weekdayActivity["Çarşamba"] || 0,
    "Perşembe": weekdayActivity["Perşembe"] || 0,
    "Cuma": weekdayActivity["Cuma"] || 0,
    "Cumartesi": weekdayActivity["Cumartesi"] || 0,
    "Pazar": weekdayActivity["Pazar"] || 0
  };
  
  // Ayların doğru sırada olması için
  const orderedMonths = {
    "Ocak": monthActivity["Ocak"] || 0,
    "Şubat": monthActivity["Şubat"] || 0,
    "Mart": monthActivity["Mart"] || 0,
    "Nisan": monthActivity["Nisan"] || 0,
    "Mayıs": monthActivity["Mayıs"] || 0,
    "Haziran": monthActivity["Haziran"] || 0,
    "Temmuz": monthActivity["Temmuz"] || 0,
    "Ağustos": monthActivity["Ağustos"] || 0,
    "Eylül": monthActivity["Eylül"] || 0,
    "Ekim": monthActivity["Ekim"] || 0,
    "Kasım": monthActivity["Kasım"] || 0,
    "Aralık": monthActivity["Aralık"] || 0
  };

  // En aktif saati bulma
  const mostActiveHour = Object.entries(hourlyActivity)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
  
  // En aktif günü bulma
  const mostActiveDay = Object.entries(weekdayActivity)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
  
  // En aktif ayı bulma
  const mostActiveMonth = Object.entries(monthActivity)
    .sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
  
  return (
    <div className="flex flex-col gap-10">
      {/* Özet Bilgiler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gray-800/50 rounded-lg p-5 border border-blue-500/20 shadow-lg flex items-start gap-3">
          <div className="p-3 bg-blue-900/30 rounded-lg text-blue-200">
            {timeIcon}
          </div>
          <div>
            <h4 className="text-sm text-blue-200 opacity-80">En Aktif Saat</h4>
            <p className="text-2xl font-bold text-white mt-1">{mostActiveHour}</p>
          </div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-5 border border-green-500/20 shadow-lg flex items-start gap-3">
          <div className="p-3 bg-green-900/30 rounded-lg text-green-200">
            {calendarIcon}
          </div>
          <div>
            <h4 className="text-sm text-green-200 opacity-80">En Aktif Gün</h4>
            <p className="text-2xl font-bold text-white mt-1">{mostActiveDay}</p>
          </div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-5 border border-yellow-500/20 shadow-lg flex items-start gap-3">
          <div className="p-3 bg-yellow-900/30 rounded-lg text-yellow-200">
            {monthIcon}
          </div>
          <div>
            <h4 className="text-sm text-yellow-200 opacity-80">En Aktif Ay</h4>
            <p className="text-2xl font-bold text-white mt-1">{mostActiveMonth}</p>
          </div>
        </div>
      </div>
      
      {/* Detaylı Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-900 rounded-lg p-8 shadow-lg border border-blue-500/20">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xl text-blue-200">{timeIcon}</span>
            <div>
              <h3 className="text-xl font-bold text-blue-200">
                Saatlik Aktivite
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Günün hangi saatlerinde daha çok mesajlaşıyorsunuz?
              </p>
            </div>
          </div>
          
          <BarChart data={sortedHourlyActivity} color="blue" />
        </div>
        
        <div className="bg-gray-900 rounded-lg p-8 shadow-lg border border-green-500/20">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xl text-green-200">{calendarIcon}</span>
            <div>
              <h3 className="text-xl font-bold text-green-200">
                Günlük Aktivite
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Haftanın hangi günlerinde daha aktifsiniz?
              </p>
            </div>
          </div>
          
          <BarChart data={orderedWeekdays} color="green" />
        </div>
        
        <div className="bg-gray-900 rounded-lg p-8 shadow-lg border border-yellow-500/20">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xl text-yellow-200">{monthIcon}</span>
            <div>
              <h3 className="text-xl font-bold text-yellow-200">
                Aylık Aktivite
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Yılın hangi aylarında daha çok iletişimdesiniz?
              </p>
            </div>
          </div>
          
          <BarChart data={orderedMonths} color="yellow" />
        </div>
        
        <div className="bg-gray-900 rounded-lg p-8 shadow-lg border border-purple-500/20">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xl text-purple-200">{fireIcon}</span>
            <div>
              <h3 className="text-xl font-bold text-purple-200">
                En Aktif 10 Gün
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                En çok mesajlaştığınız özel günler
              </p>
            </div>
          </div>
          
          <BarChart data={activedays} color="purple" />
        </div>
      </div>
    </div>
  );
};
