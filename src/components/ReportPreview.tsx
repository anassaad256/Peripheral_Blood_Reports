interface Props {
  reportText: string;
}

export function ReportPreview({ reportText }: Props) {
  if (!reportText) return null;

  return (
    <div className="report-preview">
      <h2>Generated Report</h2>
      <pre className="report-output">{reportText}</pre>
      <button
        type="button"
        className="btn-copy"
        onClick={() => navigator.clipboard.writeText(reportText)}
      >
        Copy to clipboard
      </button>
    </div>
  );
}
