import type { SessionMetadata } from '../types';
import type { SessionAction } from '../hooks/useSession';

interface Props {
  metadata: SessionMetadata;
  dispatch: React.Dispatch<SessionAction>;
}

export function SessionSetup({ metadata, dispatch }: Props) {
  return (
    <div className="session-setup">
      <div className="session-setup-grid">
        <div className="field">
          <label htmlFor="session-date">Date of Analysis</label>
          <input
            id="session-date"
            type="date"
            value={metadata.date}
            onChange={(e) => dispatch({ type: 'SET_SESSION_DATE', value: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor="session-pathologist">Signing Pathologist</label>
          <input
            id="session-pathologist"
            type="text"
            value={metadata.signingPathologist}
            onChange={(e) => dispatch({ type: 'SET_SESSION_PATHOLOGIST', value: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor="session-bill1">Bill 1</label>
          <input
            id="session-bill1"
            type="text"
            value={metadata.billingCode1}
            onChange={(e) => dispatch({ type: 'SET_SESSION_BILL1', value: e.target.value })}
          />
        </div>
        <div className="field">
          <label htmlFor="session-bill2">Bill 2</label>
          <input
            id="session-bill2"
            type="text"
            value={metadata.billingCode2}
            onChange={(e) => dispatch({ type: 'SET_SESSION_BILL2', value: e.target.value })}
            placeholder="Optional"
          />
        </div>
      </div>
    </div>
  );
}
