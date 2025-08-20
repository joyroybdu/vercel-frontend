import { useState, useRef } from "react";
import axios from "axios";
import "../css/wordtopdf.css";

const WordToPdf = () => {
  const [filename, setFilename] = useState("document");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const fileInputRef = useRef(null);

  const triggerFileInput = () => fileInputRef.current?.click();

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError("");
    setSuccess("");

    const isDocx =
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      file.name.toLowerCase().endsWith(".docx");

    if (!isDocx) {
      setError("Please select a .docx file. Older .doc is not supported.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("File size must be less than 5MB");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await axios.post("http://localhost:5000/convert", formData, {
        responseType: "blob",
      });

      const pdfBlob = new Blob([response.data], { type: "application/pdf" });
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename}.pdf`;
      a.click();
      URL.revokeObjectURL(url);

      setSuccess("Document converted and downloaded successfully!");
    } catch (err) {
      console.error("Conversion error:", err);
      setError("Failed to convert document. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="word-to-pdf-container">
      <div className="word-to-pdf-card">
        <h2>Word to PDF Converter</h2>
        <p className="subtitle">
          Convert your Word documents to PDF with formatting preserved
        </p>

        <div className="form">
          <div className="form-group">
            <label className="label">Output PDF Filename</label>
            <input
              type="text"
              className="input"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              placeholder="document"
            />
          </div>

          <div className="form-group">
            <label className="label">Select Word Document</label>
            <div className="file-upload-area" onClick={triggerFileInput}>
              <input
                type="file"
                ref={fileInputRef}
                accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                className="file-input"
              />
              <div className="file-upload-content">
                <div className="file-upload-icon">📄</div>
                <p>Click to select a Word document (.docx)</p>
                <p className="file-upload-note">Max file size: 5MB</p>
              </div>
            </div>
          </div>

          {error && <div className="field-error">{error}</div>}
          {success && <div className="field-success">{success}</div>}

          <button
            className="btn primary"
            onClick={triggerFileInput}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span> Converting...
              </>
            ) : (
              "Select Word Document"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WordToPdf;
