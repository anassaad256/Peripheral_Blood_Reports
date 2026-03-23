import type { NrbcGroup as NrbcGroupType } from '../types';
import type { SessionAction } from '../hooks/useSession';

interface Props {
  nrbc: NrbcGroupType;
  dispatch: React.Dispatch<SessionAction>;
}

export function NrbcGroup({ nrbc, dispatch }: Props) {
  return (
    <div className="nrbc-grid">
      <div className="nrbc-card">
        <h3>
          <span className="material-symbols-outlined" style={{ color: 'var(--tertiary)' }}>exposure</span>
          Nucleated RBCs
        </h3>
        <label>
          <input
            type="checkbox"
            checked={nrbc.increasedNucleatedRbcs}
            onChange={() => dispatch({ type: 'TOGGLE_NRBC_INCREASED' })}
          />
          Increased nucleated RBCs
        </label>
      </div>
      <div className="nrbc-card">
        <h3>
          <span className="material-symbols-outlined" style={{ color: 'var(--primary)' }}>keyboard_double_arrow_left</span>
          Granulocytic Left Shift
        </h3>
        <label>
          <input
            type="checkbox"
            checked={nrbc.leftShift}
            onChange={() => dispatch({ type: 'TOGGLE_LEFT_SHIFT' })}
          />
          Left shift present
        </label>
      </div>
    </div>
  );
}
