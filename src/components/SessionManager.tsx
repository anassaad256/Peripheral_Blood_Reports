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

  const handleStartNewSession = useCallback(() => {
    clearSaved();
    dispatch({ type: 'START_NEW_SESSION' });
    setShowResumePrompt(false);
    setPromptDismissed(true);
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
              onClick={handleStartNewSession}
            >
              Start New Session
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (state.view === 'summary') {
    return <SessionSummary session={state} dispatch={dispatch} onStartNewSession={handleStartNewSession} />;
  }

  return (
    <div className="session-layout">
      <CaseSidebar
        cases={state.cases}
        activeCaseIndex={state.activeCaseIndex}
        dispatch={dispatch}
        onStartNewSession={handleStartNewSession}
      />
      <div className="session-main">
        <SessionSetup metadata={state.metadata} dispatch={dispatch} />
        <CaseEditor session={state} dispatch={dispatch} />
      </div>
    </div>
  );
}
