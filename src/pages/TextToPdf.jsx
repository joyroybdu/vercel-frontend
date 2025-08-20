import { useState } from 'react';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export default function TextToPdf() {
  const [text, setText] = useState('');
  const [filename, setFilename] = useState('document');
  const [loading, setLoading] = useState(false);

  const generatePdf = async () => {
    if (!text.trim()) return;
    
    setLoading(true);
    
    try {
      // Create a new PDF document
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([595, 842]); // A4 size: 595x842 points
      
      // Embed the Times Roman font
      const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
      
      // Get the width and height of the page
      const { width, height } = page.getSize();
      
      // Draw the text
      const fontSize = 12;
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      
      page.drawText(text, {
        x: 50,
        y: height - 50,
        size: fontSize,
        font: font,
        color: rgb(0, 0, 0),
        maxWidth: width - 100,
        lineHeight: fontSize * 1.2,
      });
      
      // Serialize the PDFDocument to bytes
      const pdfBytes = await pdfDoc.save();
      
      // Create a blob and download link
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${filename}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Error generating PDF. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
        <h2>Text to PDF Converter</h2>
        <p>Convert your text content to a downloadable PDF file - no authentication required!</p>
        
        <div className="form">
          <div>
            <label className="label">Filename (without .pdf extension)</label>
            <input
              type="text"
              className="input"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="document"
            />
          </div>
          
          <div>
            <label className="label">Text Content</label>
            <textarea
              className="input"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your text here..."
              rows="10"
              style={{ resize: 'vertical', minHeight: '200px' }}
            />
          </div>
          
          <button 
            className="btn" 
            onClick={generatePdf}
            disabled={loading || !text.trim()}
          >
            {loading ? 'Generating PDF...' : 'Generate PDF'}
          </button>
        </div>
        
        <div className="converter-info mt-3">
          <h3>About This Converter</h3>
          <p>This tool converts plain text to PDF format directly in your browser. Your data never leaves your computer, ensuring complete privacy.</p>
          
          <div className="converter-features">
            <div className="feature-card">
              <h4>🔒 Secure</h4>
              <p>No server processing - all conversion happens locally</p>
            </div>
            <div className="feature-card">
              <h4>⚡ Fast</h4>
              <p>Instant conversion without network delays</p>
            </div>
            <div className="feature-card">
              <h4>📄 Standard PDF</h4>
              <p>Generates standard PDF files compatible with all viewers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}