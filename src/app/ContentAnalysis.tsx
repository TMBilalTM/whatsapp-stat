import React from "react";
import { BarChart } from "./BarChart";

interface ContentAnalysisProps {
  commonWords: Record<string, number>;
  emojiCounts: Record<string, number>;
  conversationStarters: Record<string, number>;
}

const wordIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    <path d="M8 7h2"></path>
    <path d="M8 12h2"></path>
    <path d="M14 7h2"></path>
    <path d="M14 12h2"></path>
  </svg>
);

const emojiIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <path d="M8 14s1.5 2 4 2 4-2 4-2"></path>
    <line x1="9" y1="9" x2="9.01" y2="9"></line>
    <line x1="15" y1="9" x2="15.01" y2="9"></line>
  </svg>
);

const chatIcon = (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z"></path>
    <path d="M9 10h.01"></path>
    <path d="M13 10h.01"></path>
    <path d="M17 10h.01"></path>
  </svg>
);

export const ContentAnalysis: React.FC<ContentAnalysisProps> = ({
  commonWords,
  emojiCounts,
  conversationStarters,
}) => {
  // En çok kullanılan kelime bulma
  const topWord = Object.entries(commonWords).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
  
  // En çok kullanılan emoji bulma
  const topEmoji = Object.entries(emojiCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
  
  // En çok konuşma başlatan kişi
  const topStarter = Object.entries(conversationStarters).sort((a, b) => b[1] - a[1])[0]?.[0] || "N/A";
  
  return (
    <div className="flex flex-col gap-10">
      {/* Özet Bilgiler */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-gray-800/50 rounded-lg p-5 border border-pink-500/20 shadow-lg flex items-start gap-3">
          <div className="p-3 bg-pink-900/30 rounded-lg text-pink-200">
            {wordIcon}
          </div>
          <div>
            <h4 className="text-sm text-pink-200 opacity-80">En Çok Kullanılan Kelime</h4>
            <p className="text-2xl font-bold text-white mt-1">{topWord}</p>
          </div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-5 border border-cyan-500/20 shadow-lg flex items-start gap-3">
          <div className="p-3 bg-cyan-900/30 rounded-lg text-cyan-200">
            {emojiIcon}
          </div>
          <div>
            <h4 className="text-sm text-cyan-200 opacity-80">En Çok Kullanılan Emoji</h4>
            <p className="text-2xl font-bold text-white mt-1">{topEmoji}</p>
          </div>
        </div>
        
        <div className="bg-gray-800/50 rounded-lg p-5 border border-orange-500/20 shadow-lg flex items-start gap-3">
          <div className="p-3 bg-orange-900/30 rounded-lg text-orange-200">
            {chatIcon}
          </div>
          <div>
            <h4 className="text-sm text-orange-200 opacity-80">En Çok Konuşma Başlatan</h4>
            <p className="text-xl font-bold text-white mt-1">{topStarter}</p>
          </div>
        </div>
      </div>
      
      {/* Detaylı Grafikler */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-gray-900 rounded-lg p-8 shadow-lg border border-pink-500/20">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xl text-pink-200">{wordIcon}</span>
            <div>
              <h3 className="text-xl font-bold text-pink-200">
                En Sık Kullanılan Kelimeler
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                Sohbetlerde en çok tekrar eden kelimeler
              </p>
            </div>
          </div>
          <BarChart data={commonWords} color="pink" />
        </div>

        <div className="bg-gray-900 rounded-lg p-8 shadow-lg border border-orange-500/20">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xl text-orange-200">{chatIcon}</span>
            <div>
              <h3 className="text-xl font-bold text-orange-200">
                Konuşma Başlatanlar
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                3 saatten uzun sessizlik sonrası ilk mesajı yazanlar
              </p>
            </div>
          </div>
          <BarChart data={conversationStarters} color="orange" />
        </div>
      </div>
      
      {/* Emoji Bölümü - Tüm genişlikte */}
      <div className="bg-gray-900 rounded-lg p-8 shadow-lg border border-cyan-500/20">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-xl text-cyan-200">{emojiIcon}</span>
          <div>
            <h3 className="text-xl font-bold text-cyan-200">
              Emoji Kullanımı
            </h3>
            <p className="text-sm text-gray-400 mt-1">
              Sohbetlerde en çok kullanılan emojiler
            </p>
          </div>
        </div>
          
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-8 gap-4 mt-6">
          {Object.entries(emojiCounts)
            .sort((a, b) => b[1] - a[1])
            .map(([emoji, count], index) => (
              <div 
                key={emoji} 
                className="flex flex-col items-center justify-center bg-gray-800/80 p-4 rounded-xl shadow-md border border-cyan-900/30 transition-all hover:scale-105 hover:border-cyan-500/40"
              >
                <span className="text-4xl mb-3">{emoji}</span>
                <span className="text-xl font-bold text-cyan-100">{count}</span>
                <span className="text-xs text-gray-400 mt-1">#{index + 1}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
