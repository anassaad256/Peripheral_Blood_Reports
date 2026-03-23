import { useState, useRef, useEffect } from 'react';

interface Props {
  reportText: string;
}

export function ReportPreview({ reportText }: Props) {
  const [editedText, setEditedText] = useState(reportText);
  const [copied, setCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditedText(reportText);
  }, [reportText]);

  if (!reportText) return null;

  function handleCopy() {
    navigator.clipboard.writeText(editedText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function handlePrint() {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;
    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
<title>Blood Smear Report</title>
<style>
  body { font-family: 'Courier New', monospace; font-size: 12pt; line-height: 1.6; margin: 1in; white-space: pre-wrap; word-wrap: break-word; }
  @media print { body { margin: 0.75in; } }
</style>
</head>
<body>${editedText.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</body>
</html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  return (
    <div className="report-preview">
      <h2>Generated Report</h2>
      <textarea
        ref={textareaRef}
        className="report-output report-editable"
        value={editedText}
        onChange={(e) => setEditedText(e.target.value)}
        rows={editedText.split('\n').length + 2}
      />
      <div className="report-actions">
        <button
          type="button"
          className={copied ? 'btn-copy btn-copied' : 'btn-copy'}
          onClick={handleCopy}
        >
          {copied ? 'Copied!' : 'Copy to clipboard'}
        </button>
        <button
          type="button"
          className="btn-print"
          onClick={handlePrint}
        >
          Print / PDF
        </button>
      </div>
    </div>
  );
}
