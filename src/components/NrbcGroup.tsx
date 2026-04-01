import type { NrbcGroup as NrbcGroupType, NrbcQuantifier } from '../types';
import type { SessionAction } from '../hooks/useSession';

interface Props {
  nrbc: NrbcGroupType;
  dispatch: React.Dispatch<SessionAction>;
}

const NRBC_QUANTIFIERS: { value: NonNullable<NrbcQuantifier>; label: string }[] = [
  { value: 'few', label: 'Few' },
  { value: 'increased', label: 'Increased' },
];

export function NrbcGroup({ nrbc, dispatch }: Props) {
  const handleQuantifierClick = (value: NonNullable<NrbcQuantifier>) => {
    if (!nrbc.nucleatedRbcs) {
      dispatch({ type: 'TOGGLE_NUCLEATED_RBCS' });
      dispatch({ type: 'SET_NRBC_QUANTIFIER', value });
    } else if (nrbc.nucleatedRbcsQuantifier === value) {
      dispatch({ type: 'SET_NRBC_QUANTIFIER', value: null });
    } else {
      dispatch({ type: 'SET_NRBC_QUANTIFIER', value });
    }
  };

  return (
    <div className="nrbc-grid">
      <div className={`nrbc-card${nrbc.nucleatedRbcs ? ' nrbc-card--active' : ''}`}>
        <h3>
          <span className="material-symbols-outlined" style={{ color: 'var(--tertiary)' }}>exposure</span>
          Nucleated RBCs
        </h3>
        <div className="nrbc-controls">
          <label>
            <input
              type="checkbox"
              checked={nrbc.nucleatedRbcs}
              onChange={() => dispatch({ type: 'TOGGLE_NUCLEATED_RBCS' })}
            />
            Nucleated RBCs
          </label>
          {nrbc.nucleatedRbcs && (
            <div className="poik-pills">
              {NRBC_QUANTIFIERS.map((q) => (
                <button
                  key={q.value}
                  type="button"
                  className={`poik-pill${nrbc.nucleatedRbcsQuantifier === q.value ? ' poik-pill--active' : ''}`}
                  onClick={() => handleQuantifierClick(q.value)}
                >
                  {q.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="nrbc-card">
        <h3>
          <span className="material-symbols-outlined" style={{ color: 'var(--tertiary)' }}>restart_alt</span>
          Reticulocytosis
        </h3>
        <label>
          <input
            type="checkbox"
            checked={nrbc.reticulocytosis}
            onChange={() => dispatch({ type: 'TOGGLE_RETICULOCYTOSIS' })}
          />
          Reticulocytosis
        </label>
      </div>
    </div>
  );
}
