import type { Session } from '../types';
import type { SessionAction } from '../hooks/useSession';

interface Props {
  session: Session;
  dispatch: React.Dispatch<SessionAction>;
}

export function SessionSummary({ session, dispatch }: Props) {
  const casesWithReports = session.cases.filter((c) => c.generatedReport);

  function handlePrint() {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const escHtml = (s: string) =>
      s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    const coverPage = `
      <div class="cover-page">
        <h1>Peripheral Blood Smears</h1>
        <p class="cover-date">${escHtml(session.metadata.date)}</p>
        <p class="cover-count">${casesWithReports.length} case${casesWithReports.length !== 1 ? 's' : ''}</p>
        ${session.metadata.signingPathologist ? `<p class="cover-pathologist">${escHtml(session.metadata.signingPathologist)}</p>` : ''}
      </div>
    `;

    const casePages = casesWithReports.map((c) => `
      <div class="case-page">
        <pre>${escHtml(c.generatedReport!)}</pre>
      </div>
    `).join('');

    printWindow.document.write(`<!DOCTYPE html>
<html>
<head>
<title>Blood Smear Report - ${escHtml(session.metadata.date)}</title>
<style>
  @page { margin: 0.75in; size: letter; }
  body { font-family: 'Courier New', monospace; font-size: 11pt; line-height: 1.6; margin: 0; padding: 0; }
  .cover-page { display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; text-align: center; page-break-after: always; }
  .cover-page h1 { font-family: 'Manrope', 'Helvetica Neue', sans-serif; font-size: 28pt; margin: 0 0 16px; }
  .cover-date { font-size: 14pt; margin: 4px 0; }
  .cover-count { font-size: 14pt; margin: 4px 0; color: #555; }
  .cover-pathologist { font-size: 12pt; margin: 16px 0 0; font-style: italic; }
  .case-page { page-break-after: always; padding: 0.75in; }
  .case-page pre { white-space: pre-wrap; word-wrap: break-word; margin: 0; }
</style>
</head>
<body>${coverPage}${casePages}</body>
</html>`);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
  }

  return (
    <div className="session-summary">
      <div className="summary-header">
        <div>
          <h2>Session Report</h2>
          <p className="summary-meta">
            {session.metadata.date} &middot; {casesWithReports.length} case{casesWithReports.length !== 1 ? 's' : ''}
            {session.metadata.signingPathologist && ` \u00b7 ${session.metadata.signingPathologist}`}
          </p>
        </div>
        <div className="summary-actions">
          <button
            type="button"
            className="btn-reset"
            onClick={() => dispatch({ type: 'SET_VIEW', view: 'editing' })}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 16 }}>arrow_back</span>
            Back to Edit Cases
          </button>
          <button
            type="button"
            className="btn-generate"
            onClick={handlePrint}
            disabled={casesWithReports.length === 0}
          >
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>print</span>
            Print Report
          </button>
        </div>
      </div>

      {casesWithReports.length === 0 ? (
        <div className="summary-empty">
          <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--outline)' }}>info</span>
          <p>No cases have been added to the report yet.</p>
          <p>Go back and use "Add to Report" on each case.</p>
        </div>
      ) : (
        <div className="summary-cases">
          {casesWithReports.map((c, i) => (
            <div key={c.id} className="summary-case-card">
              <div className="summary-case-header">
                <span className="summary-case-number">Case {i + 1}</span>
                <span className="summary-case-id">{c.caseId || 'No ID'}</span>
              </div>
              <pre className="summary-case-report">{c.generatedReport}</pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
