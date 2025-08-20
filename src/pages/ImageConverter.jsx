import React, { useState, useRef } from 'react';
import '../css/imageconverter.css';

const ImageConverter = () => {
  const [originalImage, setOriginalImage] = useState(null);
  const [originalFormat, setOriginalFormat] = useState('');
  const [convertedImage, setConvertedImage] = useState(null);
  const [targetFormat, setTargetFormat] = useState('jpeg');
  const [isConverting, setIsConverting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);
  const canvasRef = useRef(null);

  const inputFormats = ['jpeg', 'jpg', 'png', 'webp', 'gif', 'bmp'];
  const outputFormats = ['jpeg', 'png', 'webp'];

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setError('');
    setConvertedImage(null);
    const fileExtension = file.name.split('.').pop().toLowerCase();

    if (!inputFormats.includes(fileExtension)) {
      setError(`Unsupported format: ${fileExtension}. Try jpeg, png, or webp.`);
      return;
    }

    setOriginalFormat(fileExtension);

    const reader = new FileReader();
    reader.onload = (e) => setOriginalImage(e.target.result);
    reader.readAsDataURL(file);
  };

  const handleConvert = () => {
    if (!originalImage) return setError('Please upload an image first');
    if (originalFormat === targetFormat)
      return setError('Source and target formats are the same');

    setIsConverting(true);
    setError('');

    try {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        let mimeType = 'image/jpeg';
        if (targetFormat === 'png') mimeType = 'image/png';
        if (targetFormat === 'webp') mimeType = 'image/webp';

        const dataUrl = canvas.toDataURL(mimeType, 0.9);
        setConvertedImage(dataUrl);
        setIsConverting(false);
      };
      img.src = originalImage;
    } catch (err) {
      setError('Conversion failed: ' + err.message);
      setIsConverting(false);
    }
  };

  const handleDownload = () => {
    if (!convertedImage) return;
    const link = document.createElement('a');
    link.href = convertedImage;
    link.download = `converted-image.${targetFormat}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setOriginalImage(null);
    setOriginalFormat('');
    setConvertedImage(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="image-converter dark-theme">
      <h1>Basic Image Format Converter</h1>
      <p className="description">Convert between basic image formats (JPEG, PNG, WebP)</p>

      <div className="converter-container">
        {/* Upload Section */}
        <div className="upload-section">
          <h2>Upload Image</h2>
          <div className="file-input-container">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept=".jpg,.jpeg,.png,.webp,.gif,.bmp"
              className="file-input"
            />
            <button className="browse-btn" onClick={() => fileInputRef.current?.click()}>
              Browse Files
            </button>
          </div>
          {originalFormat && (
            <p className="format-info">
              Detected format: <span className="format-name">{originalFormat.toUpperCase()}</span>
            </p>
          )}
        </div>

        {/* Conversion Settings */}
        <div className="conversion-section">
          <h2>Conversion Settings</h2>
          <div className="format-selector">
            <label htmlFor="targetFormat">Convert to:</label>
            <select
              id="targetFormat"
              value={targetFormat}
              onChange={(e) => setTargetFormat(e.target.value)}
              disabled={!originalImage}
            >
              {outputFormats.map((format) => (
                <option key={format} value={format}>
                  {format.toUpperCase()}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleConvert}
            disabled={!originalImage || isConverting}
            className="convert-btn"
          >
            {isConverting ? 'Converting...' : 'Convert Image'}
          </button>
        </div>
      </div>

      {/* Side-by-side Preview Section */}
      <div className="preview-container">
        {originalImage && (
          <div className="preview-box">
            <h2>Original Image ({originalFormat.toUpperCase()})</h2>
            <img src={originalImage} alt="Original" className="preview-image" />
          </div>
        )}

        {convertedImage && (
          <div className="preview-box">
            <h2>Converted Image ({targetFormat.toUpperCase()})</h2>
            <img src={convertedImage} alt="Converted" className="preview-image" />
            <button onClick={handleDownload} className="download-btn">
              Download {targetFormat.toUpperCase()}
            </button>
          </div>
        )}
      </div>

      {error && <div className="error-message">{error}</div>}

      <canvas ref={canvasRef} style={{ display: 'none' }} />

      {(originalImage || convertedImage) && (
        <button onClick={handleReset} className="reset-btn">
          Start Over
        </button>
      )}
    </div>
  );
};

export default ImageConverter;
