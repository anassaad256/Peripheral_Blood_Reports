import { useSession, hasSavedSession } from '../hooks/useSession';
import { SessionSetup } from './SessionSetup';
import { CaseSidebar } from './CaseSidebar';
import { CaseEditor } from './CaseEditor';
import { SessionSummary } from './SessionSummary';
import { useState, useCallback } from 'react';

export function SessionManager() {
  const { state, dispatch, clearSaved } = useSession();
  const [showResumePrompt, setShowResumePrompt] = useState(() => hasSavedSession());
  const [promptDismissed, setPromptDismissed] = useState(false);
  const [showNewSessionConfirm, setShowNewSessionConfirm] = useState(false);

  const requestNewSession = useCallback(() => {
    setShowNewSessionConfirm(true);
  }, []);

  const confirmNewSession = useCallback(() => {
    clearSaved();
    dispatch({ type: 'START_NEW_SESSION' });
    setShowResumePrompt(false);
    setPromptDismissed(true);
    setShowNewSessionConfirm(false);
  }, [clearSaved, dispatch]);

  // Show resume prompt on first load if saved session exists
  if (showResumePrompt && !promptDismissed) {
    return (
      <div className="resume-prompt">
        <div className="resume-card">
          <div className="resume-icon">
            <span className="material-symbols-outlined" style={{ fontSize: 36 }}>history</span>
          </div>
          <h2>Welcome Back</h2>
          <p>You have a previous session with {state.cases.length} case{state.cases.length !== 1 ? 's' : ''}.</p>
          <div className="resume-actions">
            <button
              type="button"
              className="btn-generate"
              onClick={() => {
                setPromptDismissed(true);
              }}
            >
              Continue Session
            </button>
            <button
              type="button"
              className="btn-reset"
              onClick={confirmNewSession}
            >
              Start New Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  const confirmModal = showNewSessionConfirm && (
    <div className="confirm-overlay" onClick={() => setShowNewSessionConfirm(false)}>
      <div className="confirm-card" onClick={(e) => e.stopPropagation()}>
        <div className="confirm-icon">
          <span className="material-symbols-outlined" style={{ fontSize: 36 }}>warning</span>
        </div>
        <h2>Start New Session?</h2>
        <p>All current session data will be lost. This cannot be undone.</p>
        <div className="confirm-actions">
          <button
            type="button"
            className="btn-confirm-cancel"
            onClick={() => setShowNewSessionConfirm(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn-confirm-destroy"
            onClick={confirmNewSession}
          >
            Start New Session
          </button>
        </div>
      </div>
    </div>
  );

  if (state.view === 'summary') {
    return (
      <>
        <SessionSummary session={state} dispatch={dispatch} onStartNewSession={requestNewSession} />
        {confirmModal}
      </>
    );
  }

  return (
    <>
      <div className="session-layout">
        <CaseSidebar
          cases={state.cases}
          activeCaseIndex={state.activeCaseIndex}
          dispatch={dispatch}
          onStartNewSession={requestNewSession}
        />
        <div className="session-main">
          <SessionSetup metadata={state.metadata} dispatch={dispatch} />
          <CaseEditor session={state} dispatch={dispatch} />
        </div>
      </div>
      {confirmModal}
    </>
  );
}
