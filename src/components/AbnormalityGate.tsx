import type { SessionAction } from '../hooks/useSession';

interface Props {
  value: boolean | null;
  dispatch: React.Dispatch<SessionAction>;
}

export function AbnormalityGate({ value, dispatch }: Props) {
  return (
    <div className="gate-card">
      <div className="gate-info">
        <div className="gate-icon">
          <span className="material-symbols-outlined">troubleshoot</span>
        </div>
        <div className="gate-text">
          <h2>Morphological Abnormalities?</h2>
          <p>Gatekeeper for automated versus manual differential reporting.</p>
        </div>
      </div>
      <div className="gate-toggle">
        <button
          type="button"
          className={value === true ? 'active' : ''}
          onClick={() => dispatch({ type: 'SET_HAS_ABNORMALITIES', value: true })}
        >
          Yes
        </button>
        <button
          type="button"
          className={value === false ? 'active' : ''}
          onClick={() => dispatch({ type: 'SET_HAS_ABNORMALITIES', value: false })}
        >
          No
        </button>
      </div>
    </div>
  );
}
