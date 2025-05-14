import React from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

type PDFExportButtonProps = {
  contentRef: React.RefObject<HTMLDivElement | null>;
  filename?: string;
};

const PDFExportButton: React.FC<PDFExportButtonProps> = ({ 
  contentRef, 
  filename = 'whatsapp-analiz.pdf'
}) => {
  const [isExporting, setIsExporting] = React.useState(false);
  
  const handleExportPDF = async () => {
    if (!contentRef.current) return;
    
    setIsExporting(true);
    
    try {
      // Analiz içeriğini bir canvas'a dönüştür
      const canvas = await html2canvas(contentRef.current, {
        scale: 2, // Daha yüksek kalite için
        logging: false,
        useCORS: true, // Eğer harici resimler varsa
        backgroundColor: '#1a202c' // Bg dark color
      });
      
      // Canvas'ı PDF'e dönüştür
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Canvas'ın en-boy oranını koru
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      
      // İçeriği PDF'e ekle
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      
      // Eğer içerik birden fazla sayfa gerektiriyorsa
      if (pdfHeight > pdf.internal.pageSize.getHeight()) {
        let heightLeft = pdfHeight;
        let position = 0;
        
        // İlk sayfa zaten eklendi
        heightLeft -= pdf.internal.pageSize.getHeight();
        
        // Kalan içerik için yeni sayfalar ekle
        while (heightLeft > 0) {
          position -= pdf.internal.pageSize.getHeight();
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
          heightLeft -= pdf.internal.pageSize.getHeight();
        }
      }
      
      // PDF'i indir
      pdf.save(filename);
      
    } catch (error) {
      console.error('PDF oluşturma hatası:', error);
      alert('PDF oluşturulurken bir hata oluştu.');
    } finally {
      setIsExporting(false);
    }
  };
  
  return (
    <button 
      onClick={handleExportPDF}
      disabled={isExporting}
      className={`px-6 py-2 cursor-pointer rounded-lg ${isExporting ? 'bg-gray-500 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'} text-white font-semibold shadow transition flex items-center gap-2`}
    >
      {isExporting ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          PDF Oluşturuluyor...
        </>
      ) : (
        <>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <line x1="10" y1="14" x2="14" y2="14"></line>
          </svg>
          PDF İndir
        </>
      )}
    </button>
  );
};

export default PDFExportButton;
