import { useState } from 'react';

interface Props {
  text: string;
  onTextChange: (text: string) => void;
  onAddToReport: () => void;
  onAddNewCase: () => void;
  isAdded: boolean;
}

export function CaseReportPreview({ text, onTextChange, onAddToReport, onAddNewCase, isAdded }: Props) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="report-preview">
      <h2>Generated Report</h2>
      <textarea
        className="report-output report-editable"
        value={text}
        onChange={(e) => onTextChange(e.target.value)}
        rows={text.split('\n').length + 2}
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
          className={isAdded ? 'btn-add-report btn-added' : 'btn-add-report'}
          onClick={onAddToReport}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>
            {isAdded ? 'check_circle' : 'playlist_add'}
          </span>
          {isAdded ? 'Added to Report' : 'Add to Report'}
        </button>
        {isAdded && (
          <button
            type="button"
            className="btn-add-report"
            onClick={onAddNewCase}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
            New Case
          </button>
        )}
      </div>
    </div>
  );
}
