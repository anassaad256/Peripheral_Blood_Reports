import type { CaseData } from '../types';
import type { SessionAction } from '../hooks/useSession';

interface Props {
  cases: CaseData[];
  activeCaseIndex: number;
  dispatch: React.Dispatch<SessionAction>;
}

export function CaseSidebar({ cases, activeCaseIndex, dispatch }: Props) {
  return (
    <aside className="case-sidebar">
      <div className="sidebar-header">
        <h3>Cases ({cases.length})</h3>
        <button
          type="button"
          className="btn-sidebar-add"
          onClick={() => dispatch({ type: 'ADD_CASE' })}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>add</span>
          New
        </button>
      </div>

      <ul className="case-list">
        {cases.map((c, i) => (
          <li
            key={c.id}
            className={`case-item ${i === activeCaseIndex ? 'active' : ''} ${c.generatedReport ? 'has-report' : ''}`}
            onClick={() => dispatch({ type: 'SELECT_CASE', index: i })}
          >
            <div className="case-item-info">
              <span className="case-item-label">
                {c.caseId || `Case ${i + 1}`}
              </span>
              {c.generatedReport && (
                <span className="case-item-badge">
                  <span className="material-symbols-outlined" style={{ fontSize: 14 }}>check_circle</span>
                </span>
              )}
            </div>
            {cases.length > 1 && (
              <button
                type="button"
                className="case-item-delete"
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch({ type: 'DELETE_CASE', index: i });
                }}
                title="Delete case"
              >
                <span className="material-symbols-outlined" style={{ fontSize: 16 }}>close</span>
              </button>
            )}
          </li>
        ))}
      </ul>

      <div className="sidebar-footer">
        <button
          type="button"
          className="btn-end-session"
          onClick={() => dispatch({ type: 'SET_VIEW', view: 'summary' })}
        >
          <span className="material-symbols-outlined" style={{ fontSize: 18 }}>summarize</span>
          End Session &amp; Generate Report
        </button>
      </div>
    </aside>
  );
}
