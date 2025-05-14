"use client";
import React, { useRef, useState, useEffect } from "react";
import { TimeCharts } from "./TimeCharts";
import { ContentAnalysis } from "./ContentAnalysis";
import { EnhancedBarChart } from "./EnhancedBarChart";
import "./print.css";
import toast, { Toaster } from 'react-hot-toast';

interface AnalyzeResult {
  total_messages: number;
  sample: string[];
  most_active: { user: string; count: number };
  most_apology: { user: string; count: number };
  most_love: { user: string; count: number };
  slowest: { user: string; avg_seconds: number };
  user_msg_count: Record<string, number>;
  user_apology_count: Record<string, number>;
  user_love_count: Record<string, number>;
  avg_response: Record<string, number>;
  hourly_activity: Record<string, number>;
  weekday_activity: Record<string, number>;
  month_activity: Record<string, number>;
  top_active_days: Record<string, number>;
  common_words: Record<string, number>;
  emoji_counts: Record<string, number>;
  conversation_starters: Record<string, number>;
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [analyzeResult, setAnalyzeResult] = useState<AnalyzeResult | null>(null);
  const [filename, setFilename] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentYear, setCurrentYear] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setAnalyzeResult(null);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error("Lütfen bir dosya seçin!");
      return;
    }
    
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.filename) {
        setFilename(data.filename);
        toast.success("Dosya başarıyla yüklendi.");
      } else {
        const errorMsg = data.error || "Yükleme sırasında hata oluştu!";
        toast.error(errorMsg);
      }
    } catch (error) {
      console.error("Yükleme hatası:", error);
      const errorMsg = "Bağlantı hatası! Lütfen tekrar deneyin.";
      toast.error(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleAnalyze = async () => {
    setAnalyzeResult(null);
    if (!filename) {
      const errorMsg = "Önce bir dosya yükleyin!";
      toast.error(errorMsg);
      return;
    }
    
    setIsAnalyzing(true);
    
    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filename }),
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (data.error) {
        toast.error(data.error);
      } else {
        setAnalyzeResult(data);
        toast.success("Analiz tamamlandı! Sonuçları inceleyebilirsiniz.");
      }
    } catch (error) {
      console.error("Analiz hatası:", error);
      const errorMsg = "Analiz sırasında hata oluştu! Lütfen tekrar deneyin.";
      toast.error(errorMsg);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center px-4 py-12 screen-only">
      <Toaster position="top-center" toastOptions={{
        duration: 3000,
        style: {
          background: '#333',
          color: '#fff',
        },
        success: {
          iconTheme: {
            primary: '#10B981',
            secondary: '#FFFFFF',
          },
        },
        error: {
          iconTheme: {
            primary: '#EF4444',
            secondary: '#FFFFFF',
          },
        },
      }} />
      <div className="w-full max-w-4xl bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 mt-8">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-2 tracking-tight print-title print:text-black no-print">WhatsApp Sohbet Analiz Aracı</h1>
        <p className="text-center text-gray-300 mb-8 print:text-black print:mb-4 no-print">Sohbet (.txt) dosyanızı yükleyin, analiz edin ve istatistikleri keşfedin.</p>
        <form onSubmit={handleUpload} className="flex flex-col md:flex-row items-center gap-4 mb-4 no-print">
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          <button 
            type="submit" 
            disabled={isUploading}
            className={`px-6 py-2 rounded-lg ${isUploading ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white font-semibold shadow transition flex items-center gap-2`}
          >
            {isUploading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Yükleniyor...
              </>
            ) : "Yükle"}
          </button>
        </form>
        <div className="flex flex-col items-center mt-6 no-print">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !filename}
            className={`px-8 py-2 rounded-lg ${isAnalyzing || !filename ? 'bg-gray-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} text-white font-semibold shadow transition mb-4 flex items-center gap-2`}
          >
            {isAnalyzing ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Analiz Ediliyor...
              </>
            ) : "Sohbeti Analiz Et"}
          </button>
          {analyzeResult && (
            <div
              ref={reportRef}
              className="w-full bg-gray-900 rounded-xl p-6 mt-2 shadow-inner flex flex-col gap-4 print:bg-white print:text-black print-bg-white print:shadow-none"
            >
              {/* YAZDIRILACAK ALAN: Sadece özet ve temel istatistikler + ilk bar chart */}
              <div className="print-section print-only">
                <h3 className="text-xl font-bold text-white mb-2 print-title print:text-black">
                  Toplam Mesaj: <span className="text-indigo-300 print:text-black">{analyzeResult.total_messages}</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 grid-print">
                  <div className="bg-gray-900 rounded-lg p-4 print-bg-white">
                    <h4 className="text-lg font-semibold text-indigo-200 mb-2 print:text-black">En Çok Mesaj Atan</h4>
                    <p className="text-white print:text-black">{analyzeResult.most_active.user} <span className="text-indigo-400 font-bold print:text-black">({analyzeResult.most_active.count})</span></p>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4 print-bg-white">
                    <h4 className="text-lg font-semibold text-pink-200 mb-2 print:text-black">En Çok Özür Dileyen</h4>
                    <p className="text-white print:text-black">{analyzeResult.most_apology.user} <span className="text-pink-400 font-bold print:text-black">({analyzeResult.most_apology.count})</span></p>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4 print-bg-white">
                    <h4 className="text-lg font-semibold text-red-200 mb-2 print:text-black">En Çok Sevgi Gösteren</h4>
                    <p className="text-white print:text-black">{analyzeResult.most_love.user} <span className="text-red-400 font-bold print:text-black">({analyzeResult.most_love.count})</span></p>
                  </div>
                  <div className="bg-gray-900 rounded-lg p-4 print-bg-white">
                    <h4 className="text-lg font-semibold text-yellow-200 mb-2 print:text-black">En Geç Cevap Veren</h4>
                    <p className="text-white print:text-black">{analyzeResult.slowest.user} <span className="text-yellow-400 font-bold print:text-black">({Math.round(analyzeResult.slowest.avg_seconds)} sn)</span></p>
                  </div>
                </div>
                <div className="w-full mt-8 page-break">
                  <EnhancedBarChart
                    data={analyzeResult.user_msg_count}
                    color="indigo"
                    title="Mesaj Dağılımı"
                    description="Sohbetteki toplam mesaj sayısına göre kişilerin dağılımı. Bu grafik, sohbette kimin daha çok konuştuğunu gösterir."
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                      </svg>
                    }
                  />
                </div>
              </div>
              {/* YAZDIRILMAYACAK ALANLAR */}
              <div className="no-print">
                {/* Genişletilmiş İstatistik Kartları - Alt alta düzen */}
                <div className="w-full space-y-8 mt-8">
                  <EnhancedBarChart
                    data={analyzeResult.user_apology_count}
                    color="pink"
                    title="Özür Dağılımı"
                    description="Sohbette özür dileme ifadelerinin kişilere göre dağılımı. 'Özür dilerim', 'kusura bakma', 'pardon' gibi ifadeleri içeren mesajlar sayılmıştır."
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8-3.59 8-8-3.59 8-8 8zm-5-9h10v2H7zm2-5h6v2H9zm0 10h6v2H9z"></path>
                      </svg>
                    }
                  />
                  <EnhancedBarChart
                    data={analyzeResult.user_love_count}
                    color="red"
                    title="Sevgi Dağılımı"
                    description="Sohbette sevgi ifadelerinin kişilere göre dağılımı. 'Seviyorum', 'aşkım', 'canım' gibi sevgi içerikli kelimeler ve kalp emojileri sayılmıştır."
                    icon={
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                      </svg>
                    }
                  />
                </div>
                {/* Zaman Tabanlı Analiz Bölümü */}
                <div className="mt-10 border-t border-gray-700 pt-10">
                  <h2 className="text-2xl font-bold text-white mb-4">Zaman Bazlı Analiz</h2>
                  <p className="text-sm text-gray-400 mb-8">Sohbet aktivitelerinin zaman dağılımlarını gösteren detaylı analiz</p>
                  <TimeCharts
                    hourlyActivity={analyzeResult.hourly_activity}
                    weekdayActivity={analyzeResult.weekday_activity}
                    monthActivity={analyzeResult.month_activity}
                    activedays={analyzeResult.top_active_days}
                  />
                </div>
                {/* İçerik Analiz Bölümü */}
                <div className="mt-10 border-t border-gray-700 pt-10">
                  <h2 className="text-2xl font-bold text-white mb-4">İçerik Analizi</h2>
                  <p className="text-sm text-gray-400 mb-8">Sohbetlerde kullanılan kelimeler, emojiler ve iletişim alışkanlıklarının detaylı analizi</p>
                  <ContentAnalysis
                    commonWords={analyzeResult.common_words}
                    emojiCounts={analyzeResult.emoji_counts}
                    conversationStarters={analyzeResult.conversation_starters}
                  />
                </div>
                {/* PDF Dışa Aktarma ve Yazdırma Butonları */}
                <div className="flex justify-center mt-8 gap-4 no-print">
              
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <footer className="mt-10 text-gray-400 text-xs text-center opacity-70 no-print">
        &copy; {currentYear ?? ''} WhatsApp Analiz. Tüm hakları saklıdır.
      </footer>
    </div>
  );
}
