import React, { useState, useRef } from 'react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, ImageRun } from 'docx';
import { saveAs } from 'file-saver';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import '../css/TextToWord.css'; // Assuming you have a CSS file for styling

const TextToWord = () => {
  // State for text content and formatting options
  const [content, setContent] = useState('');
  const [fontStyle, setFontStyle] = useState('Arial');
  const [fontSize, setFontSize] = useState(16);
  const [fontColor, setFontColor] = useState('#000000');
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [keyPoints, setKeyPoints] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  // Ref for capturing content for PDF export
  const contentRef = useRef(null);

  // Font options (more than 20 as requested)
  const fontOptions = [
    'Arial', 'Verdana', 'Helvetica', 'Tahoma', 'Trebuchet MS', 
    'Times New Roman', 'Georgia', 'Garamond', 'Courier New', 
    'Brush Script MT', 'Comic Sans MS', 'Impact', 'Lucida Console',
    'Palatino', 'Gill Sans', 'Cambria', 'Calibri', 'Optima',
    'Futura', 'Baskerville', 'Franklin Gothic', 'Century Gothic',
    'Candara', 'Corbel', 'Segoe UI', 'Constantia', 'Perpetua'
  ];

  // Handle text input change
  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Add key point
  const addKeyPoint = () => {
    if (content.trim()) {
      setKeyPoints([...keyPoints, content]);
      setContent('');
    }
  };

  // Remove key point
  const removeKeyPoint = (index) => {
    const updatedKeyPoints = [...keyPoints];
    updatedKeyPoints.splice(index, 1);
    setKeyPoints(updatedKeyPoints);
  };

  // Export as DOCX
  const exportToDocx = async () => {
    // Create paragraphs for key points
    const keyPointParagraphs = keyPoints.map(point => 
      new Paragraph({
        children: [
          new TextRun({
            text: "• " + point,
            bold: isBold,
            italics: isItalic,
            color: fontColor,
            size: fontSize * 2, // docx uses half-points
            font: fontStyle,
            underline: isUnderline ? {} : undefined
          })
        ]
      })
    );

    // Create main content paragraph
    const contentParagraph = new Paragraph({
      children: [
        new TextRun({
          text: content,
          bold: isBold,
          italics: isItalic,
          color: fontColor,
          size: fontSize * 2,
          font: fontStyle,
          underline: isUnderline ? {} : undefined
        })
      ]
    });

    // Prepare image data if available
    let imageBuffer = null;
    if (image) {
      imageBuffer = await image.arrayBuffer();
    }

    // Create document
    const doc = new Document({
      sections: [{
        properties: {},
        children: [
          // Add image if exists
          ...(image ? [new Paragraph({
            children: [
              new ImageRun({
                data: imageBuffer,
                transformation: {
                  width: 200,
                  height: 200,
                },
              })
            ],
            alignment: AlignmentType.CENTER
          })] : []),
          
          // Add content
          contentParagraph,
          
          // Add key points if any
          ...(keyPoints.length > 0 ? [
            new Paragraph({
              text: "Key Points:",
              heading: HeadingLevel.HEADING_2
            }),
            ...keyPointParagraphs
          ] : [])
        ]
      }]
    });

    // Generate and download the document
    Packer.toBlob(doc).then(blob => {
      saveAs(blob, "document.docx");
    });
  };

  // Export as PDF
  const exportToPdf = () => {
    const input = contentRef.current;
    
    html2canvas(input, {
      scale: 2, // Higher quality
      useCORS: true,
      allowTaint: true
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 190; // A4 width in mm
      const pageHeight = 295; // A4 height in mm
      const imgHeight = canvas.height * imgWidth / canvas.width;
      let heightLeft = imgHeight;
      let position = 5;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save("document.pdf");
    });
  };

  // Reset all formatting and content
  const resetAll = () => {
    setContent('');
    setFontStyle('Arial');
    setFontSize(16);
    setFontColor('#000000');
    setIsBold(false);
    setIsItalic(false);
    setIsUnderline(false);
    setKeyPoints([]);
    setImage(null);
    setImagePreview(null);
  };

  return (
    <div className="text-to-word-container">
      <h1>Text to Word Converter</h1>
      
      <div className="controls-panel">
        <div className="format-controls">
          <label>
            Font Style:
            <select value={fontStyle} onChange={(e) => setFontStyle(e.target.value)}>
              {fontOptions.map(font => (
                <option key={font} value={font} style={{ fontFamily: font }}>
                  {font}
                </option>
              ))}
            </select>
          </label>
          
          <label>
            Font Size: {fontSize}px
            <input 
              type="range" 
              min="1" 
              max="30" 
              value={fontSize} 
              onChange={(e) => setFontSize(parseInt(e.target.value))} 
            />
          </label>
          
          <label>
            Font Color:
            <input 
              type="color" 
              value={fontColor} 
              onChange={(e) => setFontColor(e.target.value)} 
            />
          </label>
          
          <button 
            className={isBold ? 'active' : ''} 
            onClick={() => setIsBold(!isBold)}
          >
            Bold
          </button>
          
          <button 
            className={isItalic ? 'active' : ''} 
            onClick={() => setIsItalic(!isItalic)}
          >
            Italic
          </button>
          
          <button 
            className={isUnderline ? 'active' : ''} 
            onClick={() => setIsUnderline(!isUnderline)}
          >
            Underline
          </button>
        </div>
        
        <div className="action-controls">
          <button onClick={addKeyPoint}>Add as Key Point</button>
          
          <label className="image-upload">
            Upload Image
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageUpload} 
              style={{ display: 'none' }} 
            />
          </label>
          
          <button onClick={exportToDocx}>Export as DOCX</button>
          <button onClick={exportToPdf}>Export as PDF</button>
          <button onClick={resetAll}>Reset All</button>
        </div>
      </div>
      
      <div className="content-area">
        <div className="input-section">
          <textarea
            value={content}
            onChange={handleContentChange}
            placeholder="Enter your text here..."
            style={{
              fontFamily: fontStyle,
              fontSize: `${fontSize}px`,
              color: fontColor,
              fontWeight: isBold ? 'bold' : 'normal',
              fontStyle: isItalic ? 'italic' : 'normal',
              textDecoration: isUnderline ? 'underline' : 'none'
            }}
          />
        </div>
        
        <div className="preview-section">
          <h3>Preview</h3>
          <div 
            ref={contentRef}
            className="preview-content"
            style={{
              fontFamily: fontStyle,
              fontSize: `${fontSize}px`,
              color: fontColor,
              fontWeight: isBold ? 'bold' : 'normal',
              fontStyle: isItalic ? 'italic' : 'normal',
              textDecoration: isUnderline ? 'underline' : 'none',
              padding: '10px',
              border: '1px solid #ccc',
              minHeight: '200px'
            }}
          >
            {imagePreview && (
              <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                <img 
                  src={imagePreview} 
                  alt="Uploaded" 
                  style={{ maxWidth: '100%', maxHeight: '200px' }} 
                />
              </div>
            )}
            
            {content}
            
            {keyPoints.length > 0 && (
              <div className="key-points">
                <h4>Key Points:</h4>
                <ul>
                  {keyPoints.map((point, index) => (
                    <li key={index}>
                      {point}
                      <button onClick={() => removeKeyPoint(index)}>Remove</button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TextToWord;