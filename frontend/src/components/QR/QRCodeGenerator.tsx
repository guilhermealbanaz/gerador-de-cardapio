import React from 'react';
import QRCode from 'qrcode.react';
import { saveAs } from 'file-saver';

interface QRCodeGeneratorProps {
  menuId: string;
  restaurantLogo?: string;
  restaurantName: string;
}

export const QRCodeGenerator: React.FC<QRCodeGeneratorProps> = ({
  menuId,
  restaurantLogo,
  restaurantName,
}) => {
  const menuUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/menu/${menuId}`;

  const downloadQRCode = () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (canvas) {
      canvas.toBlob((blob) => {
        if (blob) {
          saveAs(blob, `${restaurantName}-menu-qr.png`);
        }
      });
    }
  };

  const downloadQRCodePDF = async () => {
    try {
      const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
      if (!canvas) return;

      const { jsPDF } = await import('jspdf');
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Add restaurant name as title
      doc.setFontSize(20);
      doc.text(restaurantName, 105, 20, { align: 'center' });

      // Add QR code
      const imageData = canvas.toDataURL('image/png');
      doc.addImage(imageData, 'PNG', 65, 40, 80, 80);

      // Add menu URL below QR code
      doc.setFontSize(12);
      doc.text('Scan to view our menu:', 105, 130, { align: 'center' });
      doc.setTextColor(0, 0, 255);
      doc.text(menuUrl, 105, 140, { align: 'center' });

      doc.save(`${restaurantName}-menu-qr.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Menu QR Code
      </h2>
      
      <div className="bg-white p-4 rounded-lg shadow-sm">
        <QRCode
          id="qr-code"
          value={menuUrl}
          size={200}
          level="H"
          imageSettings={
            restaurantLogo
              ? {
                  src: restaurantLogo,
                  height: 40,
                  width: 40,
                  excavate: true,
                }
              : undefined
          }
        />
      </div>

      <div className="flex flex-col space-y-2 w-full max-w-xs">
        <button
          onClick={downloadQRCode}
          className="btn-primary flex items-center justify-center"
        >
          Download PNG
        </button>
        <button
          onClick={downloadQRCodePDF}
          className="btn-secondary flex items-center justify-center"
        >
          Download PDF
        </button>
      </div>

      <div className="text-sm text-gray-500 dark:text-gray-400">
        <p>Scan this code to view the digital menu</p>
        <p className="mt-1">
          Or visit:{' '}
          <a
            href={menuUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-500"
          >
            {menuUrl}
          </a>
        </p>
      </div>
    </div>
  );
};
