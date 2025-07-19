import React from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FileText, Sparkles } from 'lucide-react';

const GenerateReportButton = ({ chartRef }) => {
  const handleGenerateReport = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;

    // Clean Header
    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, pageHeight, 'F');
    
    // Header text - simple and clean
    doc.setTextColor(31, 41, 55);
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.text('Dashboard Report', pageWidth/2, 25, { align: 'center' });
    
    // Date
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(107, 114, 128);
    const currentDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    doc.text(currentDate, pageWidth/2, 35, { align: 'center' });

    // Thin separator line
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(20, 45, pageWidth - 20, 45);

    // Clean Metrics Section
    const metrics = [
      { label: 'Customers', value: '30,567', change: '-5%', isPositive: false },
      { label: 'Products', value: '3,037', change: '+18%', isPositive: true },
      { label: 'Sales', value: '₹20,509', change: '+33%', isPositive: true },
      { label: 'Refunds', value: '21,647', change: '-12%', isPositive: false },
    ];

    // Simple grid layout
    const startY = 60;
    const cardWidth = 45;
    const cardHeight = 25;
    const spacing = 2;
    const totalWidth = 4 * cardWidth + 3 * spacing;
    const startX = (pageWidth - totalWidth) / 2;

    metrics.forEach((metric, i) => {
      const x = startX + i * (cardWidth + spacing);
      const y = startY;
      
      // Clean white card with subtle border
      doc.setFillColor(255, 255, 255);
      doc.rect(x, y, cardWidth, cardHeight, 'F');
      doc.setDrawColor(229, 231, 235);
      doc.setLineWidth(0.3);
      doc.rect(x, y, cardWidth, cardHeight, 'S');
      
      // Value - large and prominent
      doc.setFontSize(16);
      doc.setTextColor(17, 24, 39);
      doc.setFont('helvetica', 'bold');
      doc.text(metric.value, x + cardWidth/2, y + 10, { align: 'center' });
      
      // Label - small and subtle
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(107, 114, 128);
      doc.text(metric.label, x + cardWidth/2, y + 16, { align: 'center' });
      
      // Change indicator - clean colored text
      doc.setFontSize(8);
      doc.setTextColor(metric.isPositive ? 34 : 220, metric.isPositive ? 197 : 38, metric.isPositive ? 94 : 38);
      doc.setFont('helvetica', 'bold');
      doc.text(metric.change, x + cardWidth/2, y + 22, { align: 'center' });
    });

    // Key Highlights - minimal design
    const highlightsY = 100;
    
    doc.setFontSize(16);
    doc.setTextColor(31, 41, 55);
    doc.setFont('helvetica', 'bold');
    doc.text('Key Highlights', 20, highlightsY);
    
    // Simple bullet points
    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(55, 65, 81);
    doc.text('• Most Popular Product: Yew Plum Pine (98,000 units sold)', 20, highlightsY + 12);
    doc.text('• Highest Sales Month: March 2024 (310 premium units)', 20, highlightsY + 22);

    // Chart Section - clean and minimal
    const chartY = 140;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(31, 41, 55);
    doc.text('Sales Performance', 20, chartY);

    if (chartRef && chartRef.current) {
      try {
        const chartCanvas = await html2canvas(chartRef.current, { 
          backgroundColor: '#ffffff', 
          scale: 2,
          useCORS: true 
        });
        const imgData = chartCanvas.toDataURL('image/png');
        
        // Clean border around chart
        doc.setDrawColor(229, 231, 235);
        doc.setLineWidth(0.5);
        doc.rect(20, chartY + 8, pageWidth - 40, 70, 'S');
        
        doc.addImage(imgData, 'PNG', 21, chartY + 9, pageWidth - 42, 68);
      } catch (error) {
        console.log('Chart capture failed:', error);
        doc.setFillColor(249, 250, 251);
        doc.rect(20, chartY + 8, pageWidth - 40, 70, 'F');
        doc.setDrawColor(229, 231, 235);
        doc.setLineWidth(0.5);
        doc.rect(20, chartY + 8, pageWidth - 40, 70, 'S');
        
        doc.setFontSize(12);
        doc.setTextColor(156, 163, 175);
        doc.text('Chart will be displayed here', pageWidth/2, chartY + 45, { align: 'center' });
      }
    }

    // Clean Footer
    const footerY = pageHeight - 20;
    
    // Separator line
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.3);
    doc.line(20, footerY - 5, pageWidth - 20, footerY - 5);
    
    // Footer text
    doc.setFontSize(9);
    doc.setTextColor(156, 163, 175);
    doc.setFont('helvetica', 'normal');
    doc.text('Generated by Hamro Godam Dashboard', 20, footerY);
    doc.text(`${new Date().toLocaleTimeString()}`, pageWidth - 20, footerY, { align: 'right' });

    // Save with clean filename
    doc.save('dashboard-report.pdf');
  };

  return (
    <button
      onClick={handleGenerateReport}
      className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      <FileText className="w-4 h-4" />
      Generate Report
    </button>
  );
};

export default GenerateReportButton;